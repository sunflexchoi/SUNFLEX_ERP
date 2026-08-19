"use client";
import React from "react";
import { useApp } from "../context/AppContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isCEO, setIsCEO, isCollapsed, setIsCollapsed } = useApp();

  return (
    <div className="flex min-h-screen font-sans">
      <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-slate-950 text-white transition-all duration-300 flex flex-col sticky top-0 h-screen z-50`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-900">
          {!isCollapsed && <h2 className="text-xl font-black italic tracking-tighter uppercase">Sunflex</h2>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 uppercase font-bold text-[11px] tracking-widest">
          <a href="/inventory" className="flex items-center gap-4 p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
             <span>📦</span> {!isCollapsed && "Inventory"}
          </a>
        </nav>
        <div className="p-4 border-t border-slate-900">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} bg-slate-900 p-2 rounded-2xl border border-slate-800`}>
            {!isCollapsed && <span className="text-[10px] font-black text-slate-500">{isCEO ? "CEO" : "STAFF"}</span>}
            <button onClick={() => setIsCEO(!isCEO)} className={`w-10 h-5 rounded-full relative transition-all ${isCEO ? "bg-emerald-500" : "bg-slate-700"}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCEO ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-[#f8fafc] overflow-x-hidden">{children}</main>
    </div>
  );
}
