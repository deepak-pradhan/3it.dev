import { fail } from '@sveltejs/kit';
import { z } from 'zod';
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
import type { Actions } from './$types';

const submitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  organization: z.string().min(2, 'Organization must be at least 2 characters'),
  role: z.string().min(2, 'Role must be at least 2 characters'),
  phone: z.string().optional(),
  preferred_datetime: z.string().min(1, 'Please select a preferred date and time')
});

const verifySchema = z.object({
  requestId: z.string().transform(Number),
  code: z.string().length(6, 'Code must be 6 digits')
});

export const actions: Actions = {
  submit: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = submitSchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.errors[0].message });
    }

    // Check if there's already a pending request for this email
    const existingRequest = getPendingRequestByEmail(parsed.data.email);
    if (existingRequest) {
      return { needsVerification: true, requestId: existingRequest.id };
    }

    const code = generateVerificationCode();
    const codeExpiresAt = Math.floor(Date.now() / 1000) + 600; // 10 minutes

    try {
      console.log('Creating demo request for:', parsed.data.email);
      const demoRequest = createDemoRequest({
        name: parsed.data.name,
        organization: parsed.data.organization,
        role: parsed.data.role,
        email: parsed.data.email,
        phone: parsed.data.phone,
        preferred_datetime: parsed.data.preferred_datetime,
        verification_code: code,
        code_expires_at: codeExpiresAt
      });
      console.log('Demo request created with ID:', demoRequest.id);

      console.log('Sending verification email to:', parsed.data.email);
      await sendVerificationEmail(parsed.data.email, code, parsed.data.name);
      console.log('Verification email sent successfully');

      return { needsVerification: true, requestId: demoRequest.id };
    } catch (error) {
      console.error('Error creating demo request:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return fail(500, { error: 'Failed to process your request. Please try again.' });
    }
  },

  verify: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = verifySchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.errors[0].message, needsVerification: true, requestId: data.requestId });
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

    if (demoRequest.verification_code !== parsed.data.code) {
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
      console.error('Error verifying demo request:', error);
      return fail(500, { error: 'Failed to verify. Please try again.', needsVerification: true, requestId: parsed.data.requestId });
    }
  },

  resend: async ({ request }) => {
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
      console.error('Error resending verification code:', error);
      return fail(500, { error: 'Failed to resend code. Please try again.', needsVerification: true, requestId });
    }
  }
};
