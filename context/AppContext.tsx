"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isCEO, setIsCEO] = useState(false); // CEO 모드 상태
  const [isCollapsed, setIsCollapsed] = useState(false); // 사이드바 축소 상태

  return (
    <AppContext.Provider value={{ isCEO, setIsCEO, isCollapsed, setIsCollapsed }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
