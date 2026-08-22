"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "destructive",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
      {/* 뼈대는 CommonModal 과 같다 — 물음이 길어도 [취소][확인]은 붙어 있는다 */}
      <DialogContent className="flex max-h-[85svh] flex-col overflow-y-hidden sm:max-w-sm">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="min-h-0 flex-1 overflow-y-auto text-sm text-muted-foreground">
          {message}
        </p>
        <div className="flex shrink-0 justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>{cancelLabel}</Button>
          <Button variant={variant} size="sm" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
