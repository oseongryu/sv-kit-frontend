// FOUC 방지용 `<head>` 부팅 스크립트 — **서버 컴포넌트에서 부른다.**
//
// 이 파일에 `"use client"` 가 없는 것이 핵심이다. 스크립트 문자열은 첫 페인트
// 전에 `<head>` 안에서 동기로 돌아야 하므로 서버가 HTML 에 박아 넣어야 하는데,
// 클라이언트 모듈의 함수를 서버에서 부르면 Next 가 참조 스텁으로 바꿔 버려
// 빌드가 깨지거나(직접 호출) 엉뚱한 문자열이 박힌다.
//
// 같은 이유로 **키도 클라이언트 모듈에서 가져오면 안 된다.** zustand store 파일
// (`"use client"`)에서 `STORAGE_KEY` 를 import 해 넣으면 산출물에는 키 대신
// `function(){throw Error("Attempted to call STORAGE_KEY() from the server…")}`
// 가 들어가고, 스크립트는 조용히 아무 일도 하지 않는다(소비 앱에서 실제로
// 그렇게 굴러가고 있었다). 키는 클라이언트 지시자가 없는 자리에 두고 쓴다.
//
// `ui/theme-provider` 도 이 함수를 다시 내보내지만 그쪽은 클라이언트 모듈이다 —
// 서버 레이아웃에서는 반드시 이 경로(`ui/theme-boot`)에서 받아라.

/** 다크일 때 `<html>` 에 붙는 클래스 — `ui/theme-provider` 와 같은 이름을 쓴다 */
export const DARK_CLASS = "dark";

/**
 * FOUC 방지용 `<head>` 인라인 스크립트 문자열.
 *
 * ```tsx
 * // app/layout.tsx (서버 컴포넌트)
 * import { themeBootScript } from "@sv/kit-ui/ui/theme-boot";
 *
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: themeBootScript(STORAGE_KEY) }} />
 * </head>
 * ```
 *
 * `storageKey` 는 **앱이 테마를 넣어 둔 localStorage 키**다(zustand persist 의
 * `name`). 값의 모양은 persist 의 `{state:{theme}}` 와 맨 위에 그냥 `{theme}` 인
 * 경우를 둘 다 읽는다 — 소비 앱들이 실제로 그렇게 적어 두었고, persist 버전이
 * 바뀌어도 조용히 살아남게 하려는 것이다.
 *
 * 읽기에 실패하면(키 없음·JSON 깨짐) 아무 것도 하지 않는다. 부팅 스크립트가
 * 던지는 예외는 그 뒤 문서 전체를 멈추므로 삼키는 편이 낫다.
 */
export function themeBootScript(storageKey: string): string {
  return `(function(){try{var r=localStorage.getItem(${JSON.stringify(storageKey)});if(!r)return;var s=JSON.parse(r);var t=(s&&s.state&&s.state.theme)||s.theme;if(t==='dark')document.documentElement.classList.add('${DARK_CLASS}');}catch(e){}})();`;
}