"use client";

// 팝업 세 종류 — 버튼을 눌러 실제로 열어 본다.
//
//   FormModal   값을 넣고 저장한다      기본 md, 바닥은 [취소][저장]
//   ViewModal   내용을 본다             기본 lg, 로딩·오류 자동, 바닥은 [닫기]
//   useConfirm  물어보고 끝낸다         네이티브 confirm() 대신
//
// `CommonModal` 을 직접 부르지 않는다 — 크기·바닥 버튼 줄·로딩 분기가 이 셋에 이미 있다.

import { useState } from "react";
import { Button } from "@sv/kit-ui/ui/button";
import { CheckField, FormField } from "@sv/kit-ui/ui/form-field";
import { Input } from "@sv/kit-ui/ui/input";
import type { ModalSize } from "@sv/kit-ui/ui/modal";
import { DescList, FormModal, Section, ViewModal } from "@sv/kit-ui/ui/modal";
import { Select } from "@sv/kit-ui/ui/select";
import { useConfirm } from "@sv/kit-ui/ui/use-confirm";

import { Code, Note } from "./bits";

/** ViewModal 이 갈라 주는 세 경우 */
type ViewCase = "ok" | "loading" | "error";

const SIZES: ModalSize[] = ["sm", "md", "lg", "xl", "2xl", "3xl"];

export function ModalSection() {
  const [form, setForm] = useState(false);
  const [size, setSize] = useState<ModalSize>("md");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("샘플");
  const [active, setActive] = useState(true);

  const [view, setView] = useState<ViewCase | null>(null);
  const [answer, setAnswer] = useState("아직 묻지 않았습니다.");
  const { confirm, dialog } = useConfirm();

  return (
    <div className="space-y-4 text-[13px]">
      <Section title="팝업은 세 종류뿐이다">
        <DescList
          items={[
            ["FormModal", "값을 넣고 저장한다 — 기본 md, 바닥은 [취소][저장]"],
            ["ViewModal", "내용을 본다 — 기본 lg, 로딩·오류 자동, 바닥은 [닫기]"],
            ["useConfirm", "물어보고 끝낸다 — 네이티브 confirm() 대신"],
          ]}
        />
        <Note>
          바닥 버튼 줄은 껍데기가 그린다. 호출부가 `flex justify-end gap-2` 를 다시 적지
          않으므로 팝업마다 여백이 달라지지 않는다.
        </Note>
      </Section>

      <Section title="FormModal — 크기와 저장 중 잠금">
        <Note>
          크기를 바꿔 가며 열어 본다. [저장] 을 누르면 0.8초 동안 `busy` 가 되어 두 버튼이
          잠기고 문구가 `저장 중…` 으로 바뀐다(그 사이 바깥 클릭·ESC 로도 닫히지 않는다).
        </Note>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">size</span>
          <Select
            className="h-8 w-auto"
            value={size}
            onChange={(e) => setSize(e.target.value as ModalSize)}
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Button size="sm" onClick={() => setForm(true)}>
            FormModal 열기
          </Button>
        </div>
        <Code>{`<FormModal open={open} onClose={close} title="새 항목"
           size="lg"          // 기본 md. 안에 목록·표가 들어가면 lg
           busy={saving}      // 두 버튼 잠금 + "저장 중…" + 닫기 방지
           onSubmit={() => void save()}>
  <div className="grid grid-cols-2 gap-3">
    <FormField label="이름"><Input value={name} onChange={onName} /></FormField>
    <CheckField label="사용" checked={active} onChange={setActive} />
  </div>
</FormModal>`}</Code>
      </Section>

      <Section title="ViewModal — 로딩 · 오류 · 정상">
        <Note>
          `loading`·`error` 를 넘기면 본문 자리에서 알아서 갈린다(오류 → 로딩 → 내용).
          호출부가 팝업 밖에서 따로 분기하지 않는다 — 세 버튼으로 같은 팝업의 세 얼굴을
          비교해 본다.
        </Note>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setView("ok")}>
            정상
          </Button>
          <Button size="sm" variant="outline" onClick={() => setView("loading")}>
            로딩
          </Button>
          <Button size="sm" variant="outline" onClick={() => setView("error")}>
            오류
          </Button>
        </div>
        <Code>{`<ViewModal open={!!id} onClose={close} title="수집 원문"
           loading={d.loading} error={d.error}
           actions={<Button size="sm" variant="outline">내려받기</Button>}>
  <Section>
    <DescList items={[["채널", d.source], ["발행일", d.at]]} />
  </Section>
  <Section title="본문">…</Section>
</ViewModal>`}</Code>
      </Section>

      <Section title="useConfirm — 기다리거나 맡기거나">
        <Note>
          두 방식 다 된다. `await confirm(…)` 은 결과를 받아 이어서 쓰고, `run` 은 확인
          시 실행할 일을 맡긴다. 렌더 끝에 `{"{dialog}"}` 한 줄이 있어야 창이 뜬다.
        </Note>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              const ok = await confirm({
                title: "본보기 삭제",
                message: "정말 지울까요? 전시장이라 아무 일도 하지 않습니다.",
                confirmLabel: "삭제",
              });
              setAnswer(ok ? "확인을 눌렀습니다." : "취소했습니다.");
            }}
          >
            기다리기(await)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void confirm({
                title: "되돌리기",
                message: "직전 상태로 되돌릴까요?",
                confirmLabel: "되돌리기",
                variant: "default",
                run: () => setAnswer("run 이 실행됐습니다."),
              })
            }
          >
            맡기기(run)
          </Button>
          <span className="text-muted-foreground text-xs">{answer}</span>
        </div>
        <Code>{`const { confirm, dialog } = useConfirm();

// 기다리기
if (!(await confirm({ title: "삭제", message: "지울까요?" }))) return;

// 맡기기
confirm({ title: "되돌리기", message: "되돌릴까요?", run: () => undo() });

return (<>…{dialog}</>);   // 렌더 끝에 한 줄`}</Code>
      </Section>

      {/* ── 실제로 열리는 팝업들 ─────────────────────────────── */}

      <FormModal
        open={form}
        onClose={() => setForm(false)}
        title="본보기 — 새 항목"
        size={size}
        busy={busy}
        onSubmit={() => {
          setBusy(true);
          window.setTimeout(() => {
            setBusy(false);
            setForm(false);
          }, 800);
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField label="이름">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="채널">
            <Select defaultValue="blog">
              <option value="blog">블로그</option>
              <option value="video">동영상</option>
            </Select>
          </FormField>
          <CheckField label="사용" checked={active} onChange={setActive} />
        </div>
        <Note>
          폼 안에서 `h-8`·`w-full` 을 적지 않는다 — FormField 가 높이·폭을 맞춘다.
        </Note>
      </FormModal>

      <ViewModal
        open={view !== null}
        onClose={() => setView(null)}
        title="본보기 — 내용 보기"
        loading={view === "loading"}
        error={view === "error" ? "서버가 응답하지 않습니다(504)" : null}
        actions={
          <Button size="sm" variant="outline">
            내려받기
          </Button>
        }
      >
        <Section>
          <div className="font-semibold">제목이 여기 온다</div>
          <DescList
            items={[
              ["채널", "블로그"],
              ["키워드", "샘플"],
              ["발행일", "2026-08-03"],
              ["작성자", null],
            ]}
          />
        </Section>
        <Section title="본문">
          <pre className="max-h-[40vh] overflow-auto text-[13px] whitespace-pre-wrap">
            내용이 길면 이 상자 안에서만 스크롤한다. 팝업 전체가 늘어나지 않는다.
          </pre>
        </Section>
      </ViewModal>

      {dialog}
    </div>
  );
}