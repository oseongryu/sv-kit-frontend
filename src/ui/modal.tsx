"use client";

// 팝업 껍데기 — 운영 화면의 팝업은 세 종류뿐이다.
//
//   FormModal   값을 넣고 저장한다        등록·수정 폼
//   ViewModal   내용을 본다(저장 없음)     원문·상세·실행 이력
//   useConfirm  물어보고 한 번에 끝낸다    삭제·되돌리기 (ui/use-confirm)
//
// 껍데기 없이 `CommonModal` 을 직접 부르면 팝업마다 크기가 제각각이 되고, 바닥
// 버튼 줄의 여백이 한 곳씩 빠지고, 로딩·오류를 어떤 팝업은 본문 밖에서 어떤
// 팝업은 안에서 가른다. 껍데기를 고르면 그 셋이 자동으로 맞는다 —
// 팝업을 새로 만들 때는 `CommonModal` 대신 여기서 고른다.
//
// 본문은 늘 `space-y-3 text-[13px]` 안이고, 내용이 여러 덩어리면 `Section` 으로 나눈다.

import type { ReactNode } from "react";

import { Button } from "./button";
import { CommonModal } from "./CommonModal";
import { cn } from "./utils";

/** `CommonModal` 의 사이즈 프리셋과 같은 축 */
export type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "full";

/** 팝업 본문의 한 덩어리 — 제목이 붙은 카드. 내용이 둘 이상이면 이걸로 나눈다 */
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
          <dd className="text-foreground">{v || placeholder}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 값을 넣고 저장하는 팝업. 바닥은 [취소][저장] 으로 고정된다 */
export function FormModal({
  open,
  onClose,
  title,
  size = "md",
  busy,
  submitLabel = "저장",
  cancelLabel = "취소",
  busyLabel,
  onSubmit,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  /** 기본 md. 안에 목록·표가 들어가면 lg */
  size?: ModalSize;
  /** 저장 중 — 버튼을 잠그고 문구를 바꾼다 */
  busy?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  /** 진행 중 문구. 없으면 `{submitLabel} 중…` — 실행·전송 팝업에서 "저장 중…"이면 어색하다 */
  busyLabel?: string;
  onSubmit: () => void;
  children: ReactNode;
}) {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      preventClose={busy}
      footer={
        <>
          <Button size="sm" variant="outline" disabled={busy} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button size="sm" disabled={busy} onClick={onSubmit}>
            {busy ? (busyLabel ?? `${submitLabel} 중…`) : submitLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-[13px]">{children}</div>
    </CommonModal>
  );
}

/** 내용을 보는 팝업. 로딩·오류를 본문 자리에서 갈라 주고 바닥은 [닫기] 다 */
export function ViewModal({
  open,
  onClose,
  title,
  size = "lg",
  loading,
  error,
  actions,
  closeLabel = "닫기",
  loadingText = "불러오는 중…",
  errorPrefix = "불러오지 못했습니다 — ",
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** "무엇에 대한 팝업인가" — 불러온 값(문서 제목 등)을 올리지 않는다.
   *  로딩 전후로 머리글이 바뀌고 긴 값이 헤더를 밀어낸다 */
  title: string;
  size?: ModalSize;
  loading?: boolean;
  error?: string | null;
  /** 닫기 왼쪽에 붙는 그 팝업만의 동작(내려받기·중지 등) */
  actions?: ReactNode;
  closeLabel?: string;
  loadingText?: ReactNode;
  /** 오류 메시지 앞에 붙는 안내 — 서버 문구만 덩그러니 두면 무엇이 실패했는지 안 보인다 */
  errorPrefix?: ReactNode;
  children: ReactNode;
}) {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          {actions}
          <Button size="sm" variant="outline" onClick={onClose}>
            {closeLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-[13px]">
        {error ? (
          <p className="text-destructive">
            {errorPrefix}
            {error}
          </p>
        ) : loading ? (
          <p className="text-muted-foreground">{loadingText}</p>
        ) : (
          children
        )}
      </div>
    </CommonModal>
  );
}