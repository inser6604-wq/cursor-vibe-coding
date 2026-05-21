#!/usr/bin/env bash
# AETHER — Supabase 로컬 연결 (3분 설정)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_REF="xhungxxmdbnertnrhwpa"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
API_PAGE="https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api"
SQL_PAGE="https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new"

echo ""
echo -e "${GREEN}[AETHER]${NC} Supabase 프로젝트: ${SUPABASE_URL}"
echo ""

# .env 생성
if [ ! -f .env ]; then
  cp env.template .env
  echo -e "${GREEN}[AETHER]${NC} .env 파일 생성됨"
fi

# anon key 없으면 안내
if ! grep -q 'SUPABASE_ANON_KEY=ey' .env 2>/dev/null; then
  echo -e "${YELLOW}[1/3]${NC} Supabase API 키 복사가 필요합니다."
  echo "      → Project Settings → API → anon public 키"
  echo "      → ${API_PAGE}"
  echo ""
  if command -v open >/dev/null 2>&1; then
    open "$API_PAGE"
  fi
  echo "anon key를 붙여넣고 Enter:"
  read -r ANON_KEY
  if [ -z "$ANON_KEY" ]; then
    echo "anon key가 비어 있습니다. 나중에 .env 에 직접 넣고 npm run build 하세요."
    exit 1
  fi
  # macOS sed
  if sed --version 2>/dev/null | grep -q GNU; then
    sed -i "s|^SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=${ANON_KEY}|" .env
  else
    sed -i '' "s|^SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=${ANON_KEY}|" .env
  fi
fi

# config.js 생성
set -a
# shellcheck source=/dev/null
source .env
set +a
export SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_TABLE="${SUPABASE_TABLE:-reservations}"
node scripts/generate-config.js

echo ""
echo -e "${YELLOW}[2/3]${NC} DB 테이블 생성 (최초 1회)"
echo "      → SQL Editor 열기 → supabase/schema.sql 내용 붙여넣기 → Run"
echo "      → ${SQL_PAGE}"
echo ""
if command -v open >/dev/null 2>&1; then
  open "$SQL_PAGE"
  if command -v pbcopy >/dev/null 2>&1; then
    pbcopy < supabase/schema.sql
    echo -e "${GREEN}[AETHER]${NC} schema.sql 내용을 클립보드에 복사했습니다. SQL Editor에 붙여넣기(Cmd+V) 후 Run!"
  fi
fi

echo ""
echo -e "${YELLOW}[3/3]${NC} 로컬 테스트"
echo "      npm run dev  →  http://localhost:8765"
echo "      예약 폼 제출 후 Supabase → Table Editor → reservations 확인"
echo ""
echo -e "${GREEN}[AETHER]${NC} config.js 준비 완료!"
