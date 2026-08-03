"use client";

// 표 스크롤 영역 — 목록이 자기 높이 안에서 스크롤하고 머리행은 붙박이로 둔다.
//
// 한 패널에 표가 둘 이상 쌓이는 화면에서 위 표가 길면 아래 표가 화면 밖으로
// 밀려 존재조차 안 보인다. 목록은 자기 높이 안에서 스크롤하고, 아래 것에
// 자리를 남겨야 한다.
//
// 반대로 패널에 표가 하나뿐이면 상한(40vh)은 아래를 비워 두는 낭비가 되고,
// 필터줄·페이징이 표를 따라 흘러가 버린다. 규칙은 하나다 —
// **표가 하나면 `fill`, 둘 이상이면 `max`**. fill 은 패널의 남은 높이를 채우므로
// 감싸는 패널이 `flex h-full min-h-0 flex-col` 이어야 한다.
//
// 머리행은 두 모드 공통으로 `sticky` — 스크롤해 내려가도 어떤 컬럼인지 보여야 한다.

import type { ReactNode } from "react";

import { cn } from "./utils";

/** 머리행 붙박이 — 배경을 깔지 않으면 스크롤한 본문이 글자 뒤로 비쳐 보인다 */
const STICKY_HEAD =
  "[&_thead_th]:bg-secondary [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10";

export function TableScroll({
  children,
  max = "40vh",
  fill = false,
  className,
}: {
  children: ReactNode;
  /** 최대 높이(기본 40vh). `fill` 이면 무시된다 */
  max?: string;
  /** 패널의 남은 높이를 채우고 그 안에서 스크롤한다(패널에 표가 하나일 때) */
  fill?: boolean;
  className?: string;
}) {
  if (fill) {
    return (
      <div className={cn("min-h-0 flex-1 overflow-auto", STICKY_HEAD, className)}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn("overflow-auto", STICKY_HEAD, className)} style={{ maxHeight: max }}>
      {children}
    </div>
  );
}