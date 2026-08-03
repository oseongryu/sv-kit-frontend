"use client";

// 전시장 자체의 설명 장치 — kit 프리미티브가 아니다. 각 본보기에 "무엇을 보고
// 있는가"(Note)와 "그대로 가져갈 코드"(Code)를 붙이려고 여기 둔다.

import type { ReactNode } from "react";

/** 본보기에 딸린 설명 한 줄 */
export function Note({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground mb-2 text-xs">{children}</p>;
}

/** 복붙용 코드 조각 */
export function Code({ children }: { children: string }) {
  return (
    <pre className="bg-secondary text-muted-foreground mt-2 overflow-auto rounded p-3 font-mono text-xs">
      {children}
    </pre>
  );
}