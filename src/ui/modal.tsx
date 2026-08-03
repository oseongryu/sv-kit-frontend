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

// 카드·라벨값은 화면에서도 쓰므로 ui/section 이 갖는다. 여기서 다시 내보내
// 기존 `ui/modal` import 를 그대로 살린다(계약 유지).
export { Section, DescList } from "./section";

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
  onCancel,
  onSubmit,
  headerActions,
  preventClose,
  onOpen,
  className,
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
  /** 왼쪽 버튼이 누를 때 할 일. 없으면 `onClose`(닫기).
   *  단계가 있는 폼에서 "이전 단계로" 처럼 **닫는 것이 아닌** 동작이 필요할 때 준다 —
   *  라벨만 바꿀 수 있으면 그런 팝업은 이 껍데기를 못 쓰고 직접 그리게 된다 */
  onCancel?: () => void;
  onSubmit: () => void;
  /** 머리줄 오른쪽 — 저장이 바닥이 아니라 헤더에 있는 팝업이 있다.
   *  주면 `CommonModal` 이 본문 여백을 스스로 관리하는 모드로 바뀐다 */
  headerActions?: ReactNode;
  /** 닫기 막기. 기본은 `busy` 일 때만 막는다 */
  preventClose?: boolean;
  /** 열릴 때 한 번 */
  onOpen?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      preventClose={preventClose ?? busy}
      headerActions={headerActions}
      onOpen={onOpen}
      className={className}
      footer={
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={onCancel ?? onClose}
          >
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
  keepActionsOnError,
  headerActions,
  preventClose,
  onOpen,
  className,
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
  /** 오류일 때도 `actions` 를 남긴다 — 다시 시도처럼 **실패했을 때 눌러야 하는** 동작이 있다 */
  keepActionsOnError?: boolean;
  /** 머리줄 오른쪽 — 내려받기·엔진 선택처럼 본문이 아니라 팝업에 걸린 동작 */
  headerActions?: ReactNode;
  preventClose?: boolean;
  onOpen?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      headerActions={headerActions}
      preventClose={preventClose}
      onOpen={onOpen}
      className={className}
      footer={
        <>
          {/* 본문이 아직 없거나 실패했으면 그 내용에 걸린 동작(내려받기 등)도
              쓸 데가 없다 — 닫기만 남긴다. 다만 '다시 시도'처럼 실패했을 때
              눌러야 하는 동작이 있는 팝업은 `keepActionsOnError` 로 남긴다 */}
          {loading || (error && !keepActionsOnError) ? null : actions}
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