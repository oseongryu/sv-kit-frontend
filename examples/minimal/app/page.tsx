"use client";
// kit-ui 단독 소비 예제 — api 래퍼(ok/err 규약)와 훅만으로 svkit 백엔드를 호출한다.
// 백엔드는 sv-kit-backend/examples/minimal 을 띄워두면 된다 (기본 localhost:5000).
import { useState } from "react";
import { get, API_BASE, ApiError } from "@sv/kit-ui/api";
import { useDebounce } from "@sv/kit-ui/hooks";

type Health = { ok: boolean; data: { status: string; domains: string[] } };
type Items = { ok: boolean; data: { id: number; name: string }[] };

export default function Page() {
  const [out, setOut] = useState("버튼을 눌러 호출");
  const [filter, setFilter] = useState("");
  const debounced = useDebounce(filter, 300);

  async function call(path: string) {
    try {
      const r = await get<Health | Items>(path);
      setOut(JSON.stringify(r.data, null, 2));
    } catch (e) {
      setOut(e instanceof ApiError ? `오류 ${e.status}: ${e.message}` : String(e));
    }
  }

  return (
    <main>
      <h1>@sv/kit-ui 최소 예제</h1>
      <p>
        API_BASE: <code>{API_BASE}</code> (env <code>NEXT_PUBLIC_API_BASE</code> 로 변경)
      </p>
      <p>
        <button onClick={() => call("/api/health")}>/api/health</button>{" "}
        <button onClick={() => call("/api/hello/items")}>/api/hello/items</button>
      </p>
      <p>
        <input
          placeholder="useDebounce 데모 (300ms)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />{" "}
        → <code>{debounced}</code>
      </p>
      <pre style={{ background: "#f5f5f5", padding: 12 }}>{out}</pre>
    </main>
  );
}
