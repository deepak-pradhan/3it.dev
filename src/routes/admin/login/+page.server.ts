import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { verifyPassword, createSession, destroySession } from '$lib/server/auth';
import { checkRateLimit, getRateLimitKey } from '$lib/server/rate-limit';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.isAdmin) {
    redirect(302, '/admin');
  }
};

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, 'admin-login');
    const rateLimitResult = checkRateLimit(rateLimitKey, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000 // 5 attempts per 15 minutes
    });

    if (!rateLimitResult.allowed) {
      const minutes = Math.ceil(rateLimitResult.resetIn / 60000);
      return fail(429, { error: `Too many login attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` });
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message });
    }

    if (!await verifyPassword(parsed.data.password)) {
      return fail(401, { error: 'Invalid password' });
    }

    // Fix session fixation: destroy any existing session before creating new one
    const existingSessionId = cookies.get('admin_session');
    if (existingSessionId) {
      destroySession(existingSessionId);
      cookies.delete('admin_session', { path: '/' });
    }

    const { sessionId, expiresAt } = createSession();

    cookies.set('admin_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Strict for admin sessions to prevent CSRF
      maxAge: expiresAt - Math.floor(Date.now() / 1000)
    });

    redirect(302, '/admin');
  }
};
