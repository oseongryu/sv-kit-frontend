"use client";

// 패널 한 장의 뼈대 — 머리줄(PanelHead) · 조회줄(FilterBar) · 목록(TableScroll).
//
// 이 순서를 지키면 목록을 아무리 내려도 제목·버튼·검색줄이 따라 사라지지 않는다.
// 위 둘은 붙박이(shrink-0)이고 스크롤은 표만 갖는다.

import { useState } from "react";
import { Button } from "@sv/kit-ui/ui/button";
import { FilterBar } from "@sv/kit-ui/ui/filter-bar";
import { Input } from "@sv/kit-ui/ui/input";
import { Section } from "@sv/kit-ui/ui/modal";
import { PanelHead, RowCount } from "@sv/kit-ui/ui/panel";
import { Progress } from "@sv/kit-ui/ui/progress";
import { Select } from "@sv/kit-ui/ui/select";
import { StatusBadge, type Tone } from "@sv/kit-ui/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@sv/kit-ui/ui/table";
import { TableScroll } from "@sv/kit-ui/ui/table-scroll";
import { TableState } from "@sv/kit-ui/ui/table-state";

import { Code, Note } from "./bits";

/** 전시장 데이터 — 백엔드 없이 뜨도록 파일 안 상수로 둔다 */
const ROWS: { id: number; name: string; tone: Tone; label: string; done: number }[] = [
  { id: 1, name: "가 채널 수집", tone: "ok", label: "정상", done: 100 },
  { id: 2, name: "나 채널 수집", tone: "info", label: "진행중", done: 62 },
  { id: 3, name: "다 채널 수집", tone: "warn", label: "주의", done: 41 },
  { id: 4, name: "라 채널 수집", tone: "bad", label: "실패", done: 7 },
  { id: 5, name: "마 채널 수집", tone: "off", label: "사용중지", done: 0 },
  { id: 6, name: "바 채널 수집", tone: "ok", label: "정상", done: 98 },
  { id: 7, name: "사 채널 수집", tone: "ok", label: "정상", done: 91 },
  { id: 8, name: "아 채널 수집", tone: "info", label: "진행중", done: 33 },
  { id: 9, name: "자 채널 수집", tone: "warn", label: "주의", done: 55 },
  { id: 10, name: "차 채널 수집", tone: "ok", label: "정상", done: 87 },
  { id: 11, name: "카 채널 수집", tone: "bad", label: "실패", done: 12 },
  { id: 12, name: "타 채널 수집", tone: "ok", label: "정상", done: 100 },
];

export function PanelSection() {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState("all");

  const rows = ROWS.filter(
    (r) => (only === "all" || r.tone === only) && r.name.includes(q.trim()),
  );

  return (
    <div className="space-y-4 text-[13px]">
      <Section title="머리줄 · 조회줄 · 목록">
        <Note>
          아래 상자는 높이를 주려고 감쌌을 뿐이다 — 실제 화면에서는 패널이 이 자리를
          대신한다. 표를 스크롤해 보면 머리줄·조회줄이 그대로 있고 표의 머리행만 붙박이로
          따라오는 것이 보인다. 검색어를 지워 아무것도 안 남으면 `TableState` 가 빈 줄을 낸다.
        </Note>

        {/* fill 은 남은 높이를 채우므로 감싸는 쪽이 flex h-full min-h-0 flex-col 이어야 한다 */}
        <div className="border-border mt-2 flex h-[340px] min-h-0 flex-col rounded border p-3">
          <PanelHead title="수집 작업">
            <Button size="sm">새 작업</Button>
            <Button size="sm" variant="outline" disabled>
              수정
            </Button>
            <Button size="sm" variant="destructive" disabled>
              삭제
            </Button>
          </PanelHead>

          <FilterBar>
            <Input
              className="min-w-[160px]"
              placeholder="작업명 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select value={only} onChange={(e) => setOnly(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="ok">정상만</option>
              <option value="warn">주의만</option>
              <option value="bad">실패만</option>
            </Select>
            <Button size="sm">검색</Button>
            <RowCount>총 {rows.length}건</RowCount>
          </FilterBar>

          <TableScroll fill>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>작업</TableHeaderCell>
                  <TableHeaderCell className="w-[90px]">상태</TableHeaderCell>
                  <TableHeaderCell className="w-[140px]">진행</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableState
                  colSpan={3}
                  empty={rows.length === 0}
                  emptyText="조건에 맞는 작업이 없습니다."
                />
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>
                      <StatusBadge tone={r.tone}>{r.label}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Progress value={r.done} tone={r.tone} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScroll>
        </div>

        <Code>{`<div className="flex h-full min-h-0 flex-col">   {/* 패널 — fill 의 전제 */}
  <PanelHead title="수집 작업">                  {/* 제목 + 그 패널의 동작 */}
    <Button size="sm">새 작업</Button>
  </PanelHead>

  <FilterBar>                                   {/* 조회조건만 */}
    <Input className="min-w-[160px]" placeholder="검색" />
    <Select>…</Select>
    <RowCount>총 {n}건</RowCount>                {/* 건수는 오른쪽 끝 */}
  </FilterBar>

  <TableScroll fill>                            {/* 표가 하나면 fill */}
    <Table>
      <TableHead>…</TableHead>
      <TableBody>
        <TableState colSpan={3} loading={d.loading} error={d.error}
                    empty={!rows.length} emptyText="조건에 맞는 작업이 없습니다." />
        {rows.map(…)}
      </TableBody>
    </Table>
  </TableScroll>
</div>`}</Code>
      </Section>

      <Section title="표가 둘 이상이면 fill 이 아니라 max">
        <Note>
          한 패널에 표를 둘 쌓으면 위 표가 길 때 아래 표가 화면 밖으로 밀린다. 그때는
          `max`(기본 40vh)로 각자 상한을 준다 — 아래 것에 자리를 남긴다.
        </Note>
        <div className="grid gap-3 sm:grid-cols-2">
          {["최근 실행", "대기열"].map((t) => (
            <div key={t}>
              <div className="text-muted-foreground mb-1 text-xs">{t}</div>
              <TableScroll max="120px">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>작업</TableHeaderCell>
                      <TableHeaderCell className="w-[90px]">상태</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ROWS.slice(0, 6).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>
                          <StatusBadge tone={r.tone}>{r.label}</StatusBadge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableScroll>
            </div>
          ))}
        </div>
        <Code>{`<TableScroll max="32vh">…</TableScroll>   {/* 표가 둘 이상 */}`}</Code>
      </Section>
    </div>
  );
}