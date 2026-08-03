"use client";

// 내용 한 덩어리 — 제목이 붙은 카드와 라벨-값 목록.
//
// 팝업 본문을 나누려고 만들었지만(ui/modal) 화면 본문에서도 그대로 쓸모가 있어
// 따로 둔다. 화면 코드가 `ui/modal` 에서 카드를 받아 오면 읽는 사람이 팝업을
// 찾게 된다. `ui/modal` 도 이 둘을 그대로 다시 내보내므로 기존 import 는 그대로 산다.

import type { ReactNode } from "react";

import { cn } from "./utils";

/** 본문의 한 덩어리 — 제목이 붙은 카드. 내용이 둘 이상이면 이걸로 나눈다 */
export function Section({
  title,
  children,
  className,
}: {
  /** 없으면 제목 줄 없이 테두리만 */
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-border rounded border p-3", className)}>
      {title ? (
        <div className="text-muted-foreground mb-1 text-xs">{title}</div>
      ) : null}
      {children}
    </div>
  );
}

/** 라벨-값 목록 — 메타 정보를 가운뎃점으로 이어 붙이면 빈 값이 점만 남는다 */
export function DescList({
  items,
  placeholder = "—",
}: {
  items: [ReactNode, ReactNode][];
  /** 값이 비었을 때 대신 그릴 것 — 칸을 비워 두면 줄이 어긋난다 */
  placeholder?: ReactNode;
}) {
  return (
    <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
      {items.map(([k, v], i) => (
        <div key={i} className="contents">
          <dt>{k}</dt>
          {/* `||` 로 판정하면 숫자 0·false·빈 문자열이 값인데도 자리표시로 바뀐다
              (건수·회차 같은 메타에서 걸린다). 없음은 null·undefined·빈 문자열뿐이다 */}
          <dd className="text-foreground">
            {v === null || v === undefined || v === "" ? placeholder : v}
          </dd>
        </div>
      ))}
    </dl>
  );
}