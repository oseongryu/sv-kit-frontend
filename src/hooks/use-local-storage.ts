// localStorage 연동 상태 훅(필터/설정 등 화면 상태 유지)
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      try {
        setValue(JSON.parse(saved));
      } catch {}
    }
  }, [key]);
  const set = (v: T) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  };
  return [value, set];
}
