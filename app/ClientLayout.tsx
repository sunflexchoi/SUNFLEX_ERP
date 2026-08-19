"use client";
import React from "react";
import { useApp } from "../context/AppContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isCEO, setIsCEO, isCollapsed, setIsCollapsed, systemConfig } = useApp();

  return (
    <div className="flex min-h-screen font-sans">
      <aside className={`${isCollapsed ? "w-20" : "w-72"} bg-[#0a0a0b] text-white transition-all duration-300 flex flex-col sticky top-0 h-screen z-50 border-r border-white/5`}>
        <div className="p-6 flex justify-between items-center border-b border-white/5 h-20">
          {!isCollapsed && <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Sunflex</h2>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-colors">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {systemConfig.menu.filter((m: any) => m.active).map((item: any) => (
            <div key={item.id} className="space-y-2">
              <a href={item.path} className={`flex items-center gap-4 p-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${item.id === 'inv' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                <span className="text-lg">{item.icon}</span> {!isCollapsed && item.label}
              </a>
              {/* [복구] 사이드바 장바구니 리스트 */}
              {item.hasCart && !isCollapsed && (
                <div className="ml-4 p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Cart (2)</span>
                    <button className="text-[10px] font-black text-white px-2 py-1 bg-blue-600 rounded-md">Send</button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <div className="text-[9px] flex justify-between group">
                      <span className="text-slate-300 font-bold">● Diamond Bowl</span>
                      <span className="text-white font-black tracking-tighter">5pcs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CEO 스위치 */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} bg-white/5 p-2 rounded-2xl border border-white/5 shadow-inner`}>
            {!isCollapsed && <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isCEO ? "CEO" : "STAFF"}</span>}
            <button onClick={() => setIsCEO(!isCEO)} className={`w-10 h-5 rounded-full relative transition-all ${isCEO ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-slate-700"}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCEO ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-[#fcfcfd] overflow-x-hidden">{children}</main>
    </div>
  );
}
