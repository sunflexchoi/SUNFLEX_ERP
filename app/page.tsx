"use client";

import { useState } from "react";
// [Import 부분] 주소를 ../ 로 수정했습니다 (한 번만 위로)
import { ViewLarge } from "../components/inventory/ViewLarge";
import { ViewMedium } from "../components/inventory/ViewMedium";
import { ViewSmall } from "../components/inventory/ViewSmall";

export default function Home() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-MAIN-01", name_ko: "대표 메인 제품", stock_qty: 10, price: 5000000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 flex flex-col items-center justify-center font-sans text-center">
      <h1 className="text-5xl font-black tracking-tighter mb-4 italic">SUNFLEX MASTER</h1>
      <p className="text-slate-500 mb-10 tracking-[0.4em] uppercase text-[10px]">Luxury Crystal ERP System</p>
      
      <a href="/inventory" className="px-12 py-5 bg-white text-black font-black rounded-full hover:scale-110 transition-all shadow-2xl">
        시스템 입장
      </a>

      {/* 미리보기 영역 (에러 방지용) */}
      <div className="mt-20 w-full max-w-4xl opacity-20 pointer-events-none">
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
      </div>
    </div>
  );
}
