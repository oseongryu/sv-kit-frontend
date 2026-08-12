import * as React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

export interface WithTooltipProps {
  title: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  delay?: number;
}

export function WithTooltip({ title, children, side = "bottom", sideOffset = 4, delay = 200 }: WithTooltipProps) {
  if (!title) return <>{children}</>;

  // 트리거는 자기 <button> 을 만든다 — 그 안에 children(대개 <Button>)을 넣으면
  // 버튼이 중첩돼 브라우저가 DOM 을 고쳐 놓고, 그 결과 hydration 이 깨진다.
  // children 을 트리거 **자체로** 렌더해 요소를 하나만 남긴다.
  const trigger = React.isValidElement(children) ? children : <span>{children}</span>;

  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger render={trigger} />
        <TooltipContent side={side} sideOffset={sideOffset}>
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
