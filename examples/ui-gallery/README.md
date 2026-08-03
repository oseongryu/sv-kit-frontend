# kit-ui 프리미티브 전시장 — 운영 화면 조각을 눈으로 고른다

백엔드 없이 뜨는 최소 Next 앱. 0.9.0 의 운영 화면 조립 프리미티브(팝업 셋·패널 뼈대·
상태 조각)를 실제로 열어 보고, 각 절의 코드 조각을 그대로 복붙한다. 데이터는 파일 안
상수라 서버가 필요 없다.

## 실행

```bash
npm install
npm run dev            # http://localhost:3000
```

- **팝업** — `FormModal`(크기·저장 중 잠금) · `ViewModal`(로딩·오류·정상) · `useConfirm`(await·run)
- **패널 뼈대** — `PanelHead` → `FilterBar` → `TableScroll fill` 순서. 표를 내려도 위 둘이 고정된다
- **조각** — `StatusBadge` 톤 5종 · `Progress` · `FormField`/`CheckField` · `TableState` 3상태

오른쪽 위 [다크] 로 토큰이 라이트/다크 두 벌인지 함께 확인한다.

## 전역 CSS 에 반드시 있어야 하는 것 (app/globals.css)

```css
@import "tailwindcss";
@import "@sv/kit-ui/styles/tokens.css";   /* 없으면 StatusBadge ok·warn, Progress 색이 안 나온다 */
@source "../node_modules/@sv/kit-ui/src"; /* tailwind v4 는 node_modules 를 스캔하지 않는다 */
```

`--background`·`--primary`·`--border` 같은 shadcn 표준 토큰은 kit 이 배포하지 않는다 —
이 예제의 `app/globals.css` 처럼 소비 앱이 라이트/다크 한 벌을 직접 정의한다.
kit 이 배포하는 CSS 는 상태색(`--success`·`--warning`) 하나뿐이다.

로컬에서 kit 소스를 바로 반영하며 개발하려면 package.json 의존을
`"@sv/kit-ui": "file:../.."` 로 바꾸면 된다.