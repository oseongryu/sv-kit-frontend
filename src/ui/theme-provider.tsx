"use client";

// 테마 적용 — 앱이 가진 theme 값을 `<html class="dark">` 로 옮긴다.
//
// 소비 앱 두 곳에 본문이 사실상 같은 파일이 두 벌 있었다. 다른 것은 딱 하나,
// 둘 다 값을 **자기 zustand store 에서 직접 읽었다**는 점이다(`useStore((s) => s.theme)`).
// kit 이 앱의 store 를 알 수는 없으니 값만 props 로 받는다 — 앱은 자기 store 에서
// 읽어 넘기면 되고, store 를 안 쓰는 앱도 이걸 그대로 쓸 수 있다.
//
// 첫 페인트는 이 컴포넌트가 못 잡는다(effect 는 hydration 뒤에 돈다). 다크
// 사용자가 흰 화면을 한 번 보고 마는 걸 막으려면 `<head>` 안에서 동기로 도는
// 스크립트가 필요하고, 그 문자열은 `themeBootScript()` 가 만든다 — 이것도 두 앱이
// 각자 layout.tsx 에 손으로 적고 있던 같은 한 줄이다.

import { useEffect, type ReactNode } from "react";

export type Theme = "light" | "dark";

/** 다크일 때 `<html>` 에 붙는 클래스 — 부팅 스크립트도 같은 이름을 쓴다 */
const DARK_CLASS = "dark";

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
  }, [theme]);

  return <>{children}</>;
}

/**
 * FOUC 방지용 `<head>` 인라인 스크립트 문자열.
 *
 * ```tsx
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: themeBootScript(STORAGE_KEY) }} />
 * </head>
 * ```
 *
 * `storageKey` 는 **앱이 테마를 넣어 둔 localStorage 키**다(zustand persist 의
 * `name`). 값의 모양은 zustand persist 의 `{state:{theme}}` 와 맨 위에 그냥
 * `{theme}` 인 경우를 둘 다 읽는다 — 소비 앱 둘이 실제로 그렇게 적어 두었고,
 * persist 버전이 바뀌어도 조용히 살아남게 하려는 것이다.
 *
 * 읽기에 실패하면(키 없음·JSON 깨짐) 아무 것도 하지 않는다. 부팅 스크립트가
 * 던지는 예외는 그 뒤 문서 전체를 멈추므로 삼키는 편이 낫다.
 */
export function themeBootScript(storageKey: string): string {
  return `(function(){try{var r=localStorage.getItem(${JSON.stringify(storageKey)});if(!r)return;var s=JSON.parse(r);var t=(s&&s.state&&s.state.theme)||s.theme;if(t==='dark')document.documentElement.classList.add('${DARK_CLASS}');}catch(e){}})();`;
}