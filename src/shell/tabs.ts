import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";

export interface Tab {
  id: string;          // 고유 키 (path 기반: "/at/jobs", "/test/1")
  path: string;        // nav path
  label: string;       // 탭 표시 라벨
  serviceUrl?: string | null; // 해당 탭의 백엔드 service URL
  // 서버 탭용 (path="/worktree" 일 때)
  serverId?: string;
  serverName?: string;
  wsUrl?: string;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

// persist 는 opt-in 이다 — 기본 storage 가 메모리라 아무것도 저장·복원되지 않고,
// 앱이 LayoutApp 의 tabsPersistKey 로 키를 줄 때만 enableTabsPersist 가 localStorage 로
// 갈아끼운다. 기본을 localStorage 로 두면 기존 소비자의 동작이 조용히 바뀐다.
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

// 탭별 API는 ServerProvider + createScopedApi 로 각 탭 콘텐츠에 직접 주입된다.
// 전역 백엔드 URL(로그인 서버)을 탭 전환에 따라 바꿔서는 안 된다.
// 되돌려서 setCurrentPageServiceUrl 같은 전역 훅을 다시 심지 말 것.
export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (tab) => {
        const { tabs } = get();
        const exists = tabs.find((t) => t.id === tab.id);
        if (!exists) {
          set({ tabs: [...tabs, tab], activeTabId: tab.id });
        } else {
          set({ activeTabId: tab.id });
        }
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get();
        const next = tabs.filter((t) => t.id !== id);
        let nextActive = activeTabId;
        if (activeTabId === id) {
          const idx = tabs.findIndex((t) => t.id === id);
          nextActive = next[Math.min(idx, next.length - 1)]?.id ?? null;
        }
        set({ tabs: next, activeTabId: nextActive });
      },

      setActiveTab: (id) => {
        set({ activeTabId: id });
      },
    }),
    {
      name: "kit-shell-tabs",
      storage: createJSONStorage(() => noopStorage),
      skipHydration: true,
      partialize: (s) => ({ tabs: s.tabs, activeTabId: s.activeTabId }),
    },
  ),
);

/**
 * 탭 목록을 localStorage 에 저장·복원하도록 켠다. 복원까지 끝나면 resolve.
 * LayoutApp 이 tabsPersistKey 를 받으면 부팅 시 호출하므로 앱이 직접 부를 일은 없다.
 */
export async function enableTabsPersist(key: string): Promise<void> {
  useTabStore.persist.setOptions({
    name: key,
    storage: createJSONStorage(() => localStorage),
  });
  await useTabStore.persist.rehydrate();
}
