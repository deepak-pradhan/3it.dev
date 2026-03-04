import Database from 'better-sqlite3';
import { building } from '$app/environment';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/var/lib/3it/demo-requests.db'
  : 'data/demo-requests.db';

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (building) {
    throw new Error('Cannot access database during build');
  }

  if (!db) {
    // Ensure directory exists
    const dir = dirname(DB_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');

    // Demo requests table
    db.exec(`
      CREATE TABLE IF NOT EXISTS demo_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        organization TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        preferred_datetime TEXT NOT NULL,
        email_verified INTEGER DEFAULT 0,
        verification_code TEXT,
        code_expires_at INTEGER,
        created_at INTEGER DEFAULT (unixepoch()),
        status TEXT DEFAULT 'pending'
      );

      CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
      CREATE INDEX IF NOT EXISTS idx_demo_requests_verification_code ON demo_requests(verification_code);
    `);

    // Contact Us History table
    db.exec(`
      CREATE TABLE IF NOT EXISTS contact_us_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        message TEXT NOT NULL,
        created_at INTEGER DEFAULT (unixepoch()),
        status TEXT DEFAULT 'unread'
      );

      CREATE INDEX IF NOT EXISTS idx_contact_us_history_email ON contact_us_history(email);
      CREATE INDEX IF NOT EXISTS idx_contact_us_history_status ON contact_us_history(status);
      CREATE INDEX IF NOT EXISTS idx_contact_us_history_created_at ON contact_us_history(created_at);
    `);

    // Admin sessions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY,
        created_at INTEGER DEFAULT (unixepoch()),
        expires_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
    `);
  }

  return db;
}

// ===========================================
// Demo Requests
// ===========================================

export interface DemoRequest {
  id: number;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string | null;
  preferred_datetime: string;
  email_verified: number;
  verification_code: string | null;
  code_expires_at: number | null;
  created_at: number;
  status: string;
}

export function createDemoRequest(data: {
  name: string;
  organization: string;
  role: string;
  email: string;
  phone?: string;
  preferred_datetime: string;
  verification_code: string;
  code_expires_at: number;
}): DemoRequest {
  const stmt = getDb().prepare(`
    INSERT INTO demo_requests (name, organization, role, email, phone, preferred_datetime, verification_code, code_expires_at)
    VALUES (@name, @organization, @role, @email, @phone, @preferred_datetime, @verification_code, @code_expires_at)
  `);

  const result = stmt.run({
    name: data.name,
    organization: data.organization,
    role: data.role,
    email: data.email,
    phone: data.phone || null,
    preferred_datetime: data.preferred_datetime,
    verification_code: data.verification_code,
    code_expires_at: data.code_expires_at
  });

  const demoRequest = getDemoRequestById(result.lastInsertRowid as number);
  if (!demoRequest) {
    throw new Error('Failed to retrieve created demo request');
  }
  return demoRequest;
}

export function getDemoRequestById(id: number): DemoRequest | undefined {
  const stmt = getDb().prepare('SELECT * FROM demo_requests WHERE id = ?');
  return stmt.get(id) as DemoRequest | undefined;
}

export function getDemoRequestByCode(code: string): DemoRequest | undefined {
  const stmt = getDb().prepare('SELECT * FROM demo_requests WHERE verification_code = ?');
  return stmt.get(code) as DemoRequest | undefined;
}

export function verifyDemoRequest(id: number): void {
  const stmt = getDb().prepare(`
    UPDATE demo_requests
    SET email_verified = 1, verification_code = NULL, code_expires_at = NULL, status = 'verified'
    WHERE id = ?
  `);
  stmt.run(id);
}

export function updateVerificationCode(id: number, code: string, expiresAt: number): void {
  const stmt = getDb().prepare(`
    UPDATE demo_requests
    SET verification_code = ?, code_expires_at = ?
    WHERE id = ?
  `);
  stmt.run(code, expiresAt, id);
}

export function getPendingRequestByEmail(email: string): DemoRequest | undefined {
  const stmt = getDb().prepare(`
    SELECT * FROM demo_requests
    WHERE email = ? AND email_verified = 0 AND code_expires_at > unixepoch()
    ORDER BY created_at DESC
    LIMIT 1
  `);
  return stmt.get(email) as DemoRequest | undefined;
}

export function getAllDemoRequests(options?: {
  status?: string;
  emailVerified?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'name' | 'email' | 'organization';
  orderDir?: 'ASC' | 'DESC';
}): DemoRequest[] {
  let query = 'SELECT * FROM demo_requests';
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options?.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.emailVerified !== undefined) {
    conditions.push('email_verified = ?');
    params.push(options.emailVerified ? 1 : 0);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Whitelist validation to prevent SQL injection
  const validOrderBy = ['created_at', 'name', 'email', 'organization'];
  const validOrderDir = ['ASC', 'DESC'];
  const orderBy = options?.orderBy && validOrderBy.includes(options.orderBy) ? options.orderBy : 'created_at';
  const orderDir = options?.orderDir && validOrderDir.includes(options.orderDir) ? options.orderDir : 'DESC';
  query += ` ORDER BY ${orderBy} ${orderDir}`;

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  if (options?.offset) {
    query += ' OFFSET ?';
    params.push(options.offset);
  }

  return getDb().prepare(query).all(...params) as DemoRequest[];
}

export function getDemoRequestsCount(options?: { status?: string; emailVerified?: boolean }): number {
  let query = 'SELECT COUNT(*) as count FROM demo_requests';
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (options?.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.emailVerified !== undefined) {
    conditions.push('email_verified = ?');
    params.push(options.emailVerified ? 1 : 0);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  return (getDb().prepare(query).get(...params) as { count: number }).count;
}

export function updateDemoRequestStatus(id: number, status: string): void {
  getDb().prepare('UPDATE demo_requests SET status = ? WHERE id = ?').run(status, id);
}

// ===========================================
// Contact Us History
// ===========================================

export interface ContactUsHistory {
  id: number;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: number;
  status: string;
}

export function createContactUsHistory(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): ContactUsHistory {
  const stmt = getDb().prepare(`
    INSERT INTO contact_us_history (name, email, company, message)
    VALUES (@name, @email, @company, @message)
  `);

  const result = stmt.run({
    name: data.name,
    email: data.email,
    company: data.company || null,
    message: data.message
  });

  const contact = getContactUsHistoryById(result.lastInsertRowid as number);
  if (!contact) {
    throw new Error('Failed to retrieve created contact');
  }
  return contact;
}

export function getContactUsHistoryById(id: number): ContactUsHistory | undefined {
  return getDb().prepare('SELECT * FROM contact_us_history WHERE id = ?').get(id) as ContactUsHistory | undefined;
}

export function getAllContactUsHistory(options?: {
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'name' | 'email';
  orderDir?: 'ASC' | 'DESC';
}): ContactUsHistory[] {
  let query = 'SELECT * FROM contact_us_history';
  const params: (string | number)[] = [];

  if (options?.status) {
    query += ' WHERE status = ?';
    params.push(options.status);
  }

  // Whitelist validation to prevent SQL injection
  const validOrderBy = ['created_at', 'name', 'email'];
  const validOrderDir = ['ASC', 'DESC'];
  const orderBy = options?.orderBy && validOrderBy.includes(options.orderBy) ? options.orderBy : 'created_at';
  const orderDir = options?.orderDir && validOrderDir.includes(options.orderDir) ? options.orderDir : 'DESC';
  query += ` ORDER BY ${orderBy} ${orderDir}`;

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  if (options?.offset) {
    query += ' OFFSET ?';
    params.push(options.offset);
  }

  return getDb().prepare(query).all(...params) as ContactUsHistory[];
}

export function getContactUsHistoryCount(status?: string): number {
  let query = 'SELECT COUNT(*) as count FROM contact_us_history';
  if (status) {
    query += ' WHERE status = ?';
    return (getDb().prepare(query).get(status) as { count: number }).count;
  }
  return (getDb().prepare(query).get() as { count: number }).count;
}

export function updateContactUsHistoryStatus(id: number, status: string): void {
  getDb().prepare('UPDATE contact_us_history SET status = ? WHERE id = ?').run(status, id);
}

// ===========================================
// Admin Sessions
// ===========================================

export function createAdminSession(sessionId: string, expiresAt: number): void {
  getDb().prepare(`
    INSERT INTO admin_sessions (id, expires_at)
    VALUES (?, ?)
  `).run(sessionId, expiresAt);
}

export function getAdminSession(sessionId: string): { id: string; expires_at: number } | undefined {
  const now = Math.floor(Date.now() / 1000);
  return getDb().prepare(`
    SELECT id, expires_at FROM admin_sessions
    WHERE id = ? AND expires_at > ?
  `).get(sessionId, now) as { id: string; expires_at: number } | undefined;
}

export function deleteAdminSession(sessionId: string): void {
  getDb().prepare('DELETE FROM admin_sessions WHERE id = ?').run(sessionId);
}

export function cleanupExpiredSessions(): void {
  const now = Math.floor(Date.now() / 1000);
  getDb().prepare('DELETE FROM admin_sessions WHERE expires_at < ?').run(now);
}

export default getDb;
