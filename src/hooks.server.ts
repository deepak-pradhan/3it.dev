import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  // Check for admin session cookie
  const sessionId = event.cookies.get('admin_session');

  if (sessionId && validateSession(sessionId)) {
    event.locals.isAdmin = true;
  } else {
    event.locals.isAdmin = false;
  }

  // Protect admin routes (except login)
  if (event.url.pathname.startsWith('/admin') &&
      !event.url.pathname.startsWith('/admin/login')) {
    if (!event.locals.isAdmin) {
      return new Response(null, {
        status: 302,
        headers: { Location: '/admin/login' }
      });
    }
  }

  const response = await resolve(event);

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy - adjust as needed for your application
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for SvelteKit
    "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for component styles
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  return response;
};
