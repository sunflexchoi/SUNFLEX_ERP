"use client";
import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ViewLarge, ViewMedium, ViewSmall } from "../../components/inventory/Views";

export default function InventoryPage() {
  const { isCEO, systemConfig } = useApp();
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  // 설정에서 활성화된 필드만 추출
  const activeFields = systemConfig.inventoryFields
    .filter((f: any) => f.visible && (!f.ceoOnly || isCEO))
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b pb-10 border-slate-200">
        <div>
          <span className="text-blue-600 font-black tracking-[0.4em] text-[10px] uppercase opacity-80 leading-none">Management</span>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mt-2 italic uppercase">Inventory</h1>
          {isCEO && <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3 animate-pulse italic text-slate-900">● CEO Authorized Mode</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* [핵심] 엑셀 대량 작업 버튼 */}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all leading-none">
            <span>📊</span> Excel Bulk Import
          </button>
          
          <div className="flex bg-white/50 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            {(["large", "medium", "small"] as const).map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${viewMode === mode ? "bg-slate-900 text-white shadow-xl scale-105" : "text-slate-400"}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="transition-all duration-300">
        {/* 설정된 필드 데이터(activeFields)를 뷰에 전달하여 하드코딩 제거 */}
        {viewMode === "large" && <ViewLarge data={[]} isCEO={isCEO} fields={activeFields} />}
        {viewMode === "medium" && <ViewMedium data={[]} isCEO={isCEO} fields={activeFields} />}
        {viewMode === "small" && <ViewSmall data={[]} isCEO={isCEO} fields={activeFields} />}
      </div>
    </div>
  );
}
