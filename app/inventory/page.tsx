"use client";

import { useState } from "react";
// 1. 부품(View)들을 가져옵니다.
import { ViewLarge } from "@/components/inventory/ViewLarge";
import { ViewMedium } from "@/components/inventory/ViewMedium";
import { ViewSmall } from "@/components/inventory/ViewSmall";
import { Button } from "@/components/ui/button"; 
import { LayoutGrid, List, AlignJustify } from "lucide-react"; 

export default function InventoryPage() {
  // 2. 현재 어떤 뷰인지 저장하는 상태 (기본값: 'medium')
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  // 3. 테스트용 데이터 (나중에 실제 DB 데이터로 바뀝니다)
  const dummyData = [
    {
      id: 1,
      serial_no: "SUN-001-2024",
      name_ko: "프리미엄 크리스탈 볼",
      collection_en: "Classic Line",
      stock_qty: 24,
      price: 1500000,
      image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=400&h=400&auto=format&fit=crop",
    },
    {
      id: 2,
      serial_no: "SUN-002-2024",
      name_ko: "오로라 베이스",
      collection_en: "Modern Shine",
      stock_qty: 8,
      price: 950000,
      image_url: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=400&h=400&auto=format&fit=crop",
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">재고 마스터</h1>
          <p className="text-slate-500">SUNFLEX Luxury Crystal ERP</p>
        </div>
        
        {/* 버튼 섹션: 여기서 viewMode를 변경합니다 */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <Button 
            variant={viewMode === "large" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("large")}
            className="rounded-lg"
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> 대
          </Button>
          <Button 
            variant={viewMode === "medium" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("medium")}
            className="rounded-lg"
          >
            <List className="w-4 h-4 mr-2" /> 중
          </Button>
          <Button 
            variant={viewMode === "small" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setViewMode("small")}
            className="rounded-lg"
          >
            <AlignJustify className="w-4 h-4 mr-2" /> 소
          </Button>
        </div>
      </div>

      {/* 핵심: 선택된 모드에 따라 다른 부품(View)을 보여줍니다 */}
      <div className="mt-8 transition-all duration-300">
        {viewMode === "large" && <ViewLarge data={dummyData} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} />}
        {viewMode === "small" && <ViewSmall data={dummyData} />}
      </div>
    </div>
  );
}
