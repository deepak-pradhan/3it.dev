import { env } from '$env/dynamic/private';
import { randomBytes, timingSafeEqual } from 'crypto';
import bcrypt from 'bcrypt';
import { createAdminSession, getAdminSession, deleteAdminSession, cleanupExpiredSessions } from './db';

const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Verify the admin password using bcrypt
 * Supports both hashed passwords (ADMIN_PASSWORD_HASH) and legacy plaintext (ADMIN_PASSWORD)
 */
export async function verifyPassword(password: string): Promise<boolean> {
  // Prefer hashed password
  const hashedPassword = env.ADMIN_PASSWORD_HASH;
  if (hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch {
      console.error('Error comparing password hash');
      return false;
    }
  }

  // Fallback to legacy plaintext comparison (for backwards compatibility)
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD environment variable configured');
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  const passwordBuffer = Buffer.from(password);
  const adminBuffer = Buffer.from(adminPassword);
  if (passwordBuffer.length !== adminBuffer.length) {
    return false;
  }
  return timingSafeEqual(passwordBuffer, adminBuffer);
}

/**
 * Generate a bcrypt hash for a password (utility function for setup)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Create a new admin session
 */
export function createSession(): { sessionId: string; expiresAt: number } {
  // Clean up expired sessions periodically
  cleanupExpiredSessions();

  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION;

  createAdminSession(sessionId, expiresAt);

  return { sessionId, expiresAt };
}

/**
 * Validate an existing session
 */
export function validateSession(sessionId: string): boolean {
  const session = getAdminSession(sessionId);
  return !!session;
}

/**
 * Delete a session (logout)
 */
export function destroySession(sessionId: string): void {
  deleteAdminSession(sessionId);
}
