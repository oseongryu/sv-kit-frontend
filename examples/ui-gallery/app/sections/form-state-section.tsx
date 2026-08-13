"use client";

// 폼·패널의 오류 한 줄 — 표의 `TableState` 에 대응하는 폼 판.
//
//   FormError   방금 한 동작이 실패했다     서버 문구를 그대로 얹는다
//   FormState   그 영역을 못 불러왔다       안내를 앞에 붙인다(오류 → 로딩 → null)
//
// 둘 다 없으면 `null` 이라 호출부가 `{error && …}` 를 다시 적지 않는다.

import { useState } from "react";
import { Button } from "@sv/kit-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@sv/kit-ui/ui/card";
import { FormField } from "@sv/kit-ui/ui/form-field";
import { FormError, FormState } from "@sv/kit-ui/ui/form-state";
import { Input } from "@sv/kit-ui/ui/input";
import { Section } from "@sv/kit-ui/ui/modal";

import { Code, Note } from "./bits";

/** 줄바꿈이 든 서버 문구 — 한 줄로 뭉개지지 않는 것이 계약이다 */
const MULTILINE =
  "저장하지 못했습니다(422).\n· 이름은 2자 이상이어야 합니다.\n· 채널을 하나 이상 고르세요.";

/** FormError 가 갈라 주는 세 경우 — 값이 비면 아무것도 그리지 않는다 */
const ERRORS: { key: string; error: string | null }[] = [
  { key: "없음(null)", error: null },
  { key: "한 줄", error: "이미 쓰고 있는 이름입니다." },
  { key: "여러 줄", error: MULTILINE },
];

/** FormState 가 갈라 주는 세 경우 — 우선순위는 오류 → 로딩 → null */
const STATES: { key: string; props: { loading?: boolean; error?: string | null } }[] = [
  { key: "오류", props: { error: "네트워크 끊김" } },
  { key: "로딩", props: { loading: true } },
  { key: "둘 다 null", props: {} },
];

export function FormStateSection() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  // 저장을 눌러 본 뒤에만 오류를 낸다 — 열자마자 붉은 줄이 뜨지 않게
  const [tried, setTried] = useState(false);
  const nameError = tried && name.trim().length < 2 ? "이름은 2자 이상이어야 합니다." : null;

  return (
    <div className="space-y-4 text-[13px]">
      <Section title="FormError — 방금 한 동작이 실패했다">
        <Note>
          값이 비면 `null` 이라 호출부는 조건 없이 그냥 얹는다. 줄바꿈이 든 긴 서버 문구도
          그대로 받는다(`whitespace-pre-wrap`·`break-words`) — 한 줄로 뭉개지거나 폼 폭을
          뚫지 않는다. 왼쪽 칸은 아무것도 그리지 않은 것이다.
        </Note>
        <div className="grid gap-3 sm:grid-cols-3">
          {ERRORS.map((e) => (
            <div key={e.key}>
              <div className="text-muted-foreground mb-1 text-xs">{e.key}</div>
              <FormError error={e.error} />
            </div>
          ))}
        </div>
        <Code>{`<FormError error={error} />          {/* 비면 null — 조건 없이 얹는다 */}`}</Code>
      </Section>

      <Section title="폼에 붙인 자리 — 칸 아래 · 바닥">
        <Note>
          한 칸의 잘못은 그 칸 아래에, 저장 자체가 실패한 것은 버튼 줄 옆에 붙인다. 두
          글자 미만으로 [저장] 을 눌러 본다 — 고치면 문구가 사라진다.
        </Note>
        <div className="max-w-[420px] space-y-2">
          <FormField label="이름">
            <Input
              value={name}
              placeholder="두 글자 이상"
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormError error={nameError} />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setTried(true);
                setSaved(name.trim().length < 2 ? null : name.trim());
              }}
            >
              저장
            </Button>
            <FormError error={!!nameError && "저장하지 못했습니다."} />
            {saved ? (
              <span className="text-muted-foreground text-xs">저장됨 — {saved}</span>
            ) : null}
          </div>
        </div>
        <Code>{`<FormField label="이름"><Input value={name} onChange={onName} /></FormField>
<FormError error={nameError} />

<div className="flex items-center gap-2">
  <Button size="sm" onClick={save}>저장</Button>
  <FormError error={saveError} />        {/* false 도 받는다 — a && b 를 그대로 */}
</div>`}</Code>
      </Section>

      <Section title="FormState — 그 영역을 못 불러왔다">
        <Note>
          오류 → 로딩 → `null` 순으로 갈린다(`TableState` 와 같은 축). 카드·패널 본문에
          얹으면 그 덩어리만 상태를 말하고, 둘 다 없으면 자리를 차지하지 않는다 —
          오른쪽 카드가 그것이다.
        </Note>
        <div className="grid gap-2 sm:grid-cols-3">
          {STATES.map((s) => (
            <Card key={s.key} size="sm">
              <CardHeader>
                <CardTitle>{s.key}</CardTitle>
              </CardHeader>
              <CardContent>
                <FormState {...s.props} />
              </CardContent>
            </Card>
          ))}
        </div>
        <Code>{`<CardContent>
  <FormState loading={d.loading} error={d.error} />
  {d.data ? <DescList items={…} /> : null}
</CardContent>`}</Code>
      </Section>

      <Section title="errorPrefix — 무엇이 실패했는지 앞에 붙인다">
        <Note>
          기본 문구(`불러오지 못했습니다 — `·`불러오는 중…`)는 계약이라 바꾸지 않는다.
          한 화면에 영역이 여럿이라 어느 쪽이 실패했는지 말해야 할 때만 덮는다. 서버 문구만
          두면 무엇이 실패했는지 안 보인다 — 왼쪽이 기본, 오른쪽이 덮은 것이다.
        </Note>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="text-muted-foreground mb-1 text-xs">기본</div>
            <FormState error="504 Gateway Timeout" />
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-xs">덮은 것</div>
            <FormState
              error="504 Gateway Timeout"
              errorPrefix="계정 목록을 불러오지 못했습니다 — "
            />
          </div>
        </div>
        <Code>{`<FormState loading={d.loading} error={d.error}
           errorPrefix="계정 목록을 불러오지 못했습니다 — " />`}</Code>
      </Section>
    </div>
  );
}