// SSE 스트림 훅. 연결 시 data 갱신, 끊기면 connected=false(호출측에서 폴링 폴백)
import { useEffect, useState } from "react";

export function useEventStream<T>(url: string): { data: T | null; connected: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!url || typeof window === "undefined" || typeof EventSource === "undefined") return;
    let es: EventSource | null = null;
    try {
      es = new EventSource(url);
      es.onopen = () => setConnected(true);
      es.onmessage = (e) => {
        try {
          setData(JSON.parse(e.data));
        } catch {}
      };
      es.onerror = () => setConnected(false);
    } catch {
      setConnected(false);
    }
    return () => {
      if (es) es.close();
    };
  }, [url]);
  return { data, connected };
}
