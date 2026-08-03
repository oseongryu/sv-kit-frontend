"use client";

// 좌/우 분할 화면 — 왼쪽은 목록, 오른쪽은 상세.
//
// 운영 화면 대부분이 "고르면 자세히 본다" 구조라 배치를 한 곳에 둔다. 폭은
// 드래그로 조절하고 화면별 키로 기억한다(localStorage) — 사람마다 목록을 넓게
// 쓰는 취향이 다르고, 화면을 옮길 때마다 다시 끌어야 하면 아무도 안 끈다.
//
// 좁은 화면에서는 왼쪽을 접고 서랍(`Sheet`)으로 연다. 나란히 두면 둘 다 못 쓸
// 만큼 좁아지기 때문이다.
//
// 소비 앱 두 곳이 각자 이 조립을 갖고 있었다. 한쪽은 이 파일 하나에 모아 뒀고,
// 다른 한쪽은 화면 7개에 복붙한 채 폭 저장이 없었다. 복붙 쪽이 이걸 채택하려면
// **머리줄 버튼으로 목록을 여닫는 길**이 있어야 해서 `layoutRef` 를 열어 뒀다 —
// 안 주면 예전(폭 조절만) 동작 그대로다.
//
// **브레이크포인트는 767px 로 통일한다.** 두 앱이 갈려 있었다 — 한쪽은
// 767px 을 훅에 두고, 다른 쪽은 공용 훅이 640px 인데 정작 화면들은 767px 을
// 인라인으로 적고 있었다. 실제로 쓰이던 값이 767px 이라 그쪽으로 맞추고,
// 다르게 잘라야 하는 화면은 `mobileBreakpoint` 로 연다.

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "./button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, usePanelRef } from "./resizable";
import { Sheet, SheetContent, SheetTitle } from "./sheet";
import { cn } from "./utils";

const LEFT_ID = "left";
const RIGHT_ID = "right";

/** 좁은 화면 판정 기본값(px) — 이 폭 **이하**면 서랍으로 바뀐다 */
const MOBILE_BREAKPOINT = 767;

/**
 * 바깥에서 목록을 여닫는 손잡이.
 *
 * 넓은 화면과 좁은 화면은 "목록을 닫는다"의 뜻이 다르다 — 앞은 패널 접기,
 * 뒤는 서랍 닫기다. 화면이 그 둘을 다시 가르지 않도록 `toggle()` 하나가
 * 지금 폭에 맞는 쪽을 고른다(복붙 앱이 화면마다 적던 matchMedia 분기가 이것이다).
 */
export interface SplitLayoutHandle {
  /** 지금 폭에 맞는 방식으로 목록을 여닫는다 */
  toggle: () => void;
  /** 목록을 편다(넓은 화면=패널 펼치기 / 좁은 화면=서랍 열기) */
  open: () => void;
  /** 목록을 닫는다(넓은 화면=패널 접기 / 좁은 화면=서랍 닫기) */
  close: () => void;
  /** 목록이 지금 닫혀 있는가 */
  isClosed: () => boolean;
}

export interface SplitLayoutProps {
  /** 폭 기억용 키 — 화면마다 다르게 준다 */
  storageKey: string;
  /** 왼쪽(목록) 기본 비율 % */
  defaultSize?: number;
  /** [왼쪽, 오른쪽] — 순서가 곧 배치다 */
  children: [ReactNode, ReactNode];
  /** 서랍 제목(좁은 화면에서만 보인다) */
  leftTitle?: string;
  /**
   * 바깥에서 여닫으려면 준다. **주면 왼쪽이 접히는 패널이 된다**
   * (안 주면 최소 폭에서 멈추는 종전 동작).
   * `usePanelRef` 처럼 이름 있는 props 로 받는다 — React 18/19 양쪽에서 같게 동작한다.
   */
  layoutRef?: Ref<SplitLayoutHandle | null>;
  /**
   * 좁은 화면 머리줄에 기본 [목록] 버튼을 그릴지. 화면이 자기 머리줄에 이미
   * 여닫기 버튼을 두고 있으면(복붙 앱이 그렇다) 꺼서 버튼이 둘 되는 걸 막는다.
   */
  showNarrowToggle?: boolean;
  /** 좁은 화면 판정 폭(px). 기본 767 */
  mobileBreakpoint?: number;
  /** 왼쪽 최소 비율 % */
  leftMinSize?: number;
  /** 오른쪽 최소 비율 % */
  rightMinSize?: number;
  /** 왼쪽 패널 껍데기 클래스(테두리·배경 등) */
  leftClassName?: string;
  /** 오른쪽 패널 껍데기 클래스 */
  rightClassName?: string;
  /** 분할 전체를 감싸는 클래스 — 감싸는 쪽이 `flex-1 min-h-0` 을 줘야 하는 화면이 있다 */
  className?: string;
  /**
   * 좁은 화면 서랍에서 **아무 데나 누르면 닫히게** 할지. 기본 true.
   * 목록 머리줄에 검색·필터·버튼이 있는 화면은 꺼라 — 그것들을 누를 때마다
   * 서랍이 닫혀 쓸 수 없다. 끈 화면은 `layoutRef.close()` 로 고른 순간에만 닫는다.
   */
  closeDrawerOnClick?: boolean;
  /** 좁은 화면 서랍 폭 등(기본 `w-[86vw] max-w-sm`) */
  drawerClassName?: string;
  /** 서랍의 X 버튼. 목록 자체에 닫기 수단이 있으면 끈다 */
  showDrawerClose?: boolean;
}

function useIsNarrow(breakpoint: number): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const sync = () => setNarrow(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [breakpoint]);
  return narrow;
}

/** 저장된 분할 비율 — 없으면 기본값. SSR 에서는 항상 기본값이다. */
function useSavedLayout(storageKey: string, defaultSize: number) {
  const key = `split:${storageKey}`;
  const [layout, setLayout] = useState<Record<string, number>>({
    [LEFT_ID]: defaultSize,
    [RIGHT_ID]: 100 - defaultSize,
  });

  useEffect(() => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return;
    const size = Number(raw);
    if (Number.isFinite(size) && size > 5 && size < 95) {
      setLayout({ [LEFT_ID]: size, [RIGHT_ID]: 100 - size });
    }
  }, [key]);

  const save = useCallback(
    (next: Record<string, number>) => {
      const size = next[LEFT_ID];
      // 접힌 상태(0)나 끝까지 민 값은 기억하지 않는다 — 다음에 열었을 때
      // 목록이 사라져 있으면 화면이 고장 난 것처럼 보인다
      if (Number.isFinite(size) && size > 5 && size < 95) {
        window.localStorage.setItem(key, String(Math.round(size)));
      }
    },
    [key],
  );

  return { layout, save };
}

export function SplitLayout({
  storageKey,
  defaultSize = 34,
  children,
  leftTitle = "목록",
  layoutRef,
  showNarrowToggle = true,
  mobileBreakpoint = MOBILE_BREAKPOINT,
  leftMinSize = 15,
  rightMinSize = 25,
  leftClassName,
  rightClassName,
  className,
  closeDrawerOnClick = true,
  drawerClassName,
  showDrawerClose = true,
}: SplitLayoutProps) {
  const [left, right] = children;
  const narrow = useIsNarrow(mobileBreakpoint);
  const [drawer, setDrawer] = useState(false);
  const { layout, save } = useSavedLayout(storageKey, defaultSize);
  const leftPanel = usePanelRef();

  // 접기는 손잡이를 받은 화면만 켠다 — 켜면 최소 폭 아래로 끌었을 때 패널이
  // 사라지므로, 그걸 되돌릴 버튼이 없는 화면에서는 켜면 안 된다
  const collapsible = layoutRef != null;

  useImperativeHandle(
    layoutRef,
    () => {
      const isClosed = () => (narrow ? !drawer : (leftPanel.current?.isCollapsed() ?? false));
      const open = () => (narrow ? setDrawer(true) : leftPanel.current?.expand());
      const close = () => (narrow ? setDrawer(false) : leftPanel.current?.collapse());
      return {
        isClosed,
        open,
        close,
        toggle: () => (isClosed() ? open() : close()),
      };
    },
    [narrow, drawer, leftPanel],
  );

  // 좁은 화면 — 오른쪽만 보여 주고 목록은 서랍으로
  if (narrow) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        {showNarrowToggle ? (
          <div className="border-border shrink-0 border-b px-2 py-1.5">
            <Button variant="ghost" size="sm" onClick={() => setDrawer(true)}>
              <PanelLeft className="mr-1 size-4" />
              {leftTitle}
            </Button>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-auto">{right}</div>
        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetContent
            side="left"
            className={cn("overflow-auto p-0", drawerClassName ?? "w-[86vw] max-w-sm")}
            showCloseButton={showDrawerClose}
          >
            <SheetTitle className="sr-only">{leftTitle}</SheetTitle>
            {/* 고르면 서랍은 닫힌다 — 좁은 화면에서 목록이 상세를 계속 가리면
                고른 보람이 없다. 다만 목록 머리줄에 검색·필터·버튼이 있는 화면은
                그것들까지 서랍을 닫아 버려 쓸 수 없다 — 그런 화면은 이걸 끄고
                `layoutRef.close()` 로 고른 순간에만 닫는다 */}
            {closeDrawerOnClick ? (
              <div onClick={() => setDrawer(false)}>{left}</div>
            ) : (
              left
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={className}
      defaultLayout={layout}
      // 인자는 하나만 받는다 — `react-resizable-panels` 4.7 대의 시그니처다.
      // 4.12 대는 두 번째로 `meta.isUserInteraction` 을 주지만 그걸 쓰면 선언
      // 의존성(^4.7.3)에서 컴파일이 깨진다. "사람이 끈 것만 기억한다"는
      // `save()` 가 0·100 을 거르는 것으로 이미 지켜진다.
      onLayoutChanged={(next) => save(next)}
    >
      <ResizablePanel
        id={LEFT_ID}
        panelRef={leftPanel}
        minSize={String(leftMinSize)}
        collapsible={collapsible}
        collapsedSize={collapsible ? 0 : undefined}
        className={cn("min-w-0", leftClassName)}
      >
        <div className="h-full overflow-auto">{left}</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        id={RIGHT_ID}
        minSize={String(rightMinSize)}
        className={cn("min-w-0", rightClassName)}
      >
        <div className="h-full overflow-auto">{right}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

/** 분할 패널 안쪽 여백 — 좌·우가 같은 리듬을 갖게 한다. */
export function Pane({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}