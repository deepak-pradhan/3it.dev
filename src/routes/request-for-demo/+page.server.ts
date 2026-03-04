import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { timingSafeEqual } from 'crypto';
import { dev } from '$app/environment';
import {
  createDemoRequest,
  getDemoRequestById,
  getDemoRequestByCode,
  verifyDemoRequest,
  updateVerificationCode,
  getPendingRequestByEmail
} from '$lib/server/db';
import {
  generateVerificationCode,
  sendVerificationEmail,
  sendDemoConfirmationEmail,
  sendAdminNotificationEmail
} from '$lib/server/email';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '$lib/server/rate-limit';
import type { Actions } from './$types';

// Phone number validation regex - allows common international formats
// Examples: +1 (555) 123-4567, +44 20 7946 0958, 555-123-4567
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

/**
 * Sanitize input by removing HTML tags to prevent stored XSS
 */
function sanitizeInput(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

const submitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(2, 'Organization must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 7 && val.length <= 20 && phoneRegex.test(val)),
      { message: 'Please enter a valid phone number' }
    ),
  preferred_datetime: z.string().min(1, 'Please select a preferred date and time')
});

const verifySchema = z.object({
  requestId: z.string().transform(Number),
  code: z.string().length(6, 'Code must be 6 digits')
});

export const actions: Actions = {
  submit: async ({ request }) => {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request, 'demo-request');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.demoRequest);
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, {
        error: `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = submitSchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message });
    }

    // Check if there's already a pending request for this email
    const existingRequest = getPendingRequestByEmail(parsed.data.email);
    if (existingRequest) {
      return { needsVerification: true, requestId: existingRequest.id };
    }

    const code = generateVerificationCode();
    const codeExpiresAt = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    try {
      // Sanitize inputs to prevent stored XSS
      const demoRequest = createDemoRequest({
        name: sanitizeInput(parsed.data.name),
        organization: sanitizeInput(parsed.data.organization),
        role: sanitizeInput(parsed.data.role),
        email: parsed.data.email,
        phone: parsed.data.phone ? sanitizeInput(parsed.data.phone) : undefined,
        preferred_datetime: parsed.data.preferred_datetime,
        verification_code: code,
        code_expires_at: codeExpiresAt
      });

      await sendVerificationEmail(parsed.data.email, code, parsed.data.name);

      return { needsVerification: true, requestId: demoRequest.id };
    } catch (error) {
      console.error('Error creating demo request:', dev ? error : 'See server logs');
      return fail(500, { error: 'Failed to process your request. Please try again.' });
    }
  },

  verify: async ({ request }) => {
    // Rate limiting check for verification attempts (brute force protection)
    const rateLimitKey = getRateLimitKey(request, 'verify-code');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.verifyCode);
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, {
        error: `Too many verification attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        needsVerification: true
      });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = verifySchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message, needsVerification: true, requestId: data.requestId });
    }

    const demoRequest = getDemoRequestById(parsed.data.requestId);
    if (!demoRequest) {
      return fail(404, { error: 'Request not found', needsVerification: true, requestId: parsed.data.requestId });
    }

    if (demoRequest.email_verified) {
      return { success: true };
    }

    const now = Math.floor(Date.now() / 1000);
    if (!demoRequest.code_expires_at || demoRequest.code_expires_at < now) {
      return fail(400, { error: 'Code has expired. Please request a new one.', needsVerification: true, requestId: parsed.data.requestId });
    }

    // Use timing-safe comparison to prevent timing attacks
    const codeBuffer = Buffer.from(demoRequest.verification_code || '');
    const inputBuffer = Buffer.from(parsed.data.code);
    if (codeBuffer.length !== inputBuffer.length || !timingSafeEqual(codeBuffer, inputBuffer)) {
      return fail(400, { error: 'Invalid verification code', needsVerification: true, requestId: parsed.data.requestId });
    }

    try {
      verifyDemoRequest(demoRequest.id);

      // Send confirmation emails
      await Promise.all([
        sendDemoConfirmationEmail(demoRequest.email, demoRequest.name, demoRequest.preferred_datetime),
        sendAdminNotificationEmail({
          name: demoRequest.name,
          organization: demoRequest.organization,
          role: demoRequest.role,
          email: demoRequest.email,
          phone: demoRequest.phone,
          preferred_datetime: demoRequest.preferred_datetime
        })
      ]);

      return { success: true };
    } catch (error) {
      console.error('Error verifying demo request:', dev ? error : 'See server logs');
      return fail(500, { error: 'Failed to verify. Please try again.', needsVerification: true, requestId: parsed.data.requestId });
    }
  },

  resend: async ({ request }) => {
    // Rate limiting check for resend attempts
    const rateLimitKey = getRateLimitKey(request, 'resend-code');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.resendCode);
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, {
        error: `Too many resend attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        needsVerification: true
      });
    }

    const formData = await request.formData();
    const requestId = Number(formData.get('requestId'));

    if (!requestId) {
      return fail(400, { error: 'Invalid request' });
    }

    const demoRequest = getDemoRequestById(requestId);
    if (!demoRequest) {
      return fail(404, { error: 'Request not found' });
    }

    if (demoRequest.email_verified) {
      return { success: true };
    }

    const code = generateVerificationCode();
    const codeExpiresAt = Math.floor(Date.now() / 1000) + 600;

    try {
      updateVerificationCode(demoRequest.id, code, codeExpiresAt);
      await sendVerificationEmail(demoRequest.email, code, demoRequest.name);

      return { needsVerification: true, requestId: demoRequest.id, message: 'New code sent!' };
    } catch (error) {
      console.error('Error resending verification code:', dev ? error : 'See server logs');
      return fail(500, { error: 'Failed to resend code. Please try again.', needsVerification: true, requestId });
    }
  }
};
