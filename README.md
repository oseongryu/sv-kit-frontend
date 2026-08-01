# sv-kit-frontend (@sv/kit-ui)

svkit 기반 서비스의 프론트 공통 npm 패키지. API 래퍼(ok/err 규약·인증)·
훅·ui 프리미티브·탭 셸(shell/route-shell)·NavSidebar 를 소스(tsx)로 배포하고,
소비 앱의 Next `transpilePackages` 가 직접 컴파일한다.

백엔드 프레임워크(svkit pip 패키지)는 `sv-kit-backend` 저장소에 있다.
프론트 소비자는 이 저장소만 서브모듈로 물면 된다 (구 `sv-kit` 통합 저장소에서 분리).

> **수정 전 필독**: [CONTRACT.md](CONTRACT.md) — 공개 계약(깨면 소비자 파손)과
> 내부(자유 변경)의 경계, additive 변경 규율.

## 사용 (프로젝트 쪽)

```jsonc
// package.json — 서브모듈 소비 (dev 즉시 반영)
{ "dependencies": { "@sv/kit-ui": "file:./sv-kit-frontend" } }
```

```ts
// next.config.ts — 소스(ts) 배포라 Next 가 직접 컴파일
transpilePackages: ["@sv/kit-ui"],
```

vendor 소비(스켈레톤 생성물·total)는 `npm pack` 산출 tgz 를
`frontend/vendor/sv-kit-ui-X.Y.Z.tgz` 로 동봉해 고정한다.

## 서브패스

| import | 역할 |
|---|---|
| `@sv/kit-ui/api` | `get/post/buildUrl/sseUrl/login/logout`, `API_BASE`, `ApiError` |
| `@sv/kit-ui/core` | `makeTransport` 주입형 전송(멀티서버·SSE) |
| `@sv/kit-ui/hooks` | `useLocalStorage`·`useDebounce`·`useEventStream` |
| `@sv/kit-ui/ui/*` | shadcn 계열 프리미티브 + `ui/utils`(cn) |
| `@sv/kit-ui/shell` | `LayoutApp`·`NavHeaderFrame`·`NavMenuModal`·`CommandPalette`·탭 스토어 |
| `@sv/kit-ui/route-shell` | 라우트 탭 셸(`RouteAppShell`·`RouteTabBar`·`SplitPane`·스토어 팩토리) |

## 릴리스

버전은 semver. 브레이킹 체인지 시 minor(0.x 동안) 승격 + 아래 동기화 필수:

1. `package.json` version
2. `git tag ui-v<버전>`
3. `npm pack` → sv-agent-team `skeletons/base/frontend/vendor/` 교체
4. sv-agent-team `SKELETON_IMPL.md` 를 같은 내용으로 갱신 (에이전트용 스펙)
