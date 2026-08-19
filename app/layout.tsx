"use client";
import { AppProvider, useApp } from "../context/AppContext";
import "./globals.css";

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCEO, setIsCEO, isCollapsed, setIsCollapsed } = useApp();

  return (
    <div className="flex min-h-screen font-sans" style={{ fontFamily: "'Geist Sans', sans-serif" }}>
      {/* --- 사이드바 --- */}
      <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-slate-950 text-white transition-all duration-300 flex flex-col sticky top-0 h-screen overflow-hidden`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-900">
          {!isCollapsed && <h2 className="text-xl font-black italic tracking-tighter uppercase">Sunflex</h2>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hover:bg-slate-800 p-2 rounded-lg text-slate-400">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <a href="/inventory" className="flex items-center gap-4 p-3 bg-blue-600 rounded-xl font-bold text-sm">
             <span>📦</span> {!isCollapsed && "재고 마스터"}
          </a>
          <div className="opacity-30 flex items-center gap-4 p-3 text-sm font-bold cursor-not-allowed">
             <span>📊</span> {!isCollapsed && "매출 관리"}
          </div>
        </nav>

        {/* --- CEO / STAFF 스위치 (하단 고정) --- */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800`}>
            {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isCEO ? "CEO Mode" : "Staff"}</span>}
            <button 
              onClick={() => setIsCEO(!isCEO)}
              className={`w-10 h-5 rounded-full transition-all relative ${isCEO ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCEO ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- 메인 콘텐츠 --- */}
      <main className="flex-1 bg-[#f8fafc] overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css" />
      </head>
      <body>
        <AppProvider>
          <RootLayoutContent>{children}</AppProvider>
        </AppProvider>
      </body>
    </html>
  );
}
