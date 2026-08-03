"use client";

// 검색·필터 한 줄 — 목록 위에 얹는 좁은 띠.
//
// 안에 들어가는 `Select`·`Input` 은 폼용이라 폭이 `w-full` 이 기본이다. 그대로
// 두면 컨트롤 하나가 한 줄을 통째로 먹어 검색 영역이 화면 절반이 된다.
// 여기서는 내용 폭으로 되돌리고 최소 폭만 준다 — 필터는 목록을 좁히는 도구지
// 그 자체가 화면이 아니다.

import type { ReactNode } from "react";

import { Checkbox } from "./checkbox";
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
        // 체크박스·라디오는 뺀다 — 높이를 강제하면 네모 칸이 28px 로 늘어난다
        // (`form-field` 도 같은 예외를 둔다)
        "[&_input:not([type=checkbox]):not([type=radio])]:h-7",
        "[&_input:not([type=checkbox]):not([type=radio])]:w-auto",
        "[&_input:not([type=checkbox]):not([type=radio])]:text-xs",
        "[&_select]:h-7 [&_select]:w-auto [&_select]:min-w-[7rem] [&_select]:text-xs",
        "[&_button]:h-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * 조회줄 안의 켬/끔 조건 — "사용중만"·"활성만" 처럼 목록을 좁히는 체크 한 칸.
 *
 * `form-field` 의 `CheckField` 는 **폼용**이다. 라벨 줄만큼 자리를 비워 옆 칸
 * 인풋과 바닥선을 맞추고 글자도 폼 크기라, 조회줄에 넣으면 줄이 높아지고 글자가
 * 튄다. 조회줄은 한 줄에 붙어야 하고 글자는 `text-xs` 다.
 *
 * 네모는 `ui/checkbox`(base-ui)를 쓴다 — 네이티브 체크박스는 브라우저마다 크기·색이
 * 달라 다크 모드에서 튄다.
 */
export function FilterCheck({
  label,
  checked,
  onChange,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "text-muted-foreground flex cursor-pointer items-center gap-1.5 text-xs",
        className,
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
      />
      {label}
    </label>
  );
}
