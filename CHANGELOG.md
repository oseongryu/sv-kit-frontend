# Changelog

@sv/kit-ui 의 모든 소비자 영향 변경을 기록한다. 형식은 Keep a Changelog,
버전은 **날짜 기반(CalVer) `YYYYMMDD.N.0`** 이다 — `20260804.1.0` 부터.
태그는 `ui-v<버전>`(예: `ui-v20260804.1.0`).

- `YYYYMMDD` = 발행일, `N` = **그날의 몇 번째 판인지**(1부터), 마지막 `0` 은 자리 채움
- 같은 날 두 번째 판은 `20260804.2.0`, 다음 날 첫 판은 `20260805.1.0`
- 마지막 자리 `.0` 은 **npm 이 강제한다** — `major.minor.patch` 세 자리를 요구해
  `20260804.1` 같은 두 자리를 거부하고, leading zero 도 거부해 `2026.08.04` 도 못 쓴다
  (그래서 월·일을 붙여 쓴다). 백엔드 키트(PEP 440)는 두 자리도 받지만 세 키트의
  형식을 하나로 두려고 그쪽을 여기에 맞췄다
- **판 번호에 크기 신호가 없다.** breaking 은 버전 자리가 아니라 그 판의 항목에
  적힌다 — 태그를 올리기 전에 여기를 읽는다

`ui-v0.18.1` 까지는 semver(0.x)로 나갔다. 그 태그들은 **옮기지 않는다**(소비자
package.json 이 그 URL 을 가리킨다). 아래 0.x 항목들도 그 번호로 배포된 사실이라 그대로 둔다.

## 20260804.2.0

- 예제 두 곳의 `package-lock.json` 이 옛 태그(`ui-v0.6.1`·`ui-v0.11.0`)를 잠그고 있어
  `npm ci` 가 package.json 과 불일치로 실패하던 것을 재생성했다. lock 은 `integrity`
  해시를 함께 담으므로 URL 만 손으로 고칠 수 없고 **태그가 올라간 뒤 설치해야** 갱신된다 —
  같은 날 두 번째 판이 필요했던 이유다(CalVer 의 `N` 자리가 쓰인 첫 사례)
- 릴리스 절차에 lock 재생성 단계를 넣었다. 예제 `package.json` 갱신만 적혀 있어 빠졌다

## 20260804.1.0

**버전 체계를 semver 에서 날짜 기반(CalVer)으로 바꿨다.** 세 키트
(`@sv/kit-ui`·`svkit`·`svkit2`)가 같은 날 같은 값 `20260804.1.0` 으로 함께 넘어간다.

- 형식은 `YYYYMMDD.N.0` — 발행일 + 그날의 판 순번. 마지막 `.0` 은 npm 이 세 자리를
  강제해서 둔 자리 채움이다(자세한 근거는 이 문서 머리말)
- 0.x 를 쓰는 동안 minor 를 브레이킹 신호로 쓰기로 했는데, 0.1→0.18 열여덟 판이
  전부 additive 여서 그 자리가 신호로 쓰인 적이 없다. 자리를 유지하는 대신
  **언제 나온 판인지**를 버전이 말하게 했다. breaking 판정은 CHANGELOG 항목이 맡는다
- 예제 두 곳(`examples/minimal`·`examples/ui-gallery`)의 설치 핀이 각각 `ui-v0.6.1`·
  `ui-v0.11.0` 에 멈춰 있던 것을 함께 올렸다. 0.18.1 에서 고친 것은 README 뿐이었고
  예제 `package.json` 은 남아 있었다. 릴리스 절차에도 그 단계를 넣었다
- 코드 변경 없음 — 버전 문자열과 문서(README 릴리스 절차·CONTRACT 배포·버전 규약)뿐

## 0.18.1

- 문서 정비 — 백엔드를 **스택별 두 계보**로 안내한다(Flask 는 `sv-kit-backend`/`svkit`,
  FastAPI 는 `sv-kit-backend-v2`/`svkit2`). 이 저장소는 v2 의 존재를 몰랐는데, 실제로는
  `@sv/kit-ui` + `svkit2` 조합이 주력이고 v2 의 계약 테스트가 **이 저장소가 기대하는
  응답 모양**을 고정하고 있어 참조가 이미 양방향이었다
- 설치 예시의 핀이 `ui-v0.6.1` 에 멈춰 있던 것을 최신으로. 복붙하면 12판 낮은 판을 받았다
- 실증 근거 문장을 현재 실적으로 갱신하면서 0.12.0 의 결함(선언 의존성에서 컴파일되지
  않던 `ui/split-layout`)도 함께 적었다 — 파손 0건만 적으면 사실과 다르다

## 0.18.0

- `auth` 서브패스 신설 — `createAuth({ defaultScope?, tokenPrefix?, metaPrefix?, unifiedKey?, validators? })`.
  `api`(전송)·`core`(401 처리)는 있었는데 **토큰을 담고 만료를 판정하는 층**이 없어
  앱마다 다시 짜고 있었다. 로그인 화면은 앱의 것으로 남긴다 — 무엇을 입력받는지가
  앱마다 다르다(서버 주소를 받는 앱도 있다)
- **스코프**를 열었다 — 서버를 여럿 붙이는 앱은 `getToken(serverId)`,
  하나뿐인 앱은 `defaultScope` 를 정해 두고 `getToken()`. 소비 앱의 원본은
  `jwt_token_{serverId}` 로 멀티서버를 전제해 그대로는 못 올라왔다
- 만료 판정은 `validators` 로 늘린다. 기본은 `local`(JWT `exp` 클레임)과
  `bearer_external`(불투명 토큰 — 받아 둔 메타의 `exp`, 없으면 서버 401 까지 유효)
- `parseJwtPayload` 도 함께 내보낸다. `"use client"` 를 붙이지 않아 서버에서도 import 된다

## 0.17.0

- `i18n` 서브패스 신설 — `createI18n({ translations, defaultLocale, fallbackLocale?, storageKey? })` 가
  그 앱 전용 `{ useI18nStore, t, useT, hydrateI18n }` 한 벌을 만들어 준다.
  **사전은 앱이 갖는다** — 그 앱의 도메인 낱말이라 공통으로 올릴 물건이 아니다(소비 앱의
  사전이 800줄인데 전부 그 앱 화면 이름이었다). 반면 "고른 말을 기억하고 · 키를 문장으로
  바꾸고 · 바뀌면 다시 그리는" 부분은 앱마다 똑같이 다시 짜게 된다
- 키 타입이 사전에서 따라오므로 **앱에서 없는 키를 쓰면 컴파일이 막힌다**.
  `shell` 의 `NavHeaderFrame` 이 요구하는 `locale`·`onToggleLocale` 에 그대로 물린다

## 0.16.0

- `ui/pagination` 신설 — `Pagination({ page, totalPages, onChange, siblings? })`.
  소비 앱이 손으로 적던 쪽 넘김을 올린다. **그 구현들은 쪽 번호를
  `Math.min(totalPages, 10)` 로 그려 11쪽 이후로 갈 방법이 아예 없었다**(실제 결함).
  여기서는 현재 쪽 둘레만 펼치고 처음·끝을 남긴 뒤 사이를 `…` 로 접는다.
  자리는 표 **아래**다 — 위에만 두면 마지막 행을 보고 다시 올라가야 한다

## 0.15.0

껍데기(`FormModal`·`ViewModal`)가 `CommonModal` 의 쓸모 있는 props 를 **가리고 있었다.**
그래서 헤더에 동작이 있는 팝업들이 껍데기를 못 쓰고 `CommonModal` 로 남았다
(소비 앱에서 4곳 확인). 껍데기는 바닥 줄과 본문 뼈대만 책임지고 나머지는 통과시킨다.

- `FormModal`·`ViewModal` 에 `headerActions`·`preventClose`·`onOpen`·`className` 추가
  - `FormModal.preventClose` 는 안 주면 종전대로 `busy` 를 따른다
- `ViewModal` 에 `keepActionsOnError` 추가 — 오류일 때 `actions` 를 감추는 것이 기본이지만
  ("본문이 없는데 동작 버튼만 살아 있다"), **다시 시도처럼 실패했을 때 눌러야 하는 동작**이
  있는 팝업은 이걸로 남긴다. 0.10.0 의 수정이 그 경우까지 덮고 있었다

## 0.14.0

`ui/split-layout` 을 실제 소비 앱에 물려 보며 드러난 것들. **0.12.0~0.13.0 의
`ui/split-layout` 은 선언 의존성에서 컴파일되지 않는다 — 이 판으로 올려라.**

- **버그**: `onLayoutChanged` 를 2인자(`(next, meta)`)로 받고 있었다. 그건
  `react-resizable-panels` **4.12 대**의 시그니처인데 이 패키지가 선언한 의존성은
  `^4.7.3` 이고 4.7 대는 **1인자**다. 4.7.3 이 깔린 앱에서 타입 에러로 빌드가 깨졌고,
  타입을 무시해도 `meta` 가 `undefined` 라 드래그마다 `TypeError` 가 났다.
  1인자로 낮춘다 — "사람이 끈 것만 기억한다"는 의도는 `save()` 가 0·100 을 거르는
  것으로 이미 지켜지고 있었다
- `closeDrawerOnClick` 추가(기본 true = 종전 동작) — 좁은 화면 서랍이 **내부 아무 클릭에나
  닫혔다.** 목록 머리줄에 검색·필터·버튼이 있는 화면은 그것들을 누를 때마다 서랍이 닫혀
  쓸 수 없다. 끈 화면은 `layoutRef.close()` 로 고른 순간에만 닫는다
- `className` 추가 — 분할 전체를 감싸는 클래스. `flex-1 min-h-0` 을 줘야 하는 화면이 있다
- `drawerClassName`·`showDrawerClose` 추가 — 서랍 폭과 X 버튼. 앱마다 치수가 다르다

## 0.13.0

- `styles/tokens.css` 에 `--info` 추가, `ui/status-badge`·`ui/progress` 의 `info` 톤이
  `--primary` 대신 이걸 쓴다. **primary 가 무채색인 앱에서 "진행중"이 회색으로 나와
  상태로 읽히지 않았다**(소비 앱에서 확인 — 파랑이던 알약이 회색이 됐다).
  primary 는 앱마다 뜻이 다른 축(브랜드·주요 동작)이라 상태색이 빌려 쓸 자리가 아니다
- **주의**: `tokens.css` 를 가져오지 않은 앱은 이제 `info` 톤도 색이 나오지 않는다
  (종전에는 primary 라 나왔다). ok·warn 과 같은 조건이 됐을 뿐이지만, 이 판으로 올릴 때
  전역 CSS 에 `@import "@sv/kit-ui/styles/tokens.css";` 가 있는지 확인하라

## 0.12.2

0.12.1 은 배포물이 깨졌다(아래) — **0.12.1 을 쓰지 마라.** 내용은 이 판과 같다.


- `ui/theme-boot` 신설 — `themeBootScript` 를 클라이언트 경계 **밖**으로 뺐다.
  이 스크립트는 첫 페인트 전에 `<head>` 에서 동기로 돌아야 해서 서버 컴포넌트가
  문자열을 박아 넣는데, 0.12.0 은 `"use client"` 인 `ui/theme-provider` 에만 있어
  서버 레이아웃에서 부르면 빌드가 깨졌다(소비 앱에서 확인).
  `ui/theme-provider` 도 계속 재export 하므로 기존 import 는 그대로 산다 —
  **서버에서는 `ui/theme-boot` 에서 직접 받는다**
- `exports` 에 `./ui/theme-boot` 추가 — `./ui/*` 와일드카드는 `*.tsx` 만 잡는다
  (`./ui/utils` 와 같은 개별 지정)

### 0.12.1 (결함 — 쓰지 말 것)

태그를 만들 때 `package.json` 이 빈 파일로 커밋됐다(스크립트가 같은 파일을 읽으면서
동시에 열어 비웠다). 설치 자체가 되지 않는다. 태그는 옮기지 않는 규약이라
그대로 두고 0.12.2 를 낸다.

## 0.12.0

소비 앱 두 곳(ai-insight 어드민·git-worktree-nextjs)이 **각자 만들어 쓰던 같은 물건 둘**을 올린다.
둘 다 새 서브패스라 기존 소비자에게 미치는 영향은 없다.

- `ui/split-layout` 신설 — `SplitLayout`(좌 목록/우 상세 분할)·`Pane`·`SplitLayoutHandle`.
  폭은 드래그로 조절하고 `storageKey` 로 화면마다 기억하며(localStorage `split:<key>`),
  좁은 화면에서는 왼쪽을 `Sheet` 서랍으로 연다. ai-insight 판이 뼈대이고
  **호출부는 그대로 옮겨온다**(`storageKey`·`defaultSize`·`leftTitle`·`children:[left,right]`).
  worktree 는 같은 조립을 화면 7개에 복붙한 채 폭 저장이 없고 `usePanelRef()` +
  `matchMedia("(max-width: 767px)")` 감시 + `collapse()` 를 화면마다 다시 짜고 있었다 —
  그쪽이 필요로 하던 것을 옵션으로 흡수했다:
  - `layoutRef` — 바깥(머리줄 버튼)에서 여닫는 손잡이(`toggle`/`open`/`close`/`isClosed`).
    **주면 왼쪽이 접히는 패널이 되고, 안 주면 종전(최소 폭에서 멈춤) 그대로다.**
    넓은 화면=패널 접기 / 좁은 화면=서랍 닫기를 `toggle()` 하나가 알아서 고른다 —
    화면이 matchMedia 분기를 다시 적을 필요가 없다
  - `showNarrowToggle`(기본 true) — 좁은 화면 기본 [목록] 버튼. 화면이 자기 머리줄에
    이미 여닫기 버튼을 두고 있으면 꺼서 버튼이 둘 되는 걸 막는다
  - `mobileBreakpoint`(기본 767)·`leftMinSize`(15)·`rightMinSize`(25)·`leftClassName`·`rightClassName`
  - **브레이크포인트는 767px 로 통일**했다. 두 앱이 갈려 있었다(한쪽 훅은 767px,
    다른 쪽 공용 훅은 640px 인데 화면들은 767px 을 인라인으로 씀). 실제로 쓰이던 값이 767px 이다
  - 저장 규칙을 하나 조였다 — 접힌 값(0)·끝까지 민 값은 기억하지 않는다.
    다음 방문에 목록이 사라져 있으면 화면이 고장 난 것으로 보인다
- `ui/theme-provider` 신설 — `ThemeProvider({ theme, children })`·`themeBootScript(storageKey)`·`Theme`.
  두 앱에 본문이 사실상 같은 파일이 두 벌 있었고 둘 다 theme 를 **자기 zustand store 에서
  직접 읽어** kit 으로 올릴 수 없는 모양이었다. store 의존을 끊고 값만 props 로 받는다 —
  앱은 자기 store 에서 읽어 넘긴다.
  `themeBootScript()` 는 두 앱이 layout.tsx 에 각자 적어 두던 FOUC 방지 `<head>` 인라인
  스크립트를 만들어 준다. 두 앱의 스크립트가 **localStorage 키만 다르고 나머지가 같아서**
  키 하나만 받으면 된다(zustand persist 의 `{state:{theme}}` 와 맨 위 `{theme}` 둘 다 읽는다)

## 0.11.0

- `ui/filter-bar` 에 `FilterCheck` 추가 — 조회줄 안의 켬/끔 조건("사용중만"·"활성만").
  `form-field` 의 `CheckField` 는 폼용이라 라벨 줄만큼 자리를 비우고 글자도 폼 크기여서
  조회줄에 넣으면 줄이 높아지고 글자가 튄다. 소비 앱들이 같은
  `<label class="… text-xs"><Checkbox/>…</label>` 를 화면마다 손으로 적고 있었다
  (ai-insight 어드민 3곳). 네모는 `ui/checkbox`(base-ui)를 쓴다

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
