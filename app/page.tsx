"use client";

import { useState } from "react";
// 정석대로 분리된 컴포넌트들을 임포트합니다.
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic">SUNFLEX MASTER</h1>
          <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">Inventory System</p>
        </div>

        {/* 정석 버튼 그룹 (순수 Tailwind CSS) */}
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-6 py-2 rounded-lg text-sm font-black transition-all ${
                viewMode === mode ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {mode === "large" ? "대" : mode === "medium" ? "중" : "소"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {viewMode === "large" && <ViewLarge data={dummyData} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
        {viewMode === "small" && <ViewSmall data={dummyData} />}
      </div>
    </div>
  );
}
