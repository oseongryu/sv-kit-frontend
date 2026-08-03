# sv-kit-frontend (@sv/kit-ui)

svkit 기반 서비스의 프론트 공통 npm 패키지. API 래퍼(ok/err 규약·인증)·
훅·ui 프리미티브·탭 셸(shell/route-shell)·NavSidebar 를 소스(tsx)로 배포하고,
소비 앱의 Next `transpilePackages` 가 직접 컴파일한다.

백엔드 프레임워크(svkit pip 패키지)는 `sv-kit-backend` 저장소에 있다 (구 `sv-kit`
통합 저장소에서 분리). 소비자는 이 저장소를 직접 물지 않고 tgz 를 vendor 로 동봉한다.

> **수정 전 필독**: [CONTRACT.md](CONTRACT.md) — 공개 계약(깨면 소비자 파손)과
> 내부(자유 변경)의 경계, additive 변경 규율.

## 사용 (프로젝트 쪽)

GitHub 태그 tarball 로 버전을 고정해 설치한다 (로컬 개발은 `file:` 경로).

```jsonc
// package.json
{ "dependencies": { "@sv/kit-ui": "https://github.com/oseongryu/sv-kit-frontend/archive/refs/tags/ui-v0.6.1.tar.gz" } }
```

```ts
// next.config.ts — 소스(ts) 배포라 Next 가 직접 컴파일
transpilePackages: ["@sv/kit-ui"],
```

단독 소비 예제: [`examples/minimal`](examples/minimal) — 백엔드 짝 없이 api·훅만 시연.
프리미티브 전시장: [`examples/ui-gallery`](examples/ui-gallery) — 운영 화면 조립 프리미티브를
실제로 열어 보고 코드를 복붙한다(tailwind 토큰·`@source` 설정 본보기 포함).

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
| `ui/form-field` | `FormField`(라벨+컨트롤, 높이·폭 강제)·`CheckField` |
| `ui/filter-bar` | 조회조건 한 줄 — 안의 컨트롤을 내용 폭·h-7 로 되돌린다 |
| `ui/progress` | 진행바 (0–100 클램프, 톤 색) |
| `ui/status-badge` | `StatusBadge`(ok·warn·bad·off·info)·`toneFill` — `ui/badge` 위 톤 매핑 |
| `ui/panel` | `PanelHead`(제목+동작)·`RowCount`(목록 건수) |

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
2. `git tag ui-v<버전>` → `git push origin main --tags` (태그 push 가 곧 배포)
3. 소비자 package.json 의 tarball URL 태그 갱신 (스켈레톤 base 포함)
4. sv-agent-team `SKELETON_IMPL.md` 를 같은 내용으로 갱신 (에이전트용 스펙)
