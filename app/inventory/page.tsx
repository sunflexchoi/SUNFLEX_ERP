"use client";
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const { isCEO } = useApp();
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-V01", name_ko: "다이아몬드 크리스탈 볼", stock_qty: 15, price: 2450000, cost_price: 1200000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" }
  ];

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Inventory</h1>
          {isCEO && <p className="text-emerald-600 text-[10px] font-bold animate-pulse uppercase tracking-widest mt-2">● CEO MODE ACTIVE</p>}
        </div>
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm font-sans">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === mode ? "bg-slate-950 text-white shadow-lg" : "text-slate-400"}`}>
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="transition-all duration-500">
        {viewMode === "large" && <ViewLarge data={dummyData} isCEO={isCEO} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} isCEO={isCEO} />}
        {viewMode === "small" && <ViewSmall data={dummyData} isCEO={isCEO} />}
      </div>
    </div>
  );
}
