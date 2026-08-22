# sv-kit-frontend (@sv/kit-ui)

svkit 기반 서비스의 프론트 공통 npm 패키지. API 래퍼(ok/err 규약·인증)·
훅·ui 프리미티브·탭 셸(shell/route-shell)·NavSidebar 를 소스(tsx)로 배포하고,
소비 앱의 Next `transpilePackages` 가 직접 컴파일한다.

백엔드는 스택별로 두 계보다 — Flask 는 `sv-kit-backend`(`svkit`), FastAPI 는
`sv-kit-backend-v2`(`svkit`). 프론트·백엔드 모두 **GitHub 태그 tarball 로 고정**해 받는다.

> **수정 전 필독**: [CONTRACT.md](CONTRACT.md) — 공개 계약(깨면 소비자 파손)과
> 내부(자유 변경)의 경계, additive 변경 규율.

## 이 저장소의 자리 — 뼈대만 있고 도메인은 없다

킷에는 화면도 업무 용어도 없다. 도메인은 소비 앱이 갖고, 소비 앱은 그것을 **배포
변형(edition)** 단위로 켠다 — 상류 `sv-platform` 의 `backend/editions/<변형>/edition.py`
에 있는 `MODULES` 한 줄이 곧 게이팅이고, `scripts/z_carve.sh` 가 그 선언대로 잘라
납품본(예: `wt-en`)을 낸다.

그래서 **"킷에 모듈을 붙인다" 의 실제 모양은 상류에서 원하는 변형만 남기고 잘라내는
것**이다. 킷은 어느 절삭본에도 그대로 남는 부분이다.

모듈 경계를 지키는 검사는 소비 앱 쪽에 있다 — `frontend/scripts/check-isolation.cjs`
(화면끼리·공용 층이 서로를 모른다), `backend/svkit/loader/domain_meta.py:check()`,
`z_carve.sh` 의 잔존 참조 검증. 킷이 지키는 몫은 [CONTRACT.md](CONTRACT.md) 다.

## 사용 (소비 앱 쪽)

소비 채널은 **GitHub 태그 tarball 하나**다. public 저장소라 무인증이고 git 바이너리도
필요 없다.

```jsonc
// frontend/package.json
{ "dependencies": { "@sv/kit-ui": "https://github.com/oseongryu/sv-kit-frontend/archive/refs/tags/ui-v0.25.0.tar.gz" } }
```

```ts
// next.config.ts — 소스(ts) 배포라 Next 가 직접 컴파일
transpilePackages: ["@sv/kit-ui"],
```

킷이 평범한 `node_modules` 항목이라 node 의 상향 탐색·turbopack·`npm ci` 가 다른 패키지와
똑같이 다룬다. 형제 리포를 `file:`·서브모듈(`frontend/vendor/`)로 물던 시절의 제약
(`turbopack.root` 를 공통 조상까지 올리기, 킷 리포의 `node_modules` 를 심볼릭 링크로 걸기,
이미지가 `npm ci` 보다 먼저 `COPY frontend/vendor/`)은 **태그 tarball 로 옮기며 전부
사라졌다.**

**킷을 고쳐 가며 쓸 때**만 로컬 경로로 바꾼다 — `npm i ../sv-kit-frontend`, 되돌리기는
태그 URL 로 `npm i` 다시.

## 서브패스

| import | 역할 |
|---|---|
| `@sv/kit-ui/api` | `get/post/buildUrl/sseUrl/login/logout`, `API_BASE`, `ApiError` |
| `@sv/kit-ui/core` | `makeTransport` 주입형 전송(멀티서버·SSE) |
| `@sv/kit-ui/hooks` | `useLocalStorage`·`useDebounce`·`useEventStream` |
| `@sv/kit-ui/ui/*` | shadcn 계열 프리미티브 + 운영 화면 조립 프리미티브 + `ui/utils`(cn) |
| `@sv/kit-ui/styles/*` | 배포 CSS — 지금은 `styles/tokens.css`(상태색 토큰) 하나 |
| `@sv/kit-ui/shell` | `LayoutApp`·`NavHeaderFrame`·`NavMenuModal`·`CommandPalette`·탭 스토어 |
| `@sv/kit-ui/route-shell` | 라우트 탭 셸(`RouteAppShell`·`RouteTabBar`·`SplitPane`·스토어 팩토리) |

## 운영 화면 조립 프리미티브 (0.9.0~)

shadcn 계열 낱개 프리미티브 위에, 운영 화면이 매번 같은 모양으로 반복하던
조합을 올린 것들. 문구는 한국어가 기본값이고 전부 optional props 로 덮어쓴다.

| import | 역할 |
|---|---|
| `ui/modal` | `FormModal`(넣고 저장)·`ViewModal`(보기)·`Section`·`DescList` — 팝업은 이 셋 중 하나다 |
| `ui/use-confirm` | `const { confirm, dialog } = useConfirm()` — `await confirm({…})` / `confirm({…, run})` |
| `ui/table-scroll` | 표 스크롤 영역 — 표가 하나면 `fill`, 둘 이상이면 `max`(기본 40vh). thead 붙박이 |
| `ui/table-state` | 목록의 오류→로딩→빈 3분기 행 (셋 다 아니면 `null`) |
| `ui/form-state` | `FormError`(값 없으면 `null`)·`FormState`(오류→로딩) — 표 아닌 자리의 대응물 |
| `ui/card` | `Card`+헤더·제목·설명·본문·바닥. `size`(`sm` 목록/`md` 화면)·`interactive`·`render` |
| `ui/form-field` | `FormField`(라벨+컨트롤, 높이·폭 강제)·`CheckField` |
| `ui/filter-bar` | 조회조건 한 줄 — 안의 컨트롤을 내용 폭·h-7 로 되돌린다 |
| `ui/progress` | 진행바 (0–100 클램프, 톤 색) |
| `ui/status-badge` | `StatusBadge`(ok·warn·bad·off·info)·`toneFill` — `ui/badge` 위 톤 매핑 |
| `ui/panel` | `PanelHead`(제목+동작)·`RowCount`(목록 건수) |
| `ui/split-layout` | `SplitLayout`(좌 목록/우 상세, 폭 기억 + 좁은 화면 서랍)·`Pane`(패널 여백). 머리줄에서 여닫으려면 `layoutRef` |
| `ui/theme-provider` | `ThemeProvider({ theme, children })` — theme 를 `<html class="dark">` 로. `themeBootScript(키)` 는 FOUC 방지 `<head>` 스크립트 |

`ui/CommonModal` 은 `footer` props 로 규격화된 바닥 버튼 줄을 받는다(안 주면 종전과 동일).

### 상태색 토큰 (필수 — 안 하면 색이 조용히 안 나온다)

kit-ui 는 shadcn 표준 토큰만 가정하는데 `StatusBadge` 의 **ok·warn 톤**과
`Progress` 는 표준에 없는 `--success`·`--warning` 을 쓴다. 소비 앱 전역 CSS 에
한 줄 넣는다 (tailwind v4 기준, `@import "tailwindcss"` 뒤):

```css
@import "@sv/kit-ui/styles/tokens.css";
```

라이트/다크 값(oklch)과 tailwind `@theme inline` 매핑이 함께 들어 있다.
앱 팔레트에 맞추려면 이 import 뒤 `:root`/`.dark` 에서 두 변수만 덮어쓰면 된다.

## 릴리스

버전은 semver. 브레이킹 체인지 시 minor(0.x 동안) 승격 + 아래 동기화 필수:

1. `package.json` version + CHANGELOG
2. **이 README 상단 설치 예시**의 태그 URL 갱신
3. `git tag ui-v<버전>` → `git push origin main --tags` (태그 push 가 곧 배포)
4. 소비자 package.json 의 tarball URL 태그 갱신 — **아래 목록이 전부다**.
   태그 고정이라 올리지 않은 소비자는 옛 판 그대로 돌아간다(깨지지 않는다)

| 소비자 | 비고 |
|---|---|
| `sv-platform/frontend` | **상류 하나뿐이다.** lock 이 `package-lock.json` 이므로 URL 을 고친 뒤 `npm install --package-lock-only` 로 lock 도 함께 갱신한다 |

납품본(`wt-en` 등)은 상류의 절삭 산출물이라 따로 올리지 않는다 — 상류를 올린 뒤
`sh scripts/z_deliver.sh <납품처>` 가 태그 URL 까지 실어 나른다. 구 `backend-auth` 는
상류의 auth edition 으로 흡수되어 더는 별도 소비자가 아니다.

### 태그 형식

태그는 `ui-v<버전>` 이다 — 예: `ui-v0.18.2`.
**한 번 push 한 태그는 옮기지 않는다.** 날짜 기반으로 나갔던 세 판
(`ui-v20260804.1.0`·`.2.0`·`.3.0`)도 그 번호 그대로 남는다 — 버전 체계를 semver 로
되돌렸어도 이미 발행된 태그는 건드리지 않는다. 소비자 package.json 이 그 URL 을 가리킨다.

## 라이선스

MIT — `LICENSE` 를 본다.
