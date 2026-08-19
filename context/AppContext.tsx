"use client";
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isCEO, setIsCEO] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <AppContext.Provider value={{ isCEO, setIsCEO, isCollapsed, setIsCollapsed }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
