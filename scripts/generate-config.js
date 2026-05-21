/**
 * Vercel 빌드 시 환경변수로 js/config.js 생성
 * SUPABASE_URL, SUPABASE_ANON_KEY
 */
const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const anonKey = process.env.SUPABASE_ANON_KEY || '';
const tableName = process.env.SUPABASE_TABLE || 'reservations';

const content = `/**
 * Auto-generated — do not edit manually
 * Generated at: ${new Date().toISOString()}
 */
const SUPABASE_CONFIG = {
  url: '${url}',
  anonKey: '${anonKey}',
  tableName: '${tableName}'
};
`;

const outPath = path.join(__dirname, '..', 'js', 'config.js');
fs.writeFileSync(outPath, content, 'utf8');

if (!url || !anonKey) {
  console.warn('[AETHER] SUPABASE_URL 또는 SUPABASE_ANON_KEY 미설정 — 로컬/데모 모드');
} else {
  console.log('[AETHER] js/config.js 생성 완료');
}
