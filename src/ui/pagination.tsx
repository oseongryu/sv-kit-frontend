"use client";

// 쪽 넘김 — 목록이 한 화면에 안 들어갈 때 아래에 붙인다.
//
// 소비 앱들이 이걸 손으로 적다가 같은 함정에 빠졌다. 쪽 번호를
// `Array.from({ length: Math.min(totalPages, 10) })` 로 그리면 **11쪽 이후로 갈
// 방법이 아예 없다** — 목록이 커지는 순간 뒤쪽 데이터가 화면에서 사라진다.
// 여기서는 현재 쪽 둘레만 보여 주고 처음·끝을 항상 남긴 뒤 사이를 `…` 로 접는다.
//
// 자리는 **표 아래**다. 위에만 두면 마지막 행을 보고 나서 다시 올라가야 한다.

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./button";
import { cn } from "./utils";

/** 현재 쪽 둘레·처음·끝만 남기고 사이를 접는다. `null` 은 `…` 자리 */
function pageItems(page: number, total: number, siblings: number): (number | null)[] {
  // 접어서 얻는 게 없을 만큼 적으면 다 편다(처음·끝 + 현재 둘레 + 생략 둘)
  if (total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(2, page - siblings);
  const right = Math.min(total - 1, page + siblings);
  const items: (number | null)[] = [1];
  if (left > 2) items.push(null);
  for (let p = left; p <= right; p += 1) items.push(p);
  if (right < total - 1) items.push(null);
  items.push(total);
  return items;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblings = 1,
  className,
  prevLabel = "이전 쪽",
  nextLabel = "다음 쪽",
}: {
  /** 현재 쪽(1부터) */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** 현재 쪽 양옆에 몇 개를 펼칠지. 기본 1 */
  siblings?: number;
  className?: string;
  /** 화살표 버튼의 읽어 주는 이름 */
  prevLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;

  const go = (next: number) => {
    const clamped = Math.min(totalPages, Math.max(1, next));
    if (clamped !== page) onChange(clamped);
  };

  return (
    <nav
      className={cn("flex shrink-0 items-center justify-center gap-1 py-2", className)}
      aria-label="쪽 넘김"
    >
      <Button
        size="sm"
        variant="ghost"
        className="size-7 p-0"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        title={prevLabel}
        aria-label={prevLabel}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pageItems(page, totalPages, siblings).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="text-muted-foreground px-1 text-xs">
            …
          </span>
        ) : (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "ghost"}
            className="h-7 min-w-7 px-2 text-xs"
            aria-current={p === page ? "page" : undefined}
            onClick={() => go(p)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        size="sm"
        variant="ghost"
        className="size-7 p-0"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        title={nextLabel}
        aria-label={nextLabel}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}