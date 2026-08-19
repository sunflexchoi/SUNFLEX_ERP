import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUNFLEX ERP",
  description: "Luxury Crystal Inventory System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.0/dist/fonts/geist-sans/style.css" />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Geist Sans', sans-serif", margin: 0, backgroundColor: "#f8fafc" }}>
        {/* 전체를 감싸는 레이아웃 구조 */}
        <div className="flex min-h-screen">
          {/* 사이드바 영역 (이 부분에 기존 사이드바 컴포넌트가 들어갑니다) */}
          <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col sticky top-0 h-screen transition-all duration-300">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-black tracking-tighter italic">SUNFLEX</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <a href="/" className="block p-3 hover:bg-slate-800 rounded-xl text-sm font-bold transition-all">대시보드</a>
              <a href="/inventory" className="block p-3 bg-blue-600 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all font-sans">재고 마스터</a>
              <a href="#" className="block p-3 hover:bg-slate-800 rounded-xl text-sm font-bold opacity-40">매출 관리</a>
              <a href="#" className="block p-3 hover:bg-slate-800 rounded-xl text-sm font-bold opacity-40">매장 이동</a>
            </nav>
            <div className="p-6 border-t border-slate-800">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Mode</div>
            </div>
          </aside>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 flex flex-col overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
