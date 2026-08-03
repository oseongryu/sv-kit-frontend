import * as React from "react"

import { cn } from "./utils"

/**
 * 네이티브 `<select>` 에 kit 스타일만 입힌 프리미티브.
 *
 * 팝오버형(base-ui Select)이 아니라 네이티브를 쓰는 이유:
 *  - 운영 화면의 선택 목록은 대개 짧고, 키보드·모바일 동작을 브라우저가 이미 맞게 한다
 *  - 기존 `<select>` 를 한 줄 치환으로 옮길 수 있다(`value`/`onChange` 그대로)
 *
 * 검색·다중선택처럼 네이티브로 안 되는 요구가 생기면 그때 별도 컴포넌트를
 * 추가한다 — 이 컴포넌트의 props(= `<select>` 의 props)는 바꾸지 않는다.
 */
function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2 py-1 text-sm transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:disabled:bg-input/80",
        className
      )}
      {...props}
    />
  )
}

export { Select }
