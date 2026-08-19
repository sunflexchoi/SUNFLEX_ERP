"use client";

import React, { useState } from "react";
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    {
      id: 1,
      serial_no: "SNF-V01",
      name_ko: "다이아몬드 크리스탈 볼",
      stock_qty: 15,
      price: 2450000,
      image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900">Inventory</h1>
        <div className="flex bg-white border p-1 rounded-xl shadow-sm">
          <button onClick={() => setViewMode("large")} className={`px-6 py-2 rounded-lg text-xs font-bold ${viewMode === "large" ? "bg-slate-900 text-white" : "text-slate-400"}`}>LOOKBOOK</button>
          <button onClick={() => setViewMode("medium")} className={`px-6 py-2 rounded-lg text-xs font-bold ${viewMode === "medium" ? "bg-slate-900 text-white" : "text-slate-400"}`}>LIST</button>
          <button onClick={() => setViewMode("small")} className={`px-6 py-2 rounded-lg text-xs font-bold ${viewMode === "small" ? "bg-slate-900 text-white" : "text-slate-400"}`}>GRID</button>
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
