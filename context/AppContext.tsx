"use client";
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isCEO, setIsCEO] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // [핵심] 이 데이터가 DB에서 불러온 '설정값'입니다.
  const [systemConfig, setSystemConfig] = useState({
    appearance: {
      primaryColor: "#2563eb",
      fontFamily: "Geist Sans",
    },
    menu: [
      { id: 'inv', label: 'Inventory', icon: '📦', path: '/inventory', active: true },
      { id: 'trans', label: 'Transaction', icon: '🛒', path: '/inventory', active: true, hasCart: true },
      { id: 'set', label: 'System Settings', icon: '⚙️', path: '/settings', active: true },
    ],
    inventoryFields: [
      { key: 'serial_no', label: '제품번호', visible: true, order: 1 },
      { key: 'name_ko', label: '제품명', visible: true, order: 2 },
      { key: 'stock_qty', label: '재고수량', visible: true, order: 3 },
      { key: 'price', label: '판매가', visible: true, order: 4 },
      { key: 'cost_price', label: '원가', visible: true, order: 5, ceoOnly: true },
    ]
  });

  return (
    <AppContext.Provider value={{ isCEO, setIsCEO, isCollapsed, setIsCollapsed, systemConfig, setSystemConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
