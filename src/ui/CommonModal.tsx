"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { cn } from "./utils";

// 사이즈 프리셋 — 모바일은 항상 풀폭(Dialog 기본 max-w-[calc(100%-2rem)])이고
// `sm:` (≥640px) 이상에서만 max-width 적용. 모든 프리셋이 동일한 모바일 거동을 갖는다.
const SIZE = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  "6xl": "sm:max-w-6xl",
  full: "sm:max-w-7xl",
} as const;

type SizeKey = keyof typeof SIZE;

// 팝업 한 장의 뼈대 — 머리줄·바닥줄은 붙박이고 **가운데 본문만** 스크롤한다.
// 높이는 상한(max-h)이라 짧은 팝업은 내용 높이 그대로 줄어든다.
// 세 클래스는 `DialogContent` 기본값(`grid`·`max-h-[calc(100dvh-2rem)]`·
// `overflow-y-auto`)을 tailwind-merge 로 덮는다 — 스크롤은 본문 한 곳만 갖는다.
const SHELL_CLASS = "flex max-h-[85svh] flex-col overflow-y-hidden";

// 위치 프리셋 (PC 모드 기준, 모바일은 항상 센터)
const POSITION_CLASS: Record<string, string> = {
  center: "",
  "top-left": "!top-10 !left-2 !translate-x-0 !translate-y-0",
};

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** 사이즈 프리셋 또는 커스텀 className */
  size?: SizeKey | string;
  /** 모달 위치 (PC 모드): 'center'(기본) | 'top-left' */
  position?: keyof typeof POSITION_CLASS;
  /** 헤더 우측 액션 영역 */
  headerActions?: ReactNode;
  /** DialogContent에 추가할 className */
  className?: string;
  /** 닫기 중 방지 (loading 등) */
  preventClose?: boolean;
  /** 열릴 때 콜백 */
  onOpen?: () => void;
  /**
   * 바닥 버튼 줄 — 주면 규격화된 줄(우측 정렬·간격)에 담기고 **본문이 길어도 붙어 있는다**.
   *
   * 소비자가 매번 `flex justify-end gap-2` 를 손으로 그리면 여백이 한 곳씩 빠지고,
   * 본문 흐름 끝에 그리면 긴 팝업에서 저장 버튼이 스크롤 밖으로 밀린다.
   * **안 주면 아무것도 그리지 않는다** — 기존 호출부는 그대로 동작한다.
   */
  footer?: ReactNode;
  children: ReactNode;
}

export function CommonModal({
  open, onClose, title, size = "md",
  position = "center",
  headerActions, className, preventClose, onOpen, footer, children,
}: CommonModalProps) {
  const sizeClass = SIZE[size as SizeKey] || size;
  const positionClass = POSITION_CLASS[position] ?? "";
  const isCustom = !!headerActions;

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (v && onOpen) onOpen(); if (!v && !preventClose) onClose(); }}>
      <DialogContent
        className={cn(
          sizeClass,
          positionClass,
          SHELL_CLASS,
          // headerActions 모드는 본문이 자기 여백·스크롤을 갖는다(내부 패널이 처리).
          isCustom && "gap-0 p-0",
          className,
        )}
        showCloseButton={!isCustom}
      >
        {isCustom ? (
          <>
            <DialogHeader className="flex-row items-center justify-between border-b border-border px-4 py-2.5 shrink-0">
              <DialogTitle className="text-sm">{title}</DialogTitle>
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            </DialogHeader>
            {children}
            {/* headerActions 모드는 본문이 p-0 이라 바닥 줄이 자기 여백·구분선을 갖는다 */}
            {footer ? (
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-2.5">
                {footer}
              </div>
            ) : null}
          </>
        ) : (
          <>
            <DialogHeader className="shrink-0">
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {/* 스크롤은 여기 하나뿐이다 — 머리줄·바닥줄이 따라 밀려 올라가지 않는다 */}
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer ? (
              <div className="flex shrink-0 justify-end gap-2 pt-1">{footer}</div>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}