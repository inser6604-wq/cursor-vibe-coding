/**
 * Vercel 빌드 시 환경변수로 js/config.js 생성
 * SUPABASE_URL, SUPABASE_ANON_KEY
 */
const fs = require('fs');
const path = require('path');

const url = (process.env.SUPABASE_URL || '').trim();
const anonKey = (process.env.SUPABASE_ANON_KEY || '').trim();
const tableName = (process.env.SUPABASE_TABLE || 'reservations').trim();

const config = {
  url,
  anonKey,
  tableName
};

const content = `/**
 * Auto-generated — do not edit manually
 * Generated at: ${new Date().toISOString()}
 */
const SUPABASE_CONFIG = ${JSON.stringify(config, null, 2)};
`;

const outPath = path.join(__dirname, '..', 'js', 'config.js');
fs.writeFileSync(outPath, content, 'utf8');

if (!url || !anonKey) {
  console.warn('[AETHER] SUPABASE_URL 또는 SUPABASE_ANON_KEY 미설정 — 로컬/데모 모드');
  if (process.env.VERCEL === '1') {
    console.error('[AETHER] Vercel 배포에는 SUPABASE_URL, SUPABASE_ANON_KEY 환경 변수가 필요합니다.');
    process.exit(1);
  }
} else {
  console.log('[AETHER] js/config.js 생성 완료');
}
