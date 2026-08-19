"use client";

import { useState } from "react";
// 상위 폴더로 두 번 이동(../../)해서 components를 찾습니다.
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { id: 1, serial_no: "SNF-V2-001", name_ko: "럭셔리 다이아몬드 볼", stock_qty: 12, price: 2500000, image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" }
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b pb-6">
        <h1 className="text-4xl font-black tracking-tighter italic">SUNFLEX INVENTORY</h1>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode("large")} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'large' ? 'bg-black text-white' : 'text-slate-400'}`}>LOOKBOOK</button>
          <button onClick={() => setViewMode("medium")} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'medium' ? 'bg-black text-white' : 'text-slate-400'}`}>LIST</button>
          <button onClick={() => setViewMode("small")} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'small' ? 'bg-black text-white' : 'text-slate-400'}`}>GRID</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto font-sans">
        {viewMode === "large" && <ViewLarge data={dummyData} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
        {viewMode === "small" && <ViewSmall data={dummyData} />}
      </div>
    </div>
  );
}
