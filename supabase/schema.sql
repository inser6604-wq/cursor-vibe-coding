-- AETHER Reservation Table
-- Supabase Dashboard → SQL Editor에서 실행

create table if not exists public.reservations (
  id bigint generated always as identity primary key,
  user_name text not null,
  user_email text not null,
  destination text not null,
  departure_date date not null,
  created_at timestamptz not null default now()
);

comment on table public.reservations is 'AETHER 우주여행 예약 신청';

-- Row Level Security
alter table public.reservations enable row level security;

-- 익명 사용자 INSERT 허용 (랜딩페이지 폼 제출용)
drop policy if exists "Allow public insert" on public.reservations;
create policy "Allow public insert"
  on public.reservations
  for insert
  to anon, authenticated
  with check (true);

-- (선택) 관리자만 조회 — service_role 또는 authenticated admin 정책 추가 권장
