// 다국어 엔진 — **사전은 앱이 갖고, 굴리는 장치만 여기 있다.**
//
// 사전은 그 앱의 도메인 낱말이라 공통으로 올릴 수 있는 물건이 아니다(소비 앱 한 곳의
// 사전이 800줄인데 전부 그 앱 화면 이름이다). 반면 "고른 말을 기억하고 · 키를 문장으로
// 바꾸고 · 바뀌면 화면을 다시 그리는" 부분은 앱마다 똑같이 다시 짜게 된다.
//
// 그래서 `createI18n()` 이 사전을 받아 그 앱 전용 도구 한 벌을 만들어 돌려준다.
// 키 타입도 사전에서 그대로 따라오므로 **앱에서 `t("없는키")` 를 쓰면 컴파일이 막힌다** —
// 사전을 kit 이 들고 있었다면 못 하는 일이다.
//
// 쓰는 법(앱의 `lib/i18n/index.ts`):
//
// ```ts
// import { createI18n } from "@sv/kit-ui/i18n";
// import ko, { type TranslationKey } from "./ko";
// import en from "./en";
//
// export const { useI18nStore, t, useT, hydrateI18n } = createI18n<TranslationKey, "ko" | "en">({
//   translations: { ko, en },
//   defaultLocale: "ko",
//   storageKey: "wm-locale",
// });
// ```
//
// `NavHeaderFrame`(shell)이 `locale`·`onToggleLocale` 을 요구하므로 그 자리에 바로 물린다.

import { create } from "zustand";

export interface I18nOptions<K extends string, L extends string> {
  /** 말별 사전. `{ ko: {...}, en: {...} }` */
  translations: Record<L, Record<K, string>>;
  /** 처음 켤 때의 말 */
  defaultLocale: L;
  /**
   * 그 말에 문장이 없을 때 대신 볼 말. 기본은 `defaultLocale`.
   * 여기에도 없으면 **키를 그대로 보여 준다** — 화면이 비는 것보다 낫고,
   * 빠진 키가 눈에 띄어 곧 채우게 된다.
   */
  fallbackLocale?: L;
  /** 고른 말을 담아 둘 localStorage 키. 없으면 기억하지 않는다 */
  storageKey?: string;
}

export interface I18nState<L extends string> {
  locale: L;
  setLocale: (locale: L) => void;
}

/** `{키}` 자리에 값을 끼운다 */
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text;
  let out = text;
  for (const [k, v] of Object.entries(params)) {
    out = out.replace(`{${k}}`, String(v));
  }
  return out;
}

export function createI18n<K extends string, L extends string>({
  translations,
  defaultLocale,
  fallbackLocale = defaultLocale,
  storageKey,
}: I18nOptions<K, L>) {
  const useI18nStore = create<I18nState<L>>((set) => ({
    locale: defaultLocale,
    setLocale: (locale) => {
      if (storageKey && typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, locale);
      }
      set({ locale });
    },
  }));

  const lookup = (locale: L, key: K, params?: Record<string, string | number>) =>
    interpolate(
      translations[locale]?.[key] ?? translations[fallbackLocale]?.[key] ?? key,
      params,
    );

  /**
   * 지금 고른 말로 옮긴다. **화면 밖(이벤트 핸들러·토스트)에서 쓴다** —
   * 스토어를 구독하지 않으므로 말을 바꿔도 이미 그려진 글자는 그대로다.
   * 화면 안에서는 `useT()` 를 써라.
   */
  const t = (key: K, params?: Record<string, string | number>) =>
    lookup(useI18nStore.getState().locale, key, params);

  /** 화면용 — 말이 바뀌면 다시 그린다 */
  const useT = () => {
    const locale = useI18nStore((s) => s.locale);
    return (key: K, params?: Record<string, string | number>) =>
      lookup(locale, key, params);
  };

  /**
   * 저장해 둔 말을 읽어 온다. **클라이언트에서 한 번 부른다**(마운트 시).
   * 서버가 그린 첫 화면은 `defaultLocale` 이라, 이걸 렌더 중에 부르면
   * 하이드레이션이 어긋난다.
   */
  const hydrateI18n = () => {
    if (!storageKey || typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey) as L | null;
    if (saved && saved in translations) useI18nStore.setState({ locale: saved });
  };

  return { useI18nStore, t, useT, hydrateI18n };
}