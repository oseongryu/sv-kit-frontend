"use client";

// 카드 — 테두리로 묶은 한 덩어리. 목록 항목(`sm`)과 화면 패널(`md`) 양쪽에 쓴다.
//
// `rounded border border-border bg-card` 를 화면마다 손으로 적으면 모서리·여백·
// 클릭 강조가 카드마다 갈린다(소비 앱 네 곳이 네 벌이었다). 모양은 여기서 한 벌로
// 두고 화면은 밀도(`size`)만 고른다. `panel`·`section` 과 겹치지 않는다 —
// `PanelHead` 는 머리줄만, `Section` 은 제목+테두리 한 겹, 카드는 헤더·본문·바닥이
// 있는 덩어리다.

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, type ComponentProps } from "react";

import { cn } from "./utils";

const cardVariants = cva(
  "group/card border-border bg-card text-card-foreground block border",
  {
    variants: {
      size: {
        sm: "rounded",
        md: "rounded-xl",
      },
      interactive: {
        true: "w-full cursor-pointer text-left outline-none transition hover:border-primary/50 hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      interactive: false,
    },
  },
);

export type CardSize = "sm" | "md";

// 밀도는 카드가 정하고 안의 조각들이 따른다 — 조각마다 size 를 받으면 호출부가
// 네 번 적어야 하고 한 곳만 빠뜨려도 여백이 어긋난다.
const SizeContext = createContext<CardSize>("md");

const PAD: Record<CardSize, { head: string; body: string }> = {
  sm: { head: "p-3 pb-1.5", body: "p-3 pt-0" },
  md: { head: "p-5 pb-3", body: "p-5 pt-0" },
};

/**
 * `render` 로 태그를 바꾼다(`<a>`·`<button>` 카드). 본문의 `pt` 는 0 이라
 * 헤더 없이 본문만 쓰는 카드는 `<CardContent className="pt-3">` 로 되살린다.
 */
function Card({
  className,
  size,
  interactive = false,
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  const resolved: CardSize = size ?? "md";
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(cardVariants({ size: resolved, interactive }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "card",
      size: resolved,
    },
  });
  return (
    <SizeContext.Provider value={resolved}>{element}</SizeContext.Provider>
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  const size = useContext(SizeContext);
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", PAD[size].head, className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  const size = useContext(SizeContext);
  return (
    <div
      data-slot="card-title"
      className={cn(
        size === "sm"
          ? "text-sm font-medium"
          : "leading-none font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  const size = useContext(SizeContext);
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  const size = useContext(SizeContext);
  return (
    <div
      data-slot="card-content"
      className={cn(PAD[size].body, className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  const size = useContext(SizeContext);
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2", PAD[size].body, className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
};
