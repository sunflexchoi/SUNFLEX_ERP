"use client";
import { useState } from "react";
import { useApp } from "../../context/AppContext"; // CEO 상태를 가져옵니다.
import { ViewLarge } from "../../components/inventory/ViewLarge";
import { ViewMedium } from "../../components/inventory/ViewMedium";
import { ViewSmall } from "../../components/inventory/ViewSmall";

export default function InventoryPage() {
  const { isCEO } = useApp(); // 현재 CEO 모드인가?
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  const dummyData = [
    { 
      id: 1, 
      serial_no: "SNF-V01", 
      name_ko: "다이아몬드 크리스탈 볼", 
      stock_qty: 15, 
      price: 2450000, 
      cost_price: 1100000, // CEO만 봐야 하는 원가
      image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600" 
    }
  ];

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Inventory</h1>
          {/* CEO 모드일 때만 나타나는 안내창 */}
          {isCEO && <span className="text-emerald-600 text-[10px] font-bold tracking-widest animate-pulse italic">● CEO 권한: 민감 정보(원가) 노출 중</span>}
        </div>

        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          {(["large", "medium", "small"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-8 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                viewMode === mode ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* 뷰 컴포넌트에 isCEO 상태를 전달합니다 */}
      {viewMode === "large" && <ViewLarge data={dummyData} isCEO={isCEO} />}
      {viewMode === "medium" && <ViewMedium data={dummyData} isCEO={isCEO} />}
      {viewMode === "small" && <ViewSmall data={dummyData} isCEO={isCEO} />}
    </div>
  );
}
