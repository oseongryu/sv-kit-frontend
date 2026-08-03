"use client";

// 패널 머리줄·건수 — 한 화면에 패널이 여럿일 때 같은 규칙을 쓰게 하는 조각.
//
// 제목이 필터줄 안에 있고, 건수는 제목 옆 괄호에, 동작 버튼은 조회조건과 같은
// 줄에 섞이면 같은 화면인데 패널마다 다른 화면처럼 보인다. 규칙은 하나다 —
// **제목·동작은 머리줄, 건수는 필터줄 오른쪽 끝**.

import type { ReactNode } from "react";

import { cn } from "./utils";

/** 패널 머리줄 — 왼쪽 제목, 오른쪽 그 패널의 동작 */
export function PanelHead({
  title,
  children,
  className,
}: {
  title: ReactNode;
  /** 오른쪽 끝에 붙는 그 패널의 동작 버튼들 */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-2 flex shrink-0 items-center gap-2", className)}>
      <h2 className="text-[15px] font-semibold">{title}</h2>
      <span className="flex-1" />
      {children}
    </div>
  );
}

/** 목록 건수 — 필터줄 오른쪽 끝에 붙인다(동작이 아니라 목록의 설명이다) */
export function RowCount({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-muted-foreground ml-auto text-xs", className)}>
      {children}
    </span>
  );
}