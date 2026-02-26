import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { env } from '$env/dynamic/private';

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error('Missing SMTP configuration. Check your .env file.');
    }

    const port = parseInt(SMTP_PORT || '587');

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  return transporter;
}

function getFromAddress(): string {
  return env.SMTP_FROM || env.SMTP_USER || 'noreply@3it.dev';
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(to: string, code: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #10b981; }
        .code-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #047857; font-family: monospace; }
        .expires { color: #6b7280; font-size: 14px; margin-top: 10px; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">3IT.dev</div>
          <p>Phyto Platform Demo Request</p>
        </div>

        <p>Hi ${name},</p>

        <p>Thank you for your interest in the Phyto Platform. Please use the verification code below to confirm your demo request:</p>

        <div class="code-box">
          <div class="code">${code}</div>
          <div class="expires">This code expires in 10 minutes</div>
        </div>

        <p>If you didn't request this demo, you can safely ignore this email.</p>

        <div class="footer">
          <p>&copy; 3IT.dev - Enterprise Solutions</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from: getFromAddress(),
    to,
    subject: 'Verify your Phyto Platform demo request - 3IT.dev',
    html
  });
}

export async function sendDemoConfirmationEmail(
  to: string,
  name: string,
  preferredDatetime: string
): Promise<void> {
  const formattedDate = new Date(preferredDatetime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = `
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
        .datetime { font-size: 18px; font-weight: 600; color: #047857; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">3IT.dev</div>
          <p>Phyto Platform Demo Request Confirmed</p>
        </div>

        <p>Hi ${name},</p>

        <p>Your demo request for the Phyto Platform has been confirmed!</p>

        <div class="success-box">
          <div class="checkmark">&#10003;</div>
          <p>Preferred time:</p>
          <div class="datetime">${formattedDate}</div>
        </div>

        <p>Our team will review your request and get back to you shortly to confirm the demo schedule.</p>

        <p>In the meantime, feel free to explore our other products at <a href="https://3it.dev/products">3it.dev/products</a>.</p>

        <div class="footer">
          <p>&copy; 3IT.dev - Enterprise Solutions</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await getTransporter().sendMail({
    from: getFromAddress(),
    to,
    subject: 'Demo Request Confirmed - Phyto Platform - 3IT.dev',
    html
  });
}

export async function sendAdminNotificationEmail(request: {
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string | null;
  preferred_datetime: string;
}): Promise<void> {
  const formattedDate = new Date(request.preferred_datetime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 30px; background: #047857; color: white; padding: 20px; border-radius: 12px; }
        .details { background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .label { font-weight: 600; width: 150px; color: #6b7280; }
        .value { flex: 1; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Demo Request</h2>
          <p>Phyto Platform</p>
        </div>

        <div class="details">
          <div class="row">
            <span class="label">Name:</span>
            <span class="value">${request.name}</span>
          </div>
          <div class="row">
            <span class="label">Organization:</span>
            <span class="value">${request.organization}</span>
          </div>
          <div class="row">
            <span class="label">Role:</span>
            <span class="value">${request.role}</span>
          </div>
          <div class="row">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:${request.email}">${request.email}</a></span>
          </div>
          <div class="row">
            <span class="label">Phone:</span>
            <span class="value">${request.phone || 'Not provided'}</span>
          </div>
          <div class="row" style="border-bottom: none;">
            <span class="label">Preferred Time:</span>
            <span class="value">${formattedDate}</span>
          </div>
        </div>

        <p>Please respond to this demo request within 24 hours.</p>
      </div>
    </body>
    </html>
  `;

  const from = getFromAddress();
  const adminEmail = env.ADMIN_EMAIL || 'deepak.pradhan@gmail.com';
  await getTransporter().sendMail({
    from,
    to: adminEmail,
    subject: `[Demo Request] ${request.organization} - ${request.name}`,
    html
  });
}
