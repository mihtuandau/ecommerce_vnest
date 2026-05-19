import { create } from "zustand";

interface UIStore {
  isSidebarOpen: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarOpen: false,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
