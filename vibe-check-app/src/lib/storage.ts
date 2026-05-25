import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHECKS_FILE = path.join(DATA_DIR, 'checks.json');
const EMAILS_FILE = path.join(DATA_DIR, 'emails.json');

// Ensure data directory and files exist
function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CHECKS_FILE)) {
    fs.writeFileSync(CHECKS_FILE, JSON.stringify({}));
  }
  if (!fs.existsSync(EMAILS_FILE)) {
    fs.writeFileSync(EMAILS_FILE, JSON.stringify([]));
  }
}

export interface CheckResult {
  id: string;
  timestamp: string;
  contentType: string;
  originalText: string;
  score: number;
  verdict_band: 'hard_cringe' | 'needs_work' | 'clean' | 'fire';
  verdict_label: string;
  issues: string[];
  rewrite_fix: string;
  rewrite_genz: string;
  ip: string;
  brandProfileUsed?: boolean;
}

export interface EmailRecord {
  email: string;
  timestamp: string;
  ip: string;
}

export function saveCheck(check: CheckResult): void {
  initStorage();
  try {
    const data = fs.readFileSync(CHECKS_FILE, 'utf-8');
    const checks = JSON.parse(data || '{}');
    checks[check.id] = check;
    fs.writeFileSync(CHECKS_FILE, JSON.stringify(checks, null, 2));
  } catch (error) {
    console.error('Error saving check:', error);
  }
}

export function getCheck(id: string): CheckResult | null {
  initStorage();
  try {
    const data = fs.readFileSync(CHECKS_FILE, 'utf-8');
    const checks = JSON.parse(data || '{}');
    return checks[id] || null;
  } catch (error) {
    console.error('Error reading check:', error);
    return null;
  }
}

export function saveEmail(record: EmailRecord): void {
  initStorage();
  try {
    const data = fs.readFileSync(EMAILS_FILE, 'utf-8');
    const emails = JSON.parse(data || '[]');
    emails.push(record);
    fs.writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
  } catch (error) {
    console.error('Error saving email:', error);
  }
}

export function getIpCheckCountToday(ip: string): number {
  initStorage();
  try {
    const data = fs.readFileSync(CHECKS_FILE, 'utf-8');
    const checks = JSON.parse(data || '{}') as Record<string, CheckResult>;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    return Object.values(checks).filter(check => {
      const checkDate = new Date(check.timestamp).toISOString().split('T')[0];
      return check.ip === ip && checkDate === today;
    }).length;
  } catch (error) {
    console.error('Error getting IP check count:', error);
    return 0;
  }
}

export function isEmailRegistered(ip: string): boolean {
  initStorage();
  try {
    const data = fs.readFileSync(EMAILS_FILE, 'utf-8');
    const emails = JSON.parse(data || '[]') as EmailRecord[];
    return emails.some(record => record.ip === ip);
  } catch (error) {
    console.error('Error checking if email registered:', error);
    return false;
  }
}
