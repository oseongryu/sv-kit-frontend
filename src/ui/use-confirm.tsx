"use client";

// 확인창 — 네이티브 `confirm()` 을 대신한다.
//
// 브라우저 기본 창은 다크 모드·글꼴이 셸과 따로 놀고, 제목·버튼 문구를 정할 수
// 없다. 특히 "삭제만 할지, 제외 목록에도 넣을지" 처럼 두 갈래가 다 진행인 물음은
// 확인/취소 두 낱말로 뜻이 전해지지 않는다.
//
// `ConfirmDialog`(ui/ConfirmDialog) 는 열림 상태를 호출부가 들고 있어야 해서,
// 그대로 쓰면 화면마다 같은 `useState` 를 다시 적게 된다. 여기서 한 번만 묶는다.
//
// 부르는 방법은 둘 다 된다 — 어느 쪽도 틀리지 않아 한 벌로 받는다.
//   기다리기   `if (!(await confirm({ title, message }))) return;`
//   맡기기     `confirm({ title, message, run: () => void 지우기() })`
//
// **`run` 은 기다리지 않는다.** 확인을 누르면 창을 닫으면서 바로 띄우고, 반환된
// promise 는 "일이 끝났다"가 아니라 "확인을 눌렀다"로 풀린다 — 창이 일이 끝날
// 때까지 남아 있으면 사용자는 멈춘 줄 안다. 끝나는 시점이 필요하면 `run` 대신
// 기다리기 쪽을 쓰고 호출부에서 이어 하라.
//
// 이름을 `confirm` 으로 둔 것은 의도적이다 — 전역 `confirm` 을 가려 실수로
// 네이티브 창이 다시 살아나는 것을 막는다.

import { useCallback, useRef, useState } from "react";

import { ConfirmDialog } from "./ConfirmDialog";

export interface ConfirmAsk {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  /** 확인을 누르면 실행할 일. 반환값을 기다릴 거면 안 줘도 된다 */
  run?: () => void | Promise<void>;
}

export function useConfirm() {
  const [ask, setAsk] = useState<ConfirmAsk | null>(null);
  const resolver = useRef<((ok: boolean) => void) | null>(null);
  const answered = useRef(false);

  /** 확인창을 열고 사용자의 선택을 기다린다 — 확인이면 true */
  const confirm = useCallback((next: ConfirmAsk) => {
    setAsk(next);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const dialog = ask ? (
    <ConfirmDialog
      open
      title={ask.title}
      message={ask.message}
      confirmLabel={ask.confirmLabel ?? "확인"}
      cancelLabel={ask.cancelLabel}
      variant={ask.variant ?? "destructive"}
      onConfirm={() => {
        answered.current = true;
        void ask.run?.();
      }}
      // ConfirmDialog 는 확인이면 onConfirm 다음에 onClose 를 부른다.
      // 닫기·취소·ESC 는 onClose 만 오므로 그대로 '취소'다.
      onClose={() => {
        setAsk(null);
        const ok = answered.current;
        answered.current = false;
        const resolve = resolver.current;
        resolver.current = null;
        resolve?.(ok);
      }}
    />
  ) : null;

  return { confirm, dialog };
}