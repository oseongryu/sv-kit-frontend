"use client";

// 폼·패널의 오류 한 줄 — 표의 `ui/table-state` 에 대응하는 폼 판.
//
// `{error && <p className="text-xs text-destructive">{error}</p>}` 를 화면마다
// 적으면 크기·줄바꿈이 갈리고(소비 앱에 100곳이 넘었다) 줄바꿈이 든 긴 서버 문구가
// 한 줄로 뭉개지거나 폼 폭을 뚫는다.
//
// 둘의 쓰임이 다르다 — `FormError` 는 방금 한 동작이 실패한 것(문구 그대로),
// `FormState` 는 그 영역을 못 불러온 것(안내를 앞에 붙인다).

import type { ReactNode } from "react";

import { cn } from "./utils";

/** 없으면 `null` — 호출부는 조건 없이 그냥 얹는다 */
export function FormError({
  error,
  className,
}: {
  error?: string | null | false;
  className?: string;
}) {
  if (!error) return null;
  return (
    <p
      className={cn(
        "text-destructive text-xs break-words whitespace-pre-wrap",
        className,
      )}
    >
      {error}
    </p>
  );
}

/** 우선순위는 표와 같다 — 오류 → 로딩 → `null` */
export function FormState({
  loading,
  error,
  loadingText = "불러오는 중…",
  errorPrefix = "불러오지 못했습니다 — ",
  className,
}: {
  loading?: boolean;
  error?: string | null;
  loadingText?: ReactNode;
  /** 오류 앞 안내 — 서버 문구만 두면 무엇이 실패했는지 안 보인다 */
  errorPrefix?: ReactNode;
  className?: string;
}) {
  if (error) {
    return (
      <p
        className={cn(
          "text-destructive py-4 text-center text-xs break-words whitespace-pre-wrap",
          className,
        )}
      >
        {errorPrefix}
        {error}
      </p>
    );
  }
  if (loading) {
    return (
      <p
        className={cn(
          "text-muted-foreground py-4 text-center text-xs",
          className,
        )}
      >
        {loadingText}
      </p>
    );
  }
  return null;
}
