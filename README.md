# bomPick (봄픽) 🎬

**"오늘 뭐 볼까?"** - 넷플릭스, 디즈니+, 티빙, 웨이브 등 다양한 OTT 플랫폼의 콘텐츠를 한곳에서 스마트하게 추천받는 서비스입니다.

![bomPick Preview](https://bompick.yyyerin.co.kr/og-image.png)

## 🚀 주요 기능

- **OTT 통합 필터링**: 넷플릭스, 디즈니+, 티빙, 웨이브, 왓챠, 쿠팡플레이 등 내가 구독 중인 서비스의 콘텐츠만 골라볼 수 있습니다.
- **스마트 검색**: 영화와 TV 시리즈를 통합해서 검색하고 정보를 확인하세요.
- **결정 장애 해결 (랜덤 픽)**: 도저히 못 고르겠을 때! 필터를 기반으로 엄선된 콘텐츠를 랜덤으로 추천해 드립니다.
- **다크 모드 지원**: 낮에도 밤에도 편안하게 콘텐츠를 탐색하세요.
- **상세 정보**: 줄거리, 평점, 출연진 정보는 물론 해당 콘텐츠를 볼 수 있는 플랫폼 링크를 제공합니다.

## 📁 폴더 구조

```text
src/
├── assets/             # 이미지 및 SVG 에셋
├── components/
│   ├── common/         # 공통 UI 컴포넌트 (모달, 카드 등)
│   ├── filters/        # 콘텐츠 필터 관련 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트 (헤더, 푸터)
├── data/               # 정적 데이터 및 목 데이터
├── hooks/              # 커스텀 React 훅
├── pages/              # 페이지 단위 컴포넌트
├── services/           # 외부 API 연동 서비스 (TMDb)
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🛠 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **API**: [TMDb (The Movie Database) API](https://www.themoviedb.org/documentation/api)
- **Deployment**: Docker, Nginx, Jenkins

## 📦 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 TMDb API 키를 설정해야 합니다.

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 🚢 배포 (Deployment)

본 프로젝트는 Docker와 Jenkins를 활용해 자동 배포 환경이 구축되어 있습니다.

- **Dockerfile**: Nginx 기반의 멀티 스테이지 빌드를 지원합니다.
- **Jenkinsfile**: Git push 시 자동으로 빌드 및 배포 파이프라인이 실행됩니다.

## 📄 라이선스

이 프로젝트는 개인 포트폴리오용으로 제작되었습니다.
데이터 제공은 [TMDb](https://www.themoviedb.org/)를 통해 이루어집니다.

---

Made with ❤️ by [yyyerin](https://github.com/yyyerin)
