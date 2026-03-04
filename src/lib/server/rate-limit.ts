/**
 * Simple in-memory rate limiter for form submissions
 * Prevents abuse and email bombing attacks
 */

import { createHash } from 'crypto';
import { env } from '$env/dynamic/private';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_ENTRIES = 10000; // Prevent memory exhaustion attacks

// Clean up old entries periodically (every minute)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  // Emergency cleanup if too large (keep newest entries)
  if (rateLimitStore.size > MAX_ENTRIES) {
    const entries = Array.from(rateLimitStore.entries());
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
    entries.slice(0, Math.floor(MAX_ENTRIES / 2)).forEach(([key]) => {
      rateLimitStore.delete(key);
    });
  }
}, 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, email)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // No entry or expired, create new one
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs
    };
  }

  // Entry exists and is still valid
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: entry.resetTime - now
  };
}

/**
 * Create a rate limit key from request info
 * Uses IP + User-Agent fingerprinting for better security
 * Only trusts proxy headers when TRUSTED_PROXY=true is set
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  let ip = 'unknown';

  // Only trust proxy headers if explicitly configured
  const trustProxy = env.TRUSTED_PROXY === 'true';

  if (trustProxy) {
    // Behind a trusted reverse proxy (nginx, Cloudflare, etc.)
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    ip = cfConnectingIp || forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  } else {
    // Not behind trusted proxy - use last IP in chain (less spoofable)
    // or fallback to x-real-ip which is typically set by the web server
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    ip = forwarded?.split(',').pop()?.trim() || realIp || 'unknown';
  }

  // Add user-agent to fingerprint for additional protection
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Hash the fingerprint to prevent key enumeration
  const fingerprint = createHash('sha256')
    .update(`${ip}:${userAgent}`)
    .digest('hex')
    .substring(0, 16);

  return `${prefix}:${fingerprint}`;
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // Contact form: 5 submissions per 15 minutes
  contact: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000
  },
  // Demo request: 3 submissions per 30 minutes
  demoRequest: {
    maxRequests: 3,
    windowMs: 30 * 60 * 1000
  },
  // Verification code resend: 3 attempts per 10 minutes
  resendCode: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000
  },
  // Verification attempts: 5 per 10 minutes (brute force protection)
  verifyCode: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000
  },
  // Admin actions: 100 per 5 minutes (prevents DoS while allowing normal use)
  adminAction: {
    maxRequests: 100,
    windowMs: 5 * 60 * 1000
  }
} as const;
