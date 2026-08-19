"use client";

import { useState } from "react";
// 우리가 미리 만들어둔 부품들을 불러옵니다.
import { ViewLarge } from "@/components/inventory/ViewLarge";
import { ViewMedium } from "@/components/inventory/ViewMedium";
import { ViewSmall } from "@/components/inventory/ViewSmall";
import { Button } from "@/components/ui/button"; 
import { LayoutGrid, List, AlignJustify } from "lucide-react"; 

export default function InventoryPage() {
  // 1. 현재 어떤 뷰인지 저장 (기본값: '중')
  const [viewMode, setViewMode] = useState<"large" | "medium" | "small">("medium");

  // 2. 테스트용 데이터
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

  const viewConfig = {
    visible_fields: ["serial_no", "name_ko", "collection_en", "stock_qty", "price"]
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">재고 마스터</h1>
          <p className="text-slate-500 text-sm">제품번호 기반 실시간 현황</p>
        </div>
        
        {/* 대/중/소 전환 버튼 */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm shrink-0">
          <Button variant={viewMode === "large" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("large")}>
            <LayoutGrid className="w-4 h-4 mr-2" /> 대
          </Button>
          <Button variant={viewMode === "medium" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("medium")}>
            <List className="w-4 h-4 mr-2" /> 중
          </Button>
          <Button variant={viewMode === "small" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("small")}>
            <AlignJustify className="w-4 h-4 mr-2" /> 소
          </Button>
        </div>
      </div>

      {/* 실제 뷰 렌더링 영역 */}
      <div className="mt-6">
        {viewMode === "large" && <ViewLarge data={dummyData} config={viewConfig} />}
        {viewMode === "medium" && <ViewMedium data={dummyData} config={viewConfig} />}
        {viewMode === "small" && <ViewSmall data={dummyData} config={viewConfig} />}
      </div>
    </div>
  );
}
