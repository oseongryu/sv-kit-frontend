# Changelog

@sv/kit-ui 의 모든 소비자 영향 변경을 기록한다. 형식은 Keep a Changelog, 버전은 semver(0.x). 태그는 `ui-v<버전>`.

## 0.10.0

0.9.0 프리미티브를 소비 앱(ai-insight)과 `examples/ui-gallery` 에 실제로 물려 보며
드러난 것들을 고친다. 전부 additive 이거나 버그 수정이다.

- `ui/section` 신설 — `Section`·`DescList` 를 `ui/modal` 에서 분리. 팝업 밖 화면 카드로도
  쓰는데 `ui/modal` 에서 받아 오면 읽는 사람이 팝업을 찾게 된다.
  `ui/modal` 이 둘을 그대로 다시 내보내므로 **기존 import 는 그대로 산다**
- `ui/modal` `FormModal` 에 `onCancel` 추가 — 왼쪽 버튼이 항상 `onClose` 라,
  단계가 있는 폼("이전 단계로")은 이 껍데기를 못 쓰고 바닥 줄을 직접 그려야 했다.
  주지 않으면 종전대로 닫기다
- `ui/modal` `DescList` 버그 수정 — `v || placeholder` 라 값이 `0`·`false`·빈 문자열이면
  실제 값 대신 `—` 가 나왔다(건수·회차 같은 숫자 메타에서 걸린다)
- `ui/modal` `ViewModal` 버그 수정 — `loading`·`error` 일 때 `actions`(내려받기 등)를
  바닥에 그대로 그렸다. 본문이 없는데 동작 버튼만 살아 있었다
- `ui/filter-bar` 버그 수정 — `[&_input]:h-7` 이 체크박스에도 걸려 조회줄에 체크박스를
  넣으면 네모 칸이 28px 로 늘어났다. `ui/form-field` 와 같은 `:not([type=checkbox])` 예외를 둔다
- `ui/progress` 버그 수정 — `value` 가 NaN 이면 `width: NaN%` 로 막대가 사라졌다. 0 으로 떨어뜨린다
- `ui/use-confirm` 주석 보강 — `run` 은 기다리지 않는다(반환 promise 는 "일이 끝났다"가
  아니라 "확인을 눌렀다"로 풀린다)는 것을 명시
- `examples/ui-gallery` 추가 — 팝업 3종·패널 뼈대·상태 조각을 실제로 열어 보고 복붙하는 예제 앱

## 0.9.0

운영 화면 조립 프리미티브 9종 흡수 — 소비 앱(ai-insight 어드민)에서 화면마다
손으로 반복하던 조합을 올린다. 문구는 전부 한국어 기본값 + optional props 로 덮어쓰기.

- `ui/modal` 추가 — `FormModal`(값 넣고 저장, 바닥 [취소][저장] 자동, `busy`/`busyLabel`)·
  `ViewModal`(보기, loading/error 본문 자리에서 분기, 바닥 [닫기], `actions` 슬롯)·
  `Section`(제목 붙은 카드)·`DescList`(라벨-값). 팝업을 새로 만들 때
  `CommonModal` 을 직접 부르는 대신 여기서 고른다
- `ui/use-confirm` 추가 — `ConfirmDialog` 위의 훅. `await confirm({…})` 과
  `confirm({…, run})` 둘 다 지원. 열림 상태를 화면마다 `useState` 로 들 필요가 없다
- `ui/table-scroll` 추가 — `max`(기본 40vh) / `fill` 두 모드 + sticky thead.
  패널에 표가 하나면 `fill`, 둘 이상이면 `max`
- `ui/table-state` 추가 — 목록의 오류→로딩→빈 3분기 행. 셋 다 아니면 `null`
- `ui/form-field` 추가 — `FormField`(라벨+컨트롤, 높이·폭을 자손 선택자로 강제)·`CheckField`
- `ui/filter-bar` 추가 — 조회조건 한 줄. 안의 컨트롤을 h-7/text-xs/내용 폭으로 되돌린다
- `ui/progress` 추가 — 진행바(값 0–100 클램프, 톤 색)
- `ui/status-badge` 추가 — `StatusBadge`(톤 ok·warn·bad·off·info)·`toneFill`·`Tone`.
  모양은 `ui/badge` 를 쓰고 톤→클래스 매핑만 얹는다.
  이름이 `Badge` 가 아닌 것은 `ui/badge` 의 `Badge` 와 구분하기 위해서다
- `ui/panel` 추가 — `PanelHead`(제목+동작)·`RowCount`(목록 건수)
- **`styles/*` 서브패스 추가** + `styles/tokens.css` — `--success`·`--warning`
  (라이트/다크 oklch) + tailwind v4 `@theme inline` 매핑.
  `StatusBadge` 의 ok·warn 톤과 `Progress` 가 이 토큰을 쓴다. 소비 앱 전역 CSS 에
  `@import "@sv/kit-ui/styles/tokens.css";` 한 줄이 없으면 **그 두 톤만 색이 조용히 안 나온다**
- `ui/CommonModal` 에 `footer?: ReactNode` optional props 추가 — 주면 규격화된
  바닥 줄(우측 정렬·간격, headerActions 모드에서는 구분선·여백)에 담긴다.
  **안 주면 기존과 완전히 동일**(렌더 결과 무변화) — 기존 호출부 무파손
- 전부 additive — 기존 서브패스·export·props·기본 동작 변경 없음

## 0.8.0

- `ui/tab-bar` 에 `leading` 슬롯 추가 — 탭 스트립 **왼쪽**에 놓이는 자리(구분선 포함).
  오른쪽 `actions` 만 있어서, 화면을 설명하는 값(경로·건수 등)을 왼쪽에 두려면
  소비자가 `mr-auto` 로 되돌리거나 탭바 아래 별도 줄을 그려야 했다.
  `leading` 을 주지 않으면 종전과 동일하게 렌더된다

## 0.7.0

- `ui/select` 추가 — 네이티브 `<select>` 에 kit 스타일만 입힌 프리미티브.
  소비 앱들이 `className="border-input bg-card h-8 …"` 을 화면마다 복붙하고 있었다
  (ai-insight 어드민 32곳). props 는 `<select>` 그대로라 한 줄 치환으로 옮긴다
- `ui/table` 추가 — `Table`·`TableHead`·`TableBody`·`TableRow`·`TableHeaderCell`·`TableCell`.
  전역 CSS(`table { … }`)로 칠하던 것을 컴포넌트로. `TableRow` 는 `selected`
  props 와 `onClick` 유무로 고를 수 있는 행을 표현한다
- `ui/checkbox` 추가 — base-ui Checkbox 기반. 네이티브 `<input type="checkbox">` 는
  브라우저마다 크기·색이 달라 다크 모드에서 특히 튄다.
  props 는 `checked`/`onCheckedChange`(base-ui Root 그대로)
- 셋 다 additive — 기존 서브패스·props 변경 없음

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
