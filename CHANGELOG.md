# Changelog

@sv/kit-ui 의 모든 소비자 영향 변경을 기록한다. 형식은 Keep a Changelog, 버전은 semver(0.x). 태그는 `ui-v<버전>`.

## 0.7.0

- `ui/select` 추가 — 네이티브 `<select>` 에 kit 스타일만 입힌 프리미티브.
  소비 앱들이 `className="border-input bg-card h-8 …"` 을 화면마다 복붙하고 있었다
  (ai-insight 어드민 32곳). props 는 `<select>` 그대로라 한 줄 치환으로 옮긴다
- `ui/table` 추가 — `Table`·`TableHead`·`TableBody`·`TableRow`·`TableHeaderCell`·`TableCell`.
  전역 CSS(`table { … }`)로 칠하던 것을 컴포넌트로. `TableRow` 는 `selected`
  props 와 `onClick` 유무로 고를 수 있는 행을 표현한다
- 둘 다 additive — 기존 서브패스·props 변경 없음

## 0.6.1

- 구조 정리 (내부 전용 — 서브패스 import 경로·공개 API 변경 없음)
  - 루트 flat 파일을 feature 디렉터리로 재배치: `api.ts→api/`, `core.ts→core/`,
    `NavSidebar.tsx→components/nav-sidebar.tsx` (Mantine·shadcn 계열 패키지 관례)
  - `hooks.ts` 를 훅별 파일로 분리(`use-local-storage`·`use-debounce`·`use-event-stream`) + 배럴 index
  - exports 맵을 새 파일 위치로 갱신 — 소비자 import 경로는 동일
  - 자체 typecheck 도입: `tsconfig.json`(strict) + devDependencies + `npm run typecheck`

## 0.6.0

- 라우트 탭 셸(route-shell) 흡수 — `RouteAppShell`·`RouteTabBar`·`SplitPane`·스토어 팩토리

## 0.5.0

- 탭 셸(shell) 흡수 — `LayoutApp`·`NavHeaderFrame`·`NavMenuModal`·`CommandPalette`

## 0.4.0

- shadcn 계열 ui 프리미티브 16종 흡수

## 0.3.0

- 주입형 전송 코어(`core` — 멀티서버·SSE) 추가

## 0.2.0

- API base 런타임 override(`NEXT_PUBLIC_API_BASE_STORAGE_KEY`)·legacy 오류 판정

## 0.1.0

- 스켈레톤 프론트 공통(api·hooks·NavSidebar)을 npm 패키지로 분리
