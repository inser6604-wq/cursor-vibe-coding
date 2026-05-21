#!/usr/bin/env bash
# AETHER — Supabase + GitHub + Vercel 원클릭 배포
# 사용법: 터미널에서 아래 환경변수를 설정한 뒤 실행
#   export SUPABASE_URL=...
#   export SUPABASE_ANON_KEY=...
#   export SUPABASE_ACCESS_TOKEN=...
#   export GITHUB_TOKEN=...
#   export VERCEL_TOKEN=...
#   bash scripts/deploy.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[AETHER]${NC} $*"; }
warn()  { echo -e "${YELLOW}[AETHER]${NC} $*"; }
error() { echo -e "${RED}[AETHER]${NC} $*" >&2; }

require_var() {
  if [ -z "${!1:-}" ]; then
    error "환경변수 $1 이(가) 필요합니다."
    exit 1
  fi
}

# ─── 1. Supabase ───
setup_supabase() {
  require_var SUPABASE_URL
  require_var SUPABASE_ACCESS_TOKEN

  PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')
  if [ -z "$PROJECT_REF" ]; then
    error "SUPABASE_URL 형식이 올바르지 않습니다. (https://xxx.supabase.co)"
    exit 1
  fi

  info "Supabase 스키마 적용 중... (project: $PROJECT_REF)"
  QUERY=$(python3 -c 'import json,sys; print(json.dumps({"query": open("supabase/schema.sql").read()}))')

  HTTP=$(curl -sS -o /tmp/supabase-result.json -w "%{http_code}" \
    -X POST "https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query" \
    -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$QUERY")

  if [ "$HTTP" -ge 200 ] && [ "$HTTP" -lt 300 ]; then
    info "Supabase 테이블 reservations 준비 완료"
  else
    warn "Supabase API 응답 HTTP $HTTP — Dashboard SQL Editor에서 supabase/schema.sql 을 직접 실행하세요."
    cat /tmp/supabase-result.json 2>/dev/null || true
  fi
}

# ─── 2. Config 생성 ───
generate_config() {
  require_var SUPABASE_URL
  require_var SUPABASE_ANON_KEY
  export SUPABASE_TABLE="${SUPABASE_TABLE:-reservations}"
  node scripts/generate-config.js
  info "js/config.js 생성 완료"
}

# ─── 3. GitHub ───
setup_github() {
  require_var GITHUB_TOKEN

  REPO_NAME="${GITHUB_REPO:-aether-landing}"
  GH_USER=$(curl -sS -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    https://api.github.com/user | python3 -c "import sys,json; print(json.load(sys.stdin).get('login',''))")

  if [ -z "$GH_USER" ]; then
    error "GitHub 토큰 인증 실패"
    exit 1
  fi

  info "GitHub 사용자: $GH_USER"

  HTTP=$(curl -sS -o /tmp/gh-create.json -w "%{http_code}" \
    -X POST "https://api.github.com/user/repos" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -d "{\"name\":\"${REPO_NAME}\",\"description\":\"AETHER — Luxury Space Travel Landing Page\",\"private\":false,\"auto_init\":false}")

  if [ "$HTTP" = "422" ]; then
    warn "저장소가 이미 존재합니다 — 기존 repo 사용"
  elif [ "$HTTP" -ge 200 ] && [ "$HTTP" -lt 300 ]; then
    info "GitHub 저장소 생성: https://github.com/${GH_USER}/${REPO_NAME}"
  else
    warn "GitHub repo 생성 HTTP $HTTP"
    cat /tmp/gh-create.json
  fi

  if [ ! -d .git ]; then
    git init -b main
  fi

  git add -A
  if git diff --cached --quiet; then
    warn "커밋할 변경사항 없음"
  else
    git commit -m "feat: AETHER landing page with Supabase & Vercel setup" || true
  fi

  REMOTE="https://${GITHUB_TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE"
  git push -u origin main

  echo ""
  info "GitHub: https://github.com/${GH_USER}/${REPO_NAME}"
}

# ─── 4. Vercel ───
deploy_vercel() {
  require_var VERCEL_TOKEN

  info "Vercel 배포 중..."
  npx --yes vercel@latest deploy --token "$VERCEL_TOKEN" --yes --prod \
    --env "SUPABASE_URL=${SUPABASE_URL}" \
    --env "SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}" \
    --env "SUPABASE_TABLE=${SUPABASE_TABLE:-reservations}"

  info "Vercel Dashboard → Settings → Environment Variables 에서 위 변수가 Production에 설정됐는지 확인하세요."
  info "GitHub 연동: Vercel Dashboard → Project → Git → Connect Repository"
}

# ─── Main ───
echo ""
info "AETHER 배포 시작"
echo ""

setup_supabase
generate_config
setup_github
deploy_vercel

echo ""
info "배포 완료!"
echo "  • Supabase: Dashboard → Table Editor → reservations"
echo "  • GitHub:   https://github.com/<user>/aether-landing"
echo "  • Vercel:   프로젝트 Production URL 확인"
echo ""
