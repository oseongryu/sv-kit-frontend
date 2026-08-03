"use client";

// @sv/kit-ui 운영 화면 프리미티브 전시장 — 이 앱은 기능이 없다.
// **어떻게 생겼고 어떻게 쓰는지**를 보여 주는 자리다. 백엔드 없이 뜨고, 데이터는
// 각 절 파일 안 상수다. 마음에 드는 조각을 눈으로 고른 뒤 옆의 코드를 그대로 가져간다.

import { useState } from "react";
import { Button } from "@sv/kit-ui/ui/button";

import { ModalSection } from "./sections/modal-section";
import { PanelSection } from "./sections/panel-section";
import { PartsSection } from "./sections/parts-section";

type TabKey = "modal" | "panel" | "parts";

const TABS: { key: TabKey; label: string }[] = [
  { key: "modal", label: "팝업" },
  { key: "panel", label: "패널 뼈대" },
  { key: "parts", label: "조각" },
];

export default function Page() {
  const [tab, setTab] = useState<TabKey>("modal");
  const [dark, setDark] = useState(false);

  // 토큰이 라이트/다크 두 벌인지 눈으로 확인하는 스위치 — shadcn 관례대로 `.dark` 클래스다
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-4 flex items-center gap-3">
        <h1 className="text-lg font-semibold">@sv/kit-ui 프리미티브 전시장</h1>
        <span className="flex-1" />
        <Button size="sm" variant="outline" onClick={toggleTheme}>
          {dark ? "라이트" : "다크"}
        </Button>
      </header>

      <nav className="border-border mb-4 flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              "-mb-px border-b-2 px-3 py-1.5 text-sm " +
              (tab === t.key
                ? "border-primary text-foreground"
                : "text-muted-foreground border-transparent")
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "modal" ? <ModalSection /> : null}
      {tab === "panel" ? <PanelSection /> : null}
      {tab === "parts" ? <PartsSection /> : null}
    </main>
  );
}