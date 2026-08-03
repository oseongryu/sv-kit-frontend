"use client";

// 폼 한 칸 — 라벨은 컨트롤 위, 컨트롤 높이는 폼 안에서 하나다.
//
// `<label class="block"><span class="text-muted-foreground">…</span><Input class="mt-1 h-8"/></label>`
// 조합을 화면마다 손으로 적으면 변형이 금세 스무 벌을 넘고, 특히 `Select` 에
// `h-8` 을 빠뜨려 같은 폼 안에서 입력 높이가 두 종류가 된다.
//
// 높이·폭은 `FilterBar`(ui/filter-bar) 와 같은 방식으로 여기서 자손 선택자로
// 강제한다 — 호출부가 `h-8`·`w-full` 을 적을 필요도, 빠뜨릴 여지도 없앤다.
// 여러 줄을 쓰는 Textarea 와 체크박스는 높이 강제 대상에서 뺀다.
// 2열이 필요하면 호출부에서 `grid grid-cols-2 gap-3` 로 감싼다.

import type { ReactNode } from "react";

import { cn } from "./utils";

/** 폼 안 컨트롤 높이·폭 규칙 — Textarea·체크박스는 제외한다 */
const CONTROL = cn(
  "[&_input:not([type=checkbox]):not([type=radio])]:h-8 [&_select]:h-8",
  "[&_input:not([type=checkbox]):not([type=radio])]:w-full [&_select]:w-full [&_textarea]:w-full",
);

export function FormField({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", CONTROL, className)}>
      <span className="text-muted-foreground block">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

export function CheckField({
  label,
  checked,
  onChange,
  className,
  inline = false,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  /** 폼 격자 밖(줄 안)에 놓는다 — 라벨 자리를 비워 두지 않는다 */
  inline?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      {/* 옆 칸의 라벨 줄만큼 자리를 비워 둔다 — `mt-5` 같은 매직 오프셋 대신
          같은 구조를 반복해 바닥선을 맞춘다 */}
      {inline ? null : (
        <span className="text-muted-foreground block" aria-hidden>
          &nbsp;
        </span>
      )}
      <span
        className={cn(
          inline ? "flex" : "mt-1 flex h-8",
          "cursor-pointer items-center gap-2",
        )}
      >
        <input
          type="checkbox"
          className="size-4"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{label}</span>
      </span>
    </label>
  );
}