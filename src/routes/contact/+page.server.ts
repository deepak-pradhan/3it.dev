import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '$lib/server/rate-limit';
import { createContactUsHistory } from '$lib/server/db';

/**
 * Escape HTML special characters to prevent XSS in email templates
 */
function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;'
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * Sanitize input by removing HTML tags to prevent stored XSS
 */
function sanitizeInput(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize email header values to prevent header injection attacks
 */
function sanitizeEmailHeader(text: string): string {
  return text.replace(/[\r\n]/g, '').trim();
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing SMTP configuration');
  }

  const port = parseInt(SMTP_PORT || '587');

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
}

export const actions: Actions = {
  default: async ({ request }) => {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(request, 'contact');
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.contact);
    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, {
        error: `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`
      });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues?.[0]?.message || 'Invalid form data';
      return fail(400, { error: firstError });
    }

    const { name, email, company, message } = parsed.data;

    // Escape all user inputs to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = company ? escapeHtml(company) : '';
    const safeMessage = escapeHtml(message);

    try {
      const transporter = getTransporter();
      const fromAddress = env.SMTP_FROM || env.SMTP_USER;
      if (!fromAddress) {
        throw new Error('Missing SMTP_FROM or SMTP_USER configuration');
      }
      const adminEmail = env.ADMIN_EMAIL;
      if (!adminEmail) {
        throw new Error('Missing ADMIN_EMAIL configuration');
      }

      // Send notification to admin (sanitize headers to prevent injection)
      await transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        replyTo: sanitizeEmailHeader(email),
        subject: sanitizeEmailHeader(`[Contact] ${safeCompany ? `${safeCompany} - ` : ''}${safeName}`),
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { background: #047857; color: white; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
              .details { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
              .row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .row:last-child { border-bottom: none; }
              .label { font-weight: 600; color: #6b7280; }
              .message-box { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-top: 10px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
                <p>3IT.dev</p>
              </div>

              <div class="details">
                <div class="row">
                  <span class="label">Name:</span> ${safeName}
                </div>
                <div class="row">
                  <span class="label">Email:</span> <a href="mailto:${safeEmail}">${safeEmail}</a>
                </div>
                ${safeCompany ? `<div class="row"><span class="label">Company:</span> ${safeCompany}</div>` : ''}
                <div class="row">
                  <span class="label">Message:</span>
                  <div class="message-box">${safeMessage}</div>
                </div>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                Reply directly to this email to respond to ${safeName}.
              </p>
            </div>
          </body>
          </html>
        `
      });

      // Send confirmation to user
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: 'Thank you for contacting 3IT.dev',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #10b981; }
              .success-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
              .checkmark { font-size: 48px; margin-bottom: 10px; }
              .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">3IT.dev</div>
              </div>

              <p>Hi ${safeName},</p>

              <p>Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.</p>

              <div class="success-box">
                <div class="checkmark">&#10003;</div>
                <p><strong>Message received!</strong></p>
              </div>

              <p>In the meantime, feel free to explore our products at <a href="https://3it.dev/products">3it.dev/products</a>.</p>

              <div class="footer">
                <p>&copy; 3IT.dev - Enterprise Solutions</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      // Store contact in database (sanitized to prevent stored XSS)
      createContactUsHistory({
        name: sanitizeInput(name),
        email,
        company: company ? sanitizeInput(company) : undefined,
        message: sanitizeInput(message)
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending contact email:', dev ? error : 'See server logs');
      return fail(500, { error: 'Failed to send message. Please try again.' });
    }
  }
};
