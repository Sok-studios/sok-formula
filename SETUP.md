# Sok Formula — Setup Guide

## 필요한 계정 (전부 무료)
1. GitHub — github.com
2. Supabase — supabase.com
3. Vercel — vercel.com

---

## Step 1: Supabase 설정

1. supabase.com → New Project 만들기
2. Project 생성되면 → SQL Editor → New Query
3. 아래 SQL 복사해서 실행:

```sql
-- 레시피 저장 테이블
create table formulas (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  client_name text,
  emphasis    text,
  oils        jsonb,
  warnings    jsonb,
  total_g     numeric,
  total_drops integer
);

-- 세션 설정 테이블 (소젠의 큐레이션)
create table session_config (
  id          integer primary key default 1,
  active_ids  jsonb,
  updated_at  timestamptz default now()
);

-- 클라이언트는 읽기/쓰기, 세션은 읽기만
alter table formulas enable row level security;
alter table session_config enable row level security;

create policy "Anyone can insert formulas"
  on formulas for insert with check (true);

create policy "Anyone can read session config"
  on session_config for select using (true);

create policy "Anyone can upsert session config"
  on session_config for all using (true) with check (true);
```

4. Settings → API 에서 두 가지 복사:
   - Project URL (예: https://xxxx.supabase.co)
   - anon public key (긴 문자열)

---

## Step 2: GitHub에 코드 올리기

1. github.com → New repository → 이름: sok-formula → Create
2. 이 폴더 전체를 GitHub에 업로드
   - 방법 A: GitHub Desktop 앱 사용 (추천, 쉬움)
   - 방법 B: github.com에서 직접 파일 업로드

⚠️ .env 파일은 올리지 마세요 (API key 보안). .env.example만 올리면 돼요.

---

## Step 3: Vercel 배포

1. vercel.com → Continue with GitHub → sok-formula repo 선택
2. Environment Variables 추가:
   - VITE_SUPABASE_URL = (Step 1에서 복사한 URL)
   - VITE_SUPABASE_ANON_KEY = (Step 1에서 복사한 key)
   - VITE_ADMIN_PIN = (소젠이 정하는 숫자 4자리)
3. Deploy 클릭

배포 완료되면 주소가 생겨요: https://sok-formula.vercel.app

---

## 사용법

클라이언트 화면: https://sok-formula.vercel.app
어드민 화면:     https://sok-formula.vercel.app/#admin

NFC 스티커 → 클라이언트 링크로 설정하면 태그하는 순간 바로 열려요.
아이패드 홈 화면에 추가하면 앱처럼 사용 가능.

---

## 어드민 기능

- 로그인: VITE_ADMIN_PIN으로 설정한 숫자
- 저장된 전체 레시피 확인
- 세션 향료 큐레이션 (변경 즉시 클라이언트에 반영)
