"use client";

import { useState } from "react";
// [Import 부분] 여기는 ../../ 가 맞습니다 (두 번 위로)
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-INV-001", name_ko: "인벤토리 제품", stock_qty: 24, price: 1200000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" }
  ];

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-3xl font-black tracking-tighter italic uppercase">Inventory Master</h1>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner text-[10px] font-bold">
          <button onClick={() => setViewMode("large")} className={`px-5 py-2 rounded-lg transition-all ${viewMode === 'large' ? 'bg-black text-white shadow-md' : 'text-slate-400'}`}>LOOKBOOK</button>
          <button onClick={() => setViewMode("medium")} className={`px-5 py-2 rounded-lg transition-all ${viewMode === 'medium' ? 'bg-black text-white shadow-md' : 'text-slate-400'}`}>LIST</button>
          <button onClick={() => setViewMode("small")} className={`px-5 py-2 rounded-lg transition-all ${viewMode === 'small' ? 'bg-black text-white shadow-md' : 'text-slate-400'}`}>GRID</button>
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
