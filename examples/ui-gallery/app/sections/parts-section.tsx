"use client";

// 조각들 — 낱개 프리미티브를 한자리에 늘어놓고 눈으로 비교한다.
// StatusBadge 톤 5종 · Progress 톤별 · FormField/CheckField 정렬 · TableState 3상태.

import { useState } from "react";
import { CheckField, FormField } from "@sv/kit-ui/ui/form-field";
import { Input } from "@sv/kit-ui/ui/input";
import { Section } from "@sv/kit-ui/ui/modal";
import { Progress } from "@sv/kit-ui/ui/progress";
import { Select } from "@sv/kit-ui/ui/select";
import { StatusBadge, type Tone } from "@sv/kit-ui/ui/status-badge";
import { Table, TableBody } from "@sv/kit-ui/ui/table";
import { TableState } from "@sv/kit-ui/ui/table-state";
import { Textarea } from "@sv/kit-ui/ui/textarea";

import { Code, Note } from "./bits";

/** 톤은 의미로 고른다 — 색으로 고르지 않는다 */
const TONES: { tone: Tone; label: string; meaning: string; value: number }[] = [
  { tone: "ok", label: "정상", meaning: "끝났고 문제없다", value: 100 },
  { tone: "warn", label: "주의", meaning: "됐지만 살펴봐야 한다", value: 62 },
  { tone: "bad", label: "실패", meaning: "실패했다", value: 24 },
  { tone: "off", label: "사용중지", meaning: "꺼짐 · 모름", value: 0 },
  { tone: "info", label: "진행중", meaning: "지금 돌고 있다", value: 45 },
];

/** TableState 가 갈라 주는 세 경우 — 우선순위는 오류 → 로딩 → 빈 */
const STATES: { key: string; props: { loading?: boolean; error?: string; empty?: boolean } }[] =
  [
    { key: "오류", props: { error: "네트워크 끊김" } },
    { key: "로딩", props: { loading: true } },
    { key: "빈 목록", props: { empty: true } },
  ];

export function PartsSection() {
  const [on, setOn] = useState(true);
  const [agree, setAgree] = useState(false);

  return (
    <div className="space-y-4 text-[13px]">
      <Section title="상태 — StatusBadge">
        <Note>
          상태색은 톤 표 한 곳에만 있다. 화면에서 `bg-success/15` 를 직접 적지 않는다.
          ok·warn 이 회색으로 보인다면 전역 CSS 의 `@import
          &quot;@sv/kit-ui/styles/tokens.css&quot;` 가 빠진 것이다.
        </Note>
        <div className="flex flex-wrap items-center gap-2">
          {TONES.map((t) => (
            <StatusBadge key={t.tone} tone={t.tone} title={t.meaning}>
              {t.label}
            </StatusBadge>
          ))}
        </div>
        <div className="text-muted-foreground mt-2 grid gap-x-3 gap-y-1 text-xs sm:grid-cols-2">
          {TONES.map((t) => (
            <div key={t.tone}>
              <code className="text-foreground">{t.tone}</code> — {t.meaning}
            </div>
          ))}
        </div>
        <Code>{`<StatusBadge tone="ok">정상</StatusBadge>       // ok · warn · bad · off · info`}</Code>
      </Section>

      <Section title="진행 — Progress">
        <Note>
          채움색은 같은 톤 표(`toneFill`)에서 온다 — 뱃지와 막대의 &quot;주의&quot; 색이
          어긋나지 않는다. 값은 0–100 으로 클램프되므로 120 을 넣어도 넘치지 않는다.
        </Note>
        <div className="space-y-2">
          {TONES.map((t) => (
            <div key={t.tone} className="flex items-center gap-2">
              <span className="text-muted-foreground w-16 shrink-0 text-xs">{t.tone}</span>
              <Progress value={t.value} tone={t.tone} className="max-w-[320px]" />
              <span className="text-muted-foreground text-xs">{t.value}%</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground w-16 shrink-0 text-xs">클램프</span>
            <Progress value={999} className="max-w-[320px]" />
            <span className="text-muted-foreground text-xs">value=999 → 100%</span>
          </div>
        </div>
        <Code>{`<Progress value={done} max={total} tone="warn" />`}</Code>
      </Section>

      <Section title="폼 — FormField · CheckField">
        <Note>
          Input 과 Select 의 높이가 같다(h-8). 호출부가 높이·폭을 적지 않아도 FormField 가
          자손 선택자로 맞춘다. 체크박스는 옆 칸 라벨 줄만큼 자리를 비워 바닥선을 맞춘다 —
          `mt-5` 같은 매직값이 필요 없다.
        </Note>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="이름">
            <Input placeholder="입력" />
          </FormField>
          <FormField label="채널">
            <Select defaultValue="all">
              <option value="all">전체</option>
              <option value="blog">블로그</option>
            </Select>
          </FormField>
          <CheckField label="사용" checked={on} onChange={setOn} />
          <FormField label="메모">
            <Textarea rows={2} placeholder="여러 줄은 높이 강제 대상이 아니다" />
          </FormField>
        </div>
        <div className="mt-2">
          <CheckField label="줄 안에 놓기(inline)" checked={agree} onChange={setAgree} inline />
        </div>
        <Code>{`<div className="grid grid-cols-2 gap-3">
  <FormField label="이름"><Input value={name} onChange={onName} /></FormField>
  <FormField label="채널"><Select>…</Select></FormField>
  <CheckField label="사용" checked={on} onChange={setOn} />
</div>`}</Code>
      </Section>

      <Section title="목록 상태 — TableState">
        <Note>
          오류 → 로딩 → 빈 순서로 갈리고, 셋 다 아니면 아무것도 그리지 않는다(`null`).
          호출부는 조건 없이 행 앞에 그냥 얹으면 된다.
        </Note>
        <div className="grid gap-3 sm:grid-cols-3">
          {STATES.map((s) => (
            <div key={s.key}>
              <div className="text-muted-foreground mb-1 text-xs">{s.key}</div>
              <Table>
                <TableBody>
                  <TableState
                    colSpan={1}
                    emptyText="조건에 맞는 항목이 없습니다."
                    {...s.props}
                  />
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
        <Code>{`<TableBody>
  <TableState colSpan={3} loading={d.loading} error={d.error}
              empty={!rows.length} emptyText="조건에 맞는 작업이 없습니다." />
  {rows.map(…)}
</TableBody>`}</Code>
      </Section>
    </div>
  );
}