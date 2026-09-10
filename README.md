# HATSUNEMIKU.ME

하츠네 미쿠·보컬로이드 팬 포털. 음악 랭킹, 플레이리스트, 행사, 뉴스, 갤러리와 관리자 CMS를 제공합니다.

## 개발 환경

Node.js 24 LTS를 사용합니다 (`.nvmrc`, `package.json`의 `engines` 참조).

```sh
nvm use
npm ci
npm run dev
```

`.example.env`를 참고해 `.env`에 PostgreSQL 연결, Google·네이버 OAuth, YouTube·Spotify API 및 Cron/캐시 갱신 비밀키를 설정합니다. `npm ci`는 Prisma 클라이언트를 생성하지만 DB 스키마를 변경하지 않습니다.

현재 저장된 마이그레이션은 뉴스 테이블만 포함하므로 새 DB 초기화에는 전체 스키마와 마이그레이션 이력 정리가 선행되어야 합니다.

## 검증

```sh
npm run lint
npm run typecheck
npm run build
```

빌드 중 서버 페이지가 DB를 조회하므로 접근 가능한 DB와 환경변수가 필요합니다. Next.js 16은 빌드 시 ESLint를 실행하지 않으므로 린트를 별도로 실행합니다.

## 기술 스택 업데이트 (2026-09-10)

- Next.js 16.3.4, React / React DOM 19.3.0
- Tailwind CSS / PostCSS 플러그인 4.3.3
- Prisma CLI / Client / PostgreSQL 어댑터 7.10.0
- NextAuth 4.24.15 (Google·네이버, DB 세션)
- TypeScript 6.0.3, ESLint 9.39.5, eslint-config-next 16.3.4
- Flowbite 4.0.2, Flowbite React 0.12.17, Swiper 14.2.0, Lucide React 1.43.0
- 전체 의존성 버전은 package.json과 package-lock.json 참조

최신 안정 버전과 공식 peer dependency 호환 범위를 기준으로 선택했습니다. Prisma 8의 latest 태그는 RC여서 제외했습니다. TypeScript 7은 typescript-eslint의 지원 범위 밖이며, ESLint 10은 eslint-plugin-react의 지원 범위 밖이므로 호환 버전을 유지합니다. ESLint 9는 지원 종료 경고가 있어 플러그인의 ESLint 10 지원 여부를 추후 확인해야 합니다.

Next.js 16에 맞춰 관리 API의 `revalidateTag`에 `{ expire: 0 }`을 지정해 기존 즉시 만료 동작을 유지했습니다. TypeScript의 전역 타입 목록에는 Node, React, React DOM, YouTube를 명시했습니다.

새 React Hooks 규칙 `set-state-in-effect`는 기존 관리자 상태 동기화 및 일부 UI 초기화 코드에 한해 경고로 적용합니다. UI 개편 시 해당 패턴을 정리할 필요가 있습니다.

### 남은 의존성 감사 항목

호환 범위의 `npm audit fix` 적용 후 high 5건이 남습니다. 근본 원인은 Prisma·Flowbite React의 `deepmerge-ts`와 Prisma의 `mysql2` 의존성입니다. npm의 자동 수정 제안은 기존 주요 패키지의 다운그레이드이므로 적용하지 않았습니다. 상위 패키지 수정 릴리스 또는 별도 호환성 검증을 거친 조치가 필요합니다.

### 검증 결과

- `npm ci`: 성공, Prisma 7.10 클라이언트 생성 확인.
- `npm run typecheck`: 통과.
- ESLint: 오류 0개, 경고 28개 (기존 미사용 선언 16개 및 신규 Hooks 규칙 12개).
- `npm run build`: Turbopack 컴파일·타입 검사·35개 정적 페이지 생성 성공. 빌드 시 PostgreSQL 조회 확인.
- `npm ls --all`: 현재 npm 11.6.2/macOS 환경에서 선택적 WASM 패키지 3개의 extraneous 및 그 하위 의존성 missing 보고가 남습니다. 새 `npm ci`에서도 재현되며 위 설치·컴파일·빌드는 성공했습니다.
- OAuth 로그인, 관리자 쓰기 작업 및 브라우저 상호작용은 이번 검증에 포함하지 않았습니다.

참고: [Next.js 16 업그레이드 가이드](https://nextjs.org/docs/app/guides/upgrading/version-16), [revalidateTag API](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
