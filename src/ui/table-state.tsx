"use client";

// 목록의 로딩·오류·빈 상태 행 — 표 본문에 얹는 한 줄.
//
// 같은 3분기를 화면마다 손으로 적으면 문구가 갈린다("로딩중…"·"데이터 없음"·
// 오류를 아예 안 그리는 표까지). 목록이 비어 있을 때 이유를 말해 주지 않으면
// 사용자는 조회가 실패한 건지 결과가 없는 건지 알 수 없다.
//
// 우선순위는 오류 → 로딩 → 빈. 셋 다 아니면 `null` 이라 호출부는 조건 없이
// `<TableState …/>` 를 행 앞에 그냥 얹으면 된다.

import type { ReactNode } from "react";

import { TableCell, TableRow } from "./table";

export function TableState({
  colSpan,
  loading,
  error,
  empty,
  emptyText,
  loadingText = "불러오는 중…",
  errorPrefix = "불러오지 못했습니다 — ",
}: {
  /** 표의 컬럼 수 — 한 줄로 펴서 가운데 정렬한다 */
  colSpan: number;
  loading?: boolean;
  error?: string | null;
  /** 행이 0건인가 */
  empty?: boolean;
  /** 빈 상태 안내 한 줄 — 무엇이 없는지까지 적는다(예: "조건에 맞는 배치가 없습니다.") */
  emptyText: ReactNode;
  loadingText?: ReactNode;
  /** 오류 메시지 앞에 붙는 안내 — 서버 문구만 덩그러니 두면 무엇이 실패했는지 안 보인다 */
  errorPrefix?: ReactNode;
}) {
  if (error) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-destructive py-4 text-center">
          {errorPrefix}
          {error}
        </TableCell>
      </TableRow>
    );
  }
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-muted-foreground py-4 text-center">
          {loadingText}
        </TableCell>
      </TableRow>
    );
  }
  if (empty) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-muted-foreground py-4 text-center">
          {emptyText}
        </TableCell>
      </TableRow>
    );
  }
  return null;
}