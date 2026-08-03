"use client";

// 진행바 — 진척·비중처럼 "전체 중 얼마"를 보여 주는 막대.
//
// 화면마다 `<div style={{ width: `${p}%`, background: "var(--primary)" }}>` 를
// 손으로 적으면 높이·모서리·색이 조금씩 달라지고, 값이 100 을 넘거나 음수가 되는
// 경우를 아무도 막지 않는다. 여기서 한 번에 막는다.
//
// 폭만 계산값이라 인라인 스타일로 두고, 색은 톤 표(ui/status-badge)에서 가져온다.
//
// ⚠ `ok`·`warn` 톤은 `--success`·`--warning` 토큰을 쓴다 — 소비 앱 전역 CSS 에
//    `@import "@sv/kit-ui/styles/tokens.css";` 가 없으면 그 두 톤만 색이 안 나온다.

import { toneFill, type Tone } from "./status-badge";
import { cn } from "./utils";

export function Progress({
  value,
  max = 100,
  tone = "info",
  className,
}: {
  value: number;
  /** 분모(기본 100) */
  max?: number;
  tone?: Tone;
  className?: string;
}) {
  const total = max > 0 ? max : 100;
  // NaN 은 Math.min/max 를 그대로 통과해 `width: NaN%` 가 된다(막대가 사라진다).
  // 아직 안 받아온 값이 NaN 으로 들어오는 일이 잦아 0 으로 떨어뜨린다.
  const raw = (value / total) * 100;
  const pct = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 0;
  return (
    <div
      className={cn("bg-secondary h-2 w-full overflow-hidden rounded", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn("h-full", toneFill(tone))} style={{ width: `${pct}%` }} />
    </div>
  );
}