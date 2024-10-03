"use client";

import { create } from "zustand";

type sideBarWidthState = {
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
};

export const useSidebarWidth = create<sideBarWidthState>((set) => ({
    sidebarWidth: 40, 
    setSidebarWidth: width => set({ sidebarWidth: width }),
}));