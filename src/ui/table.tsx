import * as React from "react"

import { cn } from "./utils"

/**
 * 표 프리미티브 — 운영 화면의 목록·이력이 전부 표다.
 *
 * 소비 앱이 전역 CSS(`table { … }`)로 칠하던 것을 컴포넌트로 옮긴다. 전역
 * 규칙은 앱마다 달라지고, 한 화면에서 예외를 두는 순간 표마다 모양이 갈린다.
 *
 * 색은 전부 시맨틱 토큰이라 다크 모드에서 같이 뒤집힌다.
 * 스크롤은 감싸는 쪽이 맡는다(`Table` 은 자기 폭만 채운다).
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table
      data-slot="table"
      className={cn("w-full border-collapse bg-card text-[13px]", className)}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-head" className={cn(className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />
}

/** 행 — `onClick` 을 주면 고를 수 있는 행으로 본다(커서·hover). */
function TableRow({
  className,
  selected,
  ...props
}: React.ComponentProps<"tr"> & { selected?: boolean }) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected || undefined}
      className={cn(
        props.onClick && "cursor-pointer hover:bg-accent/50",
        selected && "bg-secondary",
        className
      )}
      {...props}
    />
  )
}

function TableHeaderCell({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-header-cell"
      className={cn(
        "border border-border bg-secondary px-2 py-1.5 text-left align-top font-semibold",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("border border-border px-2 py-1.5 text-left align-top", className)}
      {...props}
    />
  )
}

export { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell }
