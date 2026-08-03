"use client";

// 검색·필터 한 줄 — 목록 위에 얹는 좁은 띠.
//
// 안에 들어가는 `Select`·`Input` 은 폼용이라 폭이 `w-full` 이 기본이다. 그대로
// 두면 컨트롤 하나가 한 줄을 통째로 먹어 검색 영역이 화면 절반이 된다.
// 여기서는 내용 폭으로 되돌리고 최소 폭만 준다 — 필터는 목록을 좁히는 도구지
// 그 자체가 화면이 아니다.

import type { ReactNode } from "react";

import { cn } from "./utils";

export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // shrink-0 — 패널이 flex-col 이라 이 줄이 눌리면 컨트롤이 찌그러진다
        "mb-2 flex shrink-0 flex-wrap items-center gap-1.5",
        // 폼 기본(w-full)을 필터 줄에서만 내용 폭으로 되돌린다
        "[&_input]:h-7 [&_input]:w-auto [&_select]:h-7 [&_select]:w-auto [&_select]:min-w-[7rem]",
        "[&_button]:h-7 [&_input]:text-xs [&_select]:text-xs",
        className,
      )}
    >
      {children}
    </div>
  );
}