# TRD (Technical Requirements Document)
## AETHER — Space Travel Landing Page

# 1. 프로젝트 개요

## 프로젝트명
AETHER

## 프로젝트 유형
프리미엄 우주여행 브랜드 랜딩페이지

## 개발 목적
시네마틱 우주 비주얼과 인터랙션 중심 UX를 기반으로  
미래 우주여행 브랜드 경험을 구현하는 반응형 랜딩페이지 제작

# 2. 개발 환경

| 항목 | 내용 |
|---|---|
| Editor | Cursor / VS Code |
| Markup | HTML5 |
| Style | CSS3 |
| Script | JavaScript |
| Database | Supabase |
| Deployment | Vercel |
| Version Control | GitHub |


# 3. 기술 스택
## Front-End

- HTML5
- CSS3
- Vanilla JavaScript

## Animation
- CSS Transition
- Scroll Animation
- GSAP (Optional)

## Backend / Database
- Supabase

## Deployment
- Vercel

## Version Control
- GitHub

# 4. 디렉토리 구조

project-root
│
├── index.html
│
├── css
│   ├── reset.css
│   ├── style.css
│   ├── responsive.css
│   └── animation.css
│
├── js
│   ├── main.js
│   ├── scroll.js
│   └── interaction.js
│
├── images
│   ├── hero
│   ├── destinations
│   ├── gallery
│   └── icons
│
└── fonts

# 5. 공통 UI 요구사항

## Layout
- Fullscreen Hero Section
- Section 기반 레이아웃
- 충분한 여백 사용
- Grid / Flex 혼합 구조

## Typography
- 대형 타이포 중심 구성
- Bold 헤드라인 사용
- 최소한의 텍스트 유지

# color
| 용도           | 컬러      |
| ------------ | ------- |
| Background   | #050816 |
| Secondary BG | #0D1328 |
| Text         | #FFFFFF |
| Accent       | #AEBBFF |

# 6. 반응형 기준

| 디바이스 | 기준 |
|---|---|
| Desktop | 1440px 이상 |
| Tablet | 768px ~ 1439px |
| Mobile | 767px 이하 |

# 반응형 요구사항
- 모바일에서 세로 레이아웃 변경
- 타이포 크기 자동 조정
- Grid → Column 구조 변경
- 이미지 비율 유지

# 7. 인터랙션 요구사항

## Scroll Animation
- fade-up
- opacity transition
- translateY animation

## Hover Interaction
- 이미지 확대(scale)
- glow effect
- text reveal

## Button Interaction
- background transition
- blur glow effect

# 8. 섹션별 개발 요구사항

## HERO
- Fullscreen Layout
- 대형 메인 타이포
- CTA Button
- Background Glow Effect

## ABOUT
- 브랜드 소개
- 이미지 + 텍스트 구성

## DESTINATIONS
- 카드 기반 UI
- 행성 정보 표시

## EXPERIENCE
- 경험 요소 카드 UI
- glassmorphism 스타일 적용

## JOURNEY
- timeline UI
- 단계별 프로세스

## GALLERY
- 시네마틱 이미지 구성
- 가로 스크롤 느낌 레이아웃

## RESERVATION
기능
- 사용자 예약 신청 입력 폼
- Supabase 데이터 저장
- 입력값 유효성 검사
- 제출 완료 메시지 출력

입력 항목
- Name
- Email
- Destination
- Departure Date

- 인터랙션
- input focus effect
- button hover animation
- submit success transition

## CTA / FOOTER
- 최종 슬로건
- CTA 버튼
- Footer Navigation

# 9. 성능 최적화

- 이미지 최적화(WebP 권장)
- lazy loading 적용
- 불필요한 JS 사용 제한

# 10. 접근성 고려사항

- alt 속성 적용
- semantic tag 사용
- keyboard navigation 고려

# 11. 데이터 처리
Reservation Form Data

사용자가 입력한 예약 신청 데이터를 Supabase Database에 저장한다.

저장 항목
- user_name
- user_email
- destination
- departure_date
- created_at


# 12. 배포 및 버전 관리
## GitHub
- Git Repository 생성
- 프로젝트 버전 관리
- 소스 코드 Push 진행

## Vercel Deployment
- GitHub Repository 연동
- Vercel을 통한 프로젝트 배포
- 배포 URL 생성 및 제출