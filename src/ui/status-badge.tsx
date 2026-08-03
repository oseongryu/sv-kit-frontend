"use client";

// 상태 뱃지 — "지금 어떤 상태인가"를 한 낱말로 보여 주는 알약.
//
// 같은 `bg-*/15 text-*` 규칙을 화면마다(켬/끔 표시·상태칩·노드칩) 각자 적으면
// 같은 "실패"가 화면마다 다른 색이 된다. 모양은 `ui/badge` 가 이미 주므로
// 여기서는 **톤→클래스 매핑만** 얹는다.
//
// 톤은 의미로 고른다 — ok 정상·warn 주의·bad 실패·off 꺼짐/모름·info 진행중.
// 이 표 말고 다른 곳에서 상태색을 적지 않는다.
//
// ⚠ `ok`·`warn` 은 shadcn 표준에 없는 `--success`·`--warning` 토큰을 쓴다.
//    소비 앱의 전역 CSS 에 아래 한 줄이 없으면 이 두 톤만 색이 안 나온다.
//      @import "@sv/kit-ui/styles/tokens.css";

import type { ReactNode } from "react";

import { Badge } from "./badge";
import { cn } from "./utils";

export type Tone = "ok" | "warn" | "bad" | "off" | "info";

const TONE: Record<Tone, string> = {
  ok: "bg-success/15 text-success",
  warn: "bg-warning/15 text-warning",
  bad: "bg-destructive/15 text-destructive",
  off: "bg-secondary text-muted-foreground",
  info: "bg-info/15 text-info",
};

export function StatusBadge({
  tone = "off",
  children,
  title,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <Badge variant="secondary" title={title} className={cn(TONE[tone], className)}>
      {children}
    </Badge>
  );
}

// 진행바처럼 면을 꽉 채우는 자리는 옅은 배경(/15)이 아니라 원색이 필요하다.
// 톤 이름은 같으므로 매핑을 같은 파일에 둔다 — 상태색은 이 파일 밖으로 나가지 않는다.
const FILL: Record<Tone, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  bad: "bg-destructive",
  off: "bg-muted-foreground",
  info: "bg-info",
};

/** 톤의 채움색 클래스(진행바 등) */
export const toneFill = (tone: Tone) => FILL[tone];