# sv-kit-frontend

svkit 기반 서비스의 프론트 공통 킷. API 래퍼(ok/err 규약·인증)·
훅·ui 프리미티브·탭 셸(shell/route-shell)·NavSidebar 를 소스(tsx)로 갖는다.

**이 리포는 상류(`sv-platform/frontend/svkit/`) 소스의 공개 스냅샷이다** — 소비 앱이
소스를 `frontend/svkit/` 로 직접 커밋해 쓰고, 동기화는 상류의 `scripts/z_release.sh` 가
한다. 백엔드 대응물은 `sv-kit-backend`(FastAPI 커널 스냅샷)이고 Flask 계보는
`sv-kit-backend-flask`(이력 리포)다.

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

소비 방식은 **소스 직접 커밋 하나**다 — 이 리포의 `src/` 를 소비 앱의
`frontend/svkit/` 에 넣고 tsconfig paths 로 이름을 단다. 의존 패키지도 빌드 단계도 없고,
소스가 프로젝트 안이라 Next 가 자연히 컴파일한다(`transpilePackages` 불필요).

```jsonc
// tsconfig.json
{ "compilerOptions": { "paths": { "@/kit/*": ["./svkit/*"] } } }
```

옛 소비 채널(npm `@sv/kit-ui` 태그 tarball, `file:` 경로, 서브모듈)은 전부 폐기했다 —
버전 갈아타기·lock 갱신·`transpilePackages` 제약이 함께 사라졌다.

**킷 수정은 소비 앱의 `frontend/svkit/` 에서 직접** 하고, 상류(`sv-platform`)의
`scripts/z_release.sh` 가 이 리포로 밀어낸다.

## 서브패스

| import | 역할 |
|---|---|
| `@/kit/api` | `get/post/buildUrl/sseUrl/login/logout`, `API_BASE`, `ApiError` |
| `@/kit/core` | `makeTransport` 주입형 전송(멀티서버·SSE) |
| `@/kit/hooks` | `useLocalStorage`·`useDebounce`·`useEventStream` |
| `@/kit/ui/*` | shadcn 계열 프리미티브 + 운영 화면 조립 프리미티브 + `ui/utils`(cn) |
| `@/kit/styles/*` | 배포 CSS — 지금은 `styles/tokens.css`(상태색 토큰) 하나 |
| `@/kit/shell` | `LayoutApp`·`NavHeaderFrame`·`NavMenuModal`·`CommandPalette`·탭 스토어 |
| `@/kit/route-shell` | 라우트 탭 셸(`RouteAppShell`·`RouteTabBar`·`SplitPane`·스토어 팩토리) |

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
@import "@/kit/styles/tokens.css";
```

라이트/다크 값(oklch)과 tailwind `@theme inline` 매핑이 함께 들어 있다.
앱 팔레트에 맞추려면 이 import 뒤 `:root`/`.dark` 에서 두 변수만 덮어쓰면 된다.

## 릴리스

**소비 리포 안에 소스가 있으므로 태그 배포가 없다.** 이 리포의 갱신은 상류
`sh scripts/z_release.sh` 가 하고(스냅샷 동기), 커밋·push 가 전부다.
버전은 `package.json` 의 semver(0.x)로 CHANGELOG 의 판 구분용 이력 표기만 남는다.

옛 tarball 채널의 `ui-v*` 태그는 그대로 남긴다 — **한 번 push 한 태그는 옮기지 않는다.**
납품본(`wt-en` 등)은 상류의 절삭 산출물이라 킷도 소스로 함께 실려 간다
(`sh scripts/z_deliver.sh <납품처>`).

## 라이선스

MIT — `LICENSE` 를 본다.
