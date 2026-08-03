// 토큰 보관 — 어디에 담고, 언제 만료로 볼지.
//
// `api`(전송)와 `core`(401 처리)는 이미 있는데 **토큰을 담고 만료를 판정하는 층**이
// 없어서 앱마다 다시 짜게 된다. 그 층만 여기 둔다. 로그인 화면은 앱의 것이다 —
// 무엇을 입력받는지가 앱마다 다르기 때문이다(서버 주소를 받는 앱도 있다).
//
// 이 파일에 `"use client"` 를 붙이지 않는다. 전부 `typeof window` 로 막은 순수
// 함수라 서버 컴포넌트에서 import 해도 안전하고, 붙이면 오히려 서버 쪽에서 못 쓴다.
//
// ## 스코프
//
// 서버를 여럿 붙이는 앱은 **서버마다 토큰이 다르다.** 그래서 키에 스코프를 끼운다
// (`jwt_token_{scope}`). 서버가 하나뿐인 앱은 `defaultScope` 를 한 번 정해 두고
// 인자 없이 부르면 된다.
//
// ```ts
// // 서버 여럿
// export const auth = createAuth({ unifiedKey: "wm-unified-token" });
// auth.getToken(serverId);
//
// // 서버 하나
// export const auth = createAuth({ defaultScope: "app" });
// auth.getToken();
// ```
//
// ## 만료 판정
//
// 토큰 종류마다 만료를 아는 방법이 다르다. 자체 발급 JWT 는 `exp` 클레임을 보면
// 되지만, 외부에서 받은 불투명 토큰(`osk-…` 류)은 뜯어볼 수가 없다 — 그건 발급
// 시점에 받아 둔 메타의 `exp` 를 보고, 그마저 없으면 **서버가 401 을 줄 때까지
// 유효한 것으로 본다**. 종류가 늘면 `validators` 에 한 줄 더한다.

export interface AuthMeta {
  /** 발급 스키마 — 기본 제공은 `local`·`bearer_external` */
  type: string;
  /** 초 단위 unix epoch. 있으면 만료 비교에 쓴다 */
  exp?: number;
  [k: string]: unknown;
}

/** 토큰이 아직 쓸 만한가 */
export type AuthValidator = (token: string, meta: AuthMeta | null) => boolean;

export interface AuthOptions {
  /** 스코프를 안 넘길 때 쓸 값. 서버가 하나뿐인 앱이 쓴다 */
  defaultScope?: string;
  /** 토큰 키 앞머리. 기본 `jwt_token_` */
  tokenPrefix?: string;
  /** 메타 키 앞머리. 기본 `auth_meta_` */
  metaPrefix?: string;
  /**
   * 통합 토큰을 담을 키. **주면** 스코프별 토큰이 없을 때 이걸로 넘어간다
   * (한 번 인증해 여러 서버에 쓰는 앱). 안 주면 그 기능이 없다.
   */
  unifiedKey?: string;
  /** 판정 규칙 추가·교체. 기본 규칙과 합쳐진다 */
  validators?: Record<string, AuthValidator>;
}

/** JWT 가운데 토막(payload)을 읽는다. 모양이 아니면 `null` */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const BUILTIN_VALIDATORS: Record<string, AuthValidator> = {
  // 자체 발급 JWT — `exp` 클레임이 있어야 한다
  local: (token) => {
    const payload = parseJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") return false;
    return payload.exp * 1000 >= Date.now();
  },
  // 외부에서 받은 불투명 토큰 — 뜯어볼 수 없으니 받아 둔 메타를 본다.
  // 메타에도 없으면 서버가 401 을 줄 때까지 유효한 것으로 둔다
  bearer_external: (_token, meta) =>
    typeof meta?.exp === "number" ? meta.exp * 1000 >= Date.now() : true,
};

export function createAuth({
  defaultScope = "",
  tokenPrefix = "jwt_token_",
  metaPrefix = "auth_meta_",
  unifiedKey,
  validators,
}: AuthOptions = {}) {
  const rules = { ...BUILTIN_VALIDATORS, ...validators };
  const has = () => typeof window !== "undefined";
  const at = (scope?: string) => scope ?? defaultScope;

  const getUnifiedToken = (): string | null =>
    has() && unifiedKey ? window.localStorage.getItem(unifiedKey) : null;

  const saveUnifiedToken = (token: string): void => {
    if (has() && unifiedKey) window.localStorage.setItem(unifiedKey, token);
  };

  const removeUnifiedToken = (): void => {
    if (has() && unifiedKey) window.localStorage.removeItem(unifiedKey);
  };

  const ownToken = (scope?: string): string | null =>
    has() ? window.localStorage.getItem(`${tokenPrefix}${at(scope)}`) : null;

  const saveToken = (token: string, meta?: AuthMeta, scope?: string): void => {
    if (!has()) return;
    window.localStorage.setItem(`${tokenPrefix}${at(scope)}`, token);
    if (meta) {
      window.localStorage.setItem(`${metaPrefix}${at(scope)}`, JSON.stringify(meta));
    }
  };

  /** 스코프 토큰이 먼저, 없으면 통합 토큰 */
  const getToken = (scope?: string): string | null =>
    ownToken(scope) ?? getUnifiedToken();

  const getAuthMeta = (scope?: string): AuthMeta | null => {
    if (!has()) return null;
    const raw = window.localStorage.getItem(`${metaPrefix}${at(scope)}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthMeta;
    } catch {
      return null;
    }
  };

  const removeToken = (scope?: string): void => {
    if (!has()) return;
    window.localStorage.removeItem(`${tokenPrefix}${at(scope)}`);
    window.localStorage.removeItem(`${metaPrefix}${at(scope)}`);
  };

  const isAuthenticated = (scope?: string): boolean => {
    if (!has()) return false;
    const token = ownToken(scope);
    // 스코프 토큰이 없어도 통합 토큰이 있으면 인증된 것으로 본다 —
    // 실제 유효성은 서버가 401 로 알려 준다
    if (!token) return !!getUnifiedToken();
    const meta = getAuthMeta(scope);
    // 메타가 없으면 예전에 저장된 토큰으로 보고 `local` 로 다룬다
    const rule = rules[meta?.type ?? "local"];
    return rule ? rule(token, meta) : false;
  };

  return {
    saveToken,
    getToken,
    getAuthMeta,
    removeToken,
    isAuthenticated,
    saveUnifiedToken,
    getUnifiedToken,
    removeUnifiedToken,
  };
}