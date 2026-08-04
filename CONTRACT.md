# sv-kit-frontend 공개 계약 (CONTRACT)

이 문서는 @sv/kit-ui 를 고치는 사람(사람이든 에이전트든)을 위한 경계 선언이다.
**공개 계약**에 속하는 것을 바꾸면 소비자(`sv-platform/frontend`·
`backend-auth/frontend`·이 저장소의 `examples/*`)가 깨진다. **내부**에 속하는 것은
계약만 지키면 자유롭게 갈아치울 수 있다 — 라이브러리 교체 포함.

백엔드는 **스택별로 두 계보**가 있다 — Flask 는 `sv-kit-backend`(`svkit`),
FastAPI 는 `sv-kit-backend-v2`(`svkit2`). 응답 규약(`{ok,data,meta}`)을 이 저장소와
공유하므로 규약을 건드릴 때는 그쪽 CONTRACT 도 같이 본다.

실증 근거: kit-ui 0.1→0.18 열여덟 번의 버전업에서 소비자 코드 파손은 0건이었다.
0.12.0 의 `ui/split-layout` 처럼 **선언 의존성에서 컴파일되지 않는 판**을 낸 적은
있으나(0.14.0 에서 수정), 그때도 태그 고정 덕에 소비자는 올릴 때까지 영향을 받지
않았다. 이 규율을 유지하는 것이 이 문서의 목적이다.

## 변경 규칙 (요약)

1. **additive 우선** — 새 기능은 새 서브패스/새 함수/새 옵션 props 로.
   기존 시그니처·키·기본 동작 변경은 breaking 이다.
2. **breaking 은 메이저 신호와 함께** — 계약을 깨야 하면 버전을 올리고
   (0.x 동안은 minor) README/CHANGELOG 에 **깨지는 것과 마이그레이션**을 적는다.
   버전 자리가 크기를 먼저 알리고 CHANGELOG 가 내용을 알린다. 태그 고정 덕에 기존
   소비자는 조용히 깨지지 않는다 — 이 안전장치를 전제로 설계해도 된다.
3. **라이브러리 교체는 내부에서 흡수** — 계약 모양(함수 시그니처·hook
   호출 모양·props)을 유지한 채 구현만 바꾼다. 예: zustand 를 바꾸게
   되면 `(selector) => value` hook 모양을 에뮬레이션해서 유지한다.
4. **소비자 규약 파일은 계약이다** — 스켈레톤 shell 의 재export 파일
   (`lib/api.ts` 등)이 기대하는 export 이름을 없애지 않는다.

## @sv/kit-ui (프론트 npm 패키지)

### 공개 계약 — 깨면 소비자 파손

- **서브패스 export 맵**: `.` `./api` `./hooks` `./core` `./ui/*`
  `./ui/utils` `./styles/*` `./shell` `./route-shell` — 경로 제거·이름 변경 금지
- `api`: `get/post/buildUrl/sseUrl/login/logout/getToken/getRole`,
  `API_BASE`, `ApiError` + env (`NEXT_PUBLIC_API_BASE*`,
  `NEXT_PUBLIC_API_BASE_STORAGE_KEY`) + 오류 판정 의미
  (`ok:false` 또는 ok 없는 `{error}` = 실패)
- `core`: `makeTransport(resolve, events)` 와 `Transport`/
  `ResolvedSource`/`TransportEvents`/`EventStream*` 타입 모양
- `hooks`: `useLocalStorage`, `useDebounce`, `useEventStream` 시그니처
- `auth`: `createAuth(opts)` 가 돌려주는 **여덟 가지 모양**
  (`saveToken`·`getToken`·`getAuthMeta`·`removeToken`·`isAuthenticated`·
  `saveUnifiedToken`·`getUnifiedToken`·`removeUnifiedToken`)과 `AuthMeta`/`AuthOptions`
  키 이름, 그리고 **localStorage 키 모양**(`{tokenPrefix}{scope}`). 로그인 화면은 앱의 것이다
- `i18n`: `createI18n(opts)` 가 돌려주는 **네 가지 모양**
  (`useI18nStore`·`t`·`useT`·`hydrateI18n`)과 `I18nOptions` 키 이름.
  사전은 소비 앱이 갖는다 — kit 은 사전을 배포하지 않는다
- `ui/*`: 각 프리미티브의 **props** (내부 구현·클래스는 내부)
  - 운영 화면 조립 프리미티브(0.9.0~)의 export 이름도 계약이다:
    `ui/modal`(`FormModal`·`ViewModal`·`ModalSize`, 그리고 `ui/section` 의 둘을 재export),
    `ui/section`(`Section`·`DescList` — 0.10.0 에서 `ui/modal` 에서 갈라냈다.
    **`ui/modal` 쪽 재export 를 지우면 기존 소비자가 깨진다**),
    `ui/use-confirm`(`useConfirm` 이 돌려주는 `{ confirm, dialog }` 모양·`ConfirmAsk`),
    `ui/table-scroll`(`TableScroll`), `ui/table-state`(`TableState`),
    `ui/form-field`(`FormField`·`CheckField`), `ui/filter-bar`(`FilterBar`·`FilterCheck`),
    `ui/progress`(`Progress`), `ui/status-badge`(`StatusBadge`·`toneFill`·`Tone`),
    `ui/panel`(`PanelHead`·`RowCount`), `ui/pagination`(`Pagination`),
    `ui/split-layout`(`SplitLayout`·`Pane`·`SplitLayoutHandle`),
    `ui/theme-provider`(`ThemeProvider`·`Theme`),
    `ui/theme-boot`(`themeBootScript`·`DARK_CLASS` — 클라이언트 지시자 없는 모듈이어야 한다.
    서버 레이아웃이 부른다),
    `ui/split-layout`(0.12.0~ — `SplitLayout`·`Pane`·`SplitLayoutHandle`.
    `children` 이 `[왼쪽, 오른쪽]` 두 칸 튜플인 것과 폭 저장 키
    `split:<storageKey>` 가 계약이다. `layoutRef` 를 안 주면 왼쪽은 접히지 않는다 —
    **이 기본값을 바꾸면 손잡이 없는 화면에서 목록이 사라진다**),
    `ui/theme-provider`(0.12.0~ — `ThemeProvider({ theme, children })`·
    `themeBootScript(storageKey)`·`Theme`. 다크 클래스 이름 `dark` 와
    부팅 스크립트가 읽는 값 모양(`{state:{theme}}` / `{theme}`)이 계약이다)
  - **기본 문구는 계약이다** — 한국어 기본값("저장"·"취소"·"닫기"·
    "불러오는 중…"·"불러오지 못했습니다 — ")을 바꾸지 않는다. 바꿔야 하면
    소비자가 optional props 로 덮어쓴다
- `styles/*`: 배포 CSS 파일 경로와 그 안에서 **정의하는 변수 이름**
  - `styles/tokens.css` → `--success`·`--warning` (+ tailwind `--color-*` 매핑).
    `ui/status-badge` 의 ok·warn 톤과 `ui/progress` 가 이 이름에 의존한다.
    소비자는 전역 CSS 에서 `@import "@sv/kit-ui/styles/tokens.css";` 로 가져간다
- `shell`: `LayoutApp`/`NavHeaderFrame`/`NavMenuModal`/`CommandPalette`
  props, `useTabStore`/`enableTabsPersist(key)`/`TabProvider`/`useTabId`/
  `useSidebarToggleStore`. `useTabStore` 는 **키를 받기 전까지 저장하지 않는다**
  (기본 storage 가 메모리) — `LayoutApp` 의 `tabsPersistKey` 를 주거나
  `enableTabsPersist` 를 직접 부를 때만 localStorage 로 바뀐다
- `route-shell`: `createRouteTabsStore(key)`/`createUiStore(key)` 가
  돌려주는 **selector-hook 호출 모양**(`store((s) => s.x)` + `.persist
  .rehydrate()`), `RouteAppShell`/`RouteTabBar`/`SplitPane` props
- **스타일 토큰(두 계열)**:
  - shadcn 시맨틱(`bg-card` 등) — `ui/*`·`shell` 이 사용. 소비 앱은
    tailwind 설정에서 이 토큰을 자기 팔레트에 매핑해야 한다
  - CSS 변수(`--bg/--panel/--border/--text/--muted/--accent/--hover`)
    — `route-shell`·`NavSidebar` 가 사용. 이름이 계약이다
- peerDependencies 로 선언된 next/react 의 하한

### 내부 — 자유 변경

- fetch 구현, SSE 파서, zustand·sonner·cmdk 등 구현 라이브러리(계약
  모양 유지 전제), tailwind 클래스 구성, 컴포넌트 내부 구조.

## 배포·버전 규약

| 축 | 배포물 | 소비자 반영 |
|---|---|---|
| @sv/kit-ui | GitHub 태그 `ui-vX.Y.Z` (tarball) | package.json 의 태그 URL 갱신 |

- 버전은 **semver(0.x)** 다 — `20260804.1.0`·`.2.0`·`.3.0` 세 판만 날짜 기반이었고
  0.18.2 에서 되돌렸다 (경위는 CHANGELOG 0.18.2)
- 태그: `ui-vX.Y.Z` — `git push origin main --tags` 가 곧 배포.
  날짜 버전으로 나간 `ui-v20260804.*` 태그는 그 형식 그대로 두고 옮기지 않는다
- **소비 채널은 GitHub 태그 고정 하나**: 소비자 전부 package.json 에
  `https://github.com/oseongryu/sv-kit-frontend/archive/refs/tags/ui-v<버전>.tar.gz`
  로 고정 소비 (public 저장소 — 무인증, git 바이너리 불필요). 로컬 kit 개발은 `file:` 경로.
  소비자 목록은 README 릴리스 절차 4번에 있다 — 늘거나 줄면 그쪽을 고친다
- 소비자는 태그 URL 로 버전이 고정된다 — kit 의 어떤 변경도 소비자가
  URL 태그를 올리기 전에는 도달하지 않는다. 이것이 breaking 변경의
  최종 방어선이다. **한 번 push 한 태그는 옮기지 않는다.**
