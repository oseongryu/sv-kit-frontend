# kit-ui 최소 예제 — 프론트 단독 소비

백엔드 짝 없이 @sv/kit-ui 만 소비하는 최소 Next 앱. api 래퍼(ok/err 규약·오류 판정)와
훅(useDebounce)을 시연한다. 데이터를 보고 싶으면 svkit 백엔드 아무거나 —
예: [sv-kit-backend examples/minimal](https://github.com/oseongryu/sv-kit-backend/tree/main/examples/minimal) —
를 5000 포트에 띄우면 된다 (필수는 아님, 없으면 오류 표시 데모가 된다).

## 실행

```bash
npm install
npm run dev            # http://localhost:3000
# 백엔드 주소 변경: NEXT_PUBLIC_API_BASE=http://다른주소 npm run dev
```

로컬에서 kit 소스를 바로 반영하며 개발하려면 package.json 의존을
`"@sv/kit-ui": "file:../.."` 로 바꾸면 된다.

## 참고

- `ui/*` 프리미티브(shadcn 계열)와 `shell`/`route-shell` 은 Tailwind 토큰 매핑이
  필요하다 — 이 예제는 무스타일 소비만 시연한다. 토큰 계약은 CONTRACT.md 참조.
