# sv-kit-frontend 공개 계약 (CONTRACT)

이 문서는 @sv/kit-ui 를 고치는 사람(사람이든 에이전트든)을 위한 경계 선언이다.
**공개 계약**에 속하는 것을 바꾸면 소비자(스켈레톤 생성물·total·
git-worktree-nextjs)가 깨진다. **내부**에 속하는 것은
계약만 지키면 자유롭게 갈아치울 수 있다 — 라이브러리 교체 포함.

백엔드 프레임워크(svkit pip 패키지)는 `sv-kit-backend` 저장소로 분리 — 그쪽 CONTRACT 참조.

실증 근거: kit-ui 0.1→0.6 다섯 번의 버전업이 전부 additive 였고 소비자
코드 파손은 0건이었다. 이 규율을 유지하는 것이 이 문서의 목적이다.

## 변경 규칙 (요약)

1. **additive 우선** — 새 기능은 새 서브패스/새 함수/새 옵션 props 로.
   기존 시그니처·키·기본 동작 변경은 breaking 이다.
2. **breaking 은 메이저 신호와 함께** — 계약을 깨야 하면 버전을 올리고
   README/CHANGELOG 에 마이그레이션을 적는다. vendor 고정 덕에 기존
   소비자는 조용히 깨지지 않는다 — 이 안전장치를 전제로 설계해도 된다.
3. **라이브러리 교체는 내부에서 흡수** — 계약 모양(함수 시그니처·hook
   호출 모양·props)을 유지한 채 구현만 바꾼다. 예: zustand 를 바꾸게
   되면 `(selector) => value` hook 모양을 에뮬레이션해서 유지한다.
4. **소비자 규약 파일은 계약이다** — 스켈레톤 shell 의 재export 파일
   (`lib/api.ts` 등)이 기대하는 export 이름을 없애지 않는다.

## @sv/kit-ui (프론트 npm 패키지)

### 공개 계약 — 깨면 소비자 파손

- **서브패스 export 맵**: `.` `./api` `./hooks` `./core` `./ui/*`
  `./ui/utils` `./shell` `./route-shell` — 경로 제거·이름 변경 금지
- `api`: `get/post/buildUrl/sseUrl/login/logout/getToken/getRole`,
  `API_BASE`, `ApiError` + env (`NEXT_PUBLIC_API_BASE*`,
  `NEXT_PUBLIC_API_BASE_STORAGE_KEY`) + 오류 판정 의미
  (`ok:false` 또는 ok 없는 `{error}` = 실패)
- `core`: `makeTransport(resolve, events)` 와 `Transport`/
  `ResolvedSource`/`TransportEvents`/`EventStream*` 타입 모양
- `hooks`: `useLocalStorage`, `useDebounce`, `useEventStream` 시그니처
- `ui/*`: 각 프리미티브의 **props** (내부 구현·클래스는 내부)
- `shell`: `LayoutApp`/`NavHeaderFrame`/`NavMenuModal`/`CommandPalette`
  props, `useTabStore`/`TabProvider`/`useTabId`/`useSidebarToggleStore`
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
| @sv/kit-ui | `frontend/vendor/sv-kit-ui-X.Y.Z.tgz` | tgz 교체 + package.json 갱신 |

- 태그: `ui-vX.Y.Z`
- **소비 채널 2종**: 스켈레톤 생성물·total 은 vendor 고정(오프라인 자급·
  워커 안전), 손으로 관리하는 프로젝트(git-worktree-nextjs)는 git submodule
  (`file:./sv-kit-frontend` symlink — 커밋 핀 고정, kit 수정 시 dev 즉시 반영)
- 소비자는 vendor 로 버전이 고정된다 — kit 의 어떤 변경도 소비자가
  vendor 를 교체하기 전에는 도달하지 않는다. 이것이 breaking 변경의
  최종 방어선이다.
