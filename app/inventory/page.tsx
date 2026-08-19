"use client";

import { useState } from "react";
import { ViewLarge } from "@/components/inventory/ViewLarge";
import { ViewMedium } from "@/components/inventory/ViewMedium";
import { ViewSmall } from "@/components/inventory/ViewSmall";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    {
      id: 1,
      serial_no: "SNF-2024-V01",
      name_ko: "럭셔리 다이아몬드 크리스탈 볼",
      collection_en: "Royal Collection",
      stock_qty: 15,
      price: 2450000,
      image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 2,
      serial_no: "SNF-2024-V02",
      name_ko: "프리즘 오로라 플라워 베이스",
      collection_en: "Aurora Line",
      stock_qty: 7,
      price: 1200000,
      image_url: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=400&h=400&auto=format&fit=crop",
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-1">
          <p className="text-blue-600 font-bold tracking-[0.4em] text-[10px] uppercase opacity-80">Sunflex Luxury Master</p>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900">Inventory</h1>
        </div>

        {/* 하이엔드 버튼 디자인 */}
        <div className="flex bg-white/50 backdrop-blur-md border border-slate-200 p-1 rounded-2xl shadow-sm">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
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

      <div className="max-w-7xl mx-auto overflow-hidden">
        {viewMode === "large" && <ViewLarge data={dummyData} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
        {viewMode === "small" && <ViewSmall data={dummyData} />}
      </div>
    </div>
  );
}
