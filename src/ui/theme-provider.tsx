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

import { DARK_CLASS } from "./theme-boot";

export type Theme = "light" | "dark";

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
  }, [theme]);

  return <>{children}</>;
}

// 부팅 스크립트는 서버 레이아웃이 부르는 것이라 클라이언트 지시자가 없는
// `ui/theme-boot` 이 갖는다. 여기서 다시 내보내 기존 import 를 살리되,
// **서버 컴포넌트에서는 `ui/theme-boot` 에서 직접 받아야 한다**(이 파일은
// `"use client"` 라 서버에서 부르면 빌드가 깨진다).
export { themeBootScript } from "./theme-boot";