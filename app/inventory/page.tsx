"use client";

import { useState } from "react";
// 상대 경로를 사용하여 빌드 안정성을 확보합니다.
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-V01", name_ko: "럭셔리 다이아몬드 볼", collection_en: "Royal Heritage", stock_qty: 15, price: 2450000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" },
    { id: 2, serial_no: "SNF-V02", name_ko: "프리즘 오로라 플라워 베이스", collection_en: "Modern Line", stock_qty: 8, price: 1250000, image_url: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=600" }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b pb-8">
        <div>
          <span className="text-blue-600 font-bold tracking-[0.4em] text-[10px] uppercase opacity-80">Inventory Master</span>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mt-1 uppercase italic">Stock</h1>
        </div>

        {/* 대중소 전환 버튼 (사이드바와 어울리는 세련된 디자인) */}
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm font-sans">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-8 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${
                viewMode === mode 
                ? "bg-slate-900 text-white shadow-xl scale-105" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {mode === "large" ? "Lookbook" : mode === "medium" ? "List" : "Grid"}
            </button>
          ))}
        </div>
      </div>

      <div className="transition-all duration-500">
        {viewMode === "large" && <ViewLarge data={dummyData} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
        {viewMode === "small" && <ViewSmall data={dummyData} />}
      </div>
    </div>
  );
}
