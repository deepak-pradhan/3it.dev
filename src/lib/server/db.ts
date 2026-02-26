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
  }

  return db;
}

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

  return getDemoRequestById(result.lastInsertRowid as number)!;
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

export default getDb;
