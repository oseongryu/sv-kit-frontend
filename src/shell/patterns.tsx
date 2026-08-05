"use client";

// 화면 레이아웃 패턴 — 화면은 셋 중 하나를 고르고, 자기 배치를 새로 짜지 않는다.
//
//   MasterDetail  목록에서 고르면 오른쪽에 상세
//   TabbedPage    가로 탭바 + 단일 본문. 탭이 적을 때(2~4개)
//   Workbench     위에서 설정하고 아래에서 결과를 본다
//
// 셋 다 `h-full` 을 채우고 **스크롤은 안쪽 영역이 각자 갖는다** — 탭 셸이 높이를
// 주기 때문이다(LayoutApp). 화면은 `h-full flex flex-col` 로 시작한다.
//
// 머리줄은 `LayoutContentHeader` 다 — 탭 셸의 화면 머리줄과 같은 규격이고,
// `onToggleSidebar` 를 주면 전역 네비 헤더에 목록 토글 버튼이 뜬다. MasterDetail 은
// 자기 SplitLayout 을 알고 있으므로 그 배선을 **자동으로** 한다(화면이 ref 를 들고
// 다닐 일이 없다).
//
// **화면 제목·설명은 두지 않는다.** 화면 이름은 탭이 이미 말하고 있고, 설명은 처음
// 한 번 읽고 나면 세로 공간만 먹는다. 머리줄에는 그 화면의 **동작**만 남는다.

import { useCallback, useRef, type ReactNode } from "react";

import { SplitLayout, type SplitLayoutHandle } from "../ui/split-layout";
import { TabBar } from "../ui/tab-bar";
import { LayoutContentHeader } from "./LayoutContentHeader";

export interface PatternBaseProps {
  /** 그 화면의 동작(새로 만들기·새로고침 등). 없으면 머리줄 자체가 없다 */
  actions?: ReactNode;
  /** 머리줄 왼쪽에 놓이는 것 — 동작이 아닌 문구(건수·대상 표시 등) */
  leading?: ReactNode;
  /** 경고·오류 한 줄 */
  notice?: ReactNode;
}

function Frame({
  actions,
  leading,
  notice,
  onToggleSidebar,
  children,
}: PatternBaseProps & { onToggleSidebar?: () => void; children: ReactNode }) {
  const hasHeader = Boolean(actions || leading || onToggleSidebar);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {hasHeader ? (
        <LayoutContentHeader onToggleSidebar={onToggleSidebar}>
          {leading ? (
            <LayoutContentHeader.Main>{leading}</LayoutContentHeader.Main>
          ) : null}
          {actions ? (
            <LayoutContentHeader.Right>{actions}</LayoutContentHeader.Right>
          ) : null}
        </LayoutContentHeader>
      ) : null}
      {notice ? <div className="shrink-0 px-4 pt-3">{notice}</div> : null}
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

/** 목록 → 상세. 폭은 드래그로 바꾸고 화면별로 기억한다. */
export function MasterDetail({
  storageKey,
  listTitle = "목록",
  listSize = 34,
  list,
  detail,
  ...base
}: PatternBaseProps & {
  storageKey: string;
  listTitle?: string;
  listSize?: number;
  list: ReactNode;
  detail: ReactNode;
}) {
  const layoutRef = useRef<SplitLayoutHandle | null>(null);
  const toggleSidebar = useCallback(() => layoutRef.current?.toggle(), []);

  return (
    <Frame {...base} onToggleSidebar={toggleSidebar}>
      <SplitLayout
        storageKey={storageKey}
        defaultSize={listSize}
        leftTitle={listTitle}
        layoutRef={layoutRef}
      >
        {list}
        {detail}
      </SplitLayout>
    </Frame>
  );
}

export interface PageTab<K extends string = string> {
  key: K;
  label: string;
}

/**
 * 가로 탭 + 단일 본문. 탭이 적을 때(2~4개) 쓴다.
 *
 * 머리줄이 탭바 그 자체다 — 위에 `LayoutContentHeader` 를 한 줄 더 얹지 않는다.
 * 두 줄이 되면 본문이 그만큼 좁아지는데, 이 패턴에는 목록 토글처럼 헤더가 꼭
 * 가져야 하는 것이 없다. 동작은 탭바 오른쪽에 붙는다.
 */
export function TabbedPage<K extends string>({
  tabs,
  value,
  onChange,
  actions,
  leading,
  notice,
  fill,
  children,
}: PatternBaseProps & {
  tabs: readonly PageTab<K>[];
  value: K;
  onChange: (key: K) => void;
  /** 본문이 스스로 높이를 채운다(안에서 또 좌/우로 나누는 탭). 기본은 문서 스크롤 */
  fill?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <TabBar
          tabs={tabs.map((t) => ({ id: t.key, label: t.label }))}
          activeId={value}
          onSelect={(id) => onChange(id as K)}
          leading={
            leading ? (
              <span className="text-muted-foreground text-xs">{leading}</span>
            ) : undefined
          }
          actions={actions}
        />
      </div>
      {notice ? <div className="shrink-0 px-4 pt-3">{notice}</div> : null}
      <div className={fill ? "min-h-0 flex-1" : "min-h-0 flex-1 overflow-auto p-4"}>
        {children}
      </div>
    </div>
  );
}

/** 문서 흐름으로 그리는 탭을 fill 모드 안에 넣을 때 감싸는 스크롤 영역. */
export function ScrollArea({ children }: { children: ReactNode }) {
  return <div className="h-full overflow-auto p-4">{children}</div>;
}

/** 위에서 설정하고 아래에서 결과를 본다. 순서가 곧 작업 순서인 화면. */
export function Workbench({
  setup,
  result,
  ...base
}: PatternBaseProps & { setup: ReactNode; result: ReactNode }) {
  return (
    <Frame {...base}>
      <div className="h-full overflow-auto">
        <div className="space-y-4 p-4">{setup}</div>
        <div className="border-border bg-muted/30 space-y-4 border-t p-4">{result}</div>
      </div>
    </Frame>
  );
}