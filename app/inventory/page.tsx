"use client";
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ViewLarge, ViewMedium, ViewSmall } from "../../components/inventory/Views";

export default function InventoryPage() {
  const { isCEO } = useApp();
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-V2-001", name_ko: "럭셔리 다이아몬드 볼", stock_qty: 12, price: 2500000, cost_price: 1100000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" }
  ];

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-slate-200 pb-10">
        <div>
          <span className="text-blue-600 font-black tracking-[0.4em] text-[10px] uppercase opacity-80 leading-none">Inventory Master</span>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mt-2 italic uppercase leading-none font-sans">Stock</h1>
          {isCEO && <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 animate-pulse italic">● CEO Authorization Mode</p>}
        </div>
        <div className="flex bg-white/50 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${viewMode === mode ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400 hover:text-slate-600"}`}>
              {mode}
            </button>
          ))}
        </div>
      </div>
      <div className="transition-all duration-300">
        {viewMode === "large" && <ViewLarge data={dummyData} isCEO={isCEO} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} isCEO={isCEO} />}
        {viewMode === "small" && <ViewSmall data={dummyData} isCEO={isCEO} />}
      </div>
    </div>
  );
}
