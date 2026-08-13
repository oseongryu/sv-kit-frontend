"use client";

// 카드 — 테두리로 묶은 한 덩어리. 밀도(size)를 카드가 정하고 안의 조각이 따른다.
//
//   md   화면 한 덩어리          rounded-xl · 20px 여백 (기본)
//   sm   목록에 쌓이는 항목      rounded · 12px 여백
//
// `Section` 과 겹치지 않는다 — Section 은 제목+테두리 한 겹이고, 카드는 헤더·본문·
// 바닥이 있는 덩어리다. 태그는 `render` 로 바꾼다(<a>·<button> 카드).

import { useState } from "react";
import { Button } from "@sv/kit-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@sv/kit-ui/ui/card";
import { DescList, Section } from "@sv/kit-ui/ui/modal";
import { Progress } from "@sv/kit-ui/ui/progress";
import { StatusBadge, type Tone } from "@sv/kit-ui/ui/status-badge";

import { Code, Note } from "./bits";

/** 전시장 데이터 — 백엔드 없이 뜨도록 파일 안 상수로 둔다 */
const JOBS: { id: number; name: string; tone: Tone; label: string; done: number }[] = [
  { id: 1, name: "가 채널 수집", tone: "ok", label: "정상", done: 100 },
  { id: 2, name: "나 채널 수집", tone: "info", label: "진행중", done: 62 },
  { id: 3, name: "다 채널 수집", tone: "warn", label: "주의", done: 41 },
];

/** 링크 카드 — 태그만 <a> 로 바뀌고 모양은 그대로다 */
const LINKS = [
  { href: "#card-link-1", title: "수집 설정", desc: "채널·주기·보관일" },
  { href: "#card-link-2", title: "실행 이력", desc: "최근 30일" },
];

export function CardSection() {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="space-y-4 text-[13px]">
      <Section title="화면 한 덩어리 — 기본 md">
        <Note>
          헤더(제목·설명) · 본문 · 바닥 버튼 줄. 여백과 모서리는 카드가 갖는다 — 화면에서
          `rounded border border-border bg-card` 를 다시 적지 않는다.
        </Note>
        <Card className="max-w-[420px]">
          <CardHeader>
            <CardTitle>가 채널 수집</CardTitle>
            <CardDescription>매일 03:00 · 최근 30일 보관</CardDescription>
          </CardHeader>
          <CardContent>
            <DescList
              items={[
                ["마지막 실행", "2026-08-13 03:00"],
                ["수집 건수", 128],
                ["담당자", null],
              ]}
            />
          </CardContent>
          <CardFooter>
            <Button size="sm">지금 실행</Button>
            <Button size="sm" variant="outline">
              설정
            </Button>
          </CardFooter>
        </Card>
        <Code>{`<Card>                                  {/* 기본 md */}
  <CardHeader>
    <CardTitle>가 채널 수집</CardTitle>
    <CardDescription>매일 03:00</CardDescription>
  </CardHeader>
  <CardContent><DescList items={…} /></CardContent>
  <CardFooter>
    <Button size="sm">지금 실행</Button>
  </CardFooter>
</Card>`}</Code>
      </Section>

      <Section title="목록에 쌓이는 항목 — size sm">
        <Note>
          밀도는 카드가 정하고 안의 조각이 따른다 — `CardHeader`·`CardContent` 에 size 를
          다시 적지 않는다. 한 곳만 빠뜨려도 여백이 어긋나던 자리다. 제목 글씨도 함께
          작아진다(sm 은 `text-sm`, md 는 `font-semibold`).
        </Note>
        <div className="grid gap-2 sm:grid-cols-3">
          {JOBS.map((j) => (
            <Card key={j.id} size="sm">
              <CardHeader>
                <CardTitle>{j.name}</CardTitle>
                <CardDescription>
                  <StatusBadge tone={j.tone}>{j.label}</StatusBadge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={j.done} tone={j.tone} />
              </CardContent>
            </Card>
          ))}
        </div>
        <Code>{`<Card size="sm">                        {/* 목록 항목 */}
  <CardHeader>
    <CardTitle>{job.name}</CardTitle>       {/* size 를 다시 적지 않는다 */}
    <CardDescription><StatusBadge tone={job.tone}>{job.label}</StatusBadge></CardDescription>
  </CardHeader>
  <CardContent><Progress value={job.done} tone={job.tone} /></CardContent>
</Card>`}</Code>
      </Section>

      <Section title="태그를 바꾼다 — render">
        <Note>
          `render` 는 `ui/badge` 와 같은 방식이다. 링크 카드는 `&lt;a&gt;` 라 새 탭·키보드
          이동이 그대로 살고, 강조는 `className` 으로 얹는다(여기서는 그림자). 카드
          전체가 동작 버튼이면 `interactive` 를 켠다 — hover 강조와 포커스 링이 붙으므로
          같은 강조를 화면에서 다시 적지 않는다. 탭 키로 옮겨 다녀 보면 보인다.
        </Note>
        <div className="grid gap-2 sm:grid-cols-2">
          {LINKS.map((l) => (
            <Card
              key={l.href}
              size="sm"
              className="transition hover:shadow-md"
              render={<a href={l.href} />}
            >
              <CardHeader>
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
          {JOBS.slice(0, 2).map((j) => (
            <Card
              key={j.id}
              size="sm"
              interactive
              render={<button type="button" onClick={() => setPicked(j.id)} />}
            >
              <CardHeader>
                <CardTitle>{j.name}</CardTitle>
                <CardDescription>
                  {picked === j.id ? "고른 항목" : "눌러서 고른다"}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Code>{`<Card size="sm" className="transition hover:shadow-md"
      render={<a href={\`/jobs/\${job.id}\`} />}>…</Card>

<Card size="sm" interactive                     {/* hover 강조 + 포커스 링 */}
      render={<button type="button" onClick={() => pick(job.id)} />}>…</Card>`}</Code>
      </Section>

      <Section title="헤더 없이 본문만 — pt 를 되살린다">
        <Note>
          본문의 위 여백은 0 이다 — 헤더가 그 자리를 갖기 때문이다. 헤더를 빼면 글이
          테두리에 붙으므로 호출부가 `pt` 를 되살린다. 왼쪽이 되살리지 않은 것, 오른쪽이
          `pt-3` 을 준 것이다.
        </Note>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <div className="text-muted-foreground mb-1 text-xs">
              그대로 — 위가 붙는다
            </div>
            <Card size="sm">
              <CardContent>수집 대상이 아직 없습니다.</CardContent>
            </Card>
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-xs">pt-3 — 되살린 것</div>
            <Card size="sm">
              <CardContent className="pt-3">수집 대상이 아직 없습니다.</CardContent>
            </Card>
          </div>
        </div>
        <Code>{`<Card size="sm">
  <CardContent className="pt-3">수집 대상이 아직 없습니다.</CardContent>
</Card>`}</Code>
      </Section>
    </div>
  );
}