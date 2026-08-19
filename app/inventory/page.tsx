"use client";

import { useState } from "react";
import { LayoutGrid, List, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      image_url: "https://images.unsplash.com/photo-1574920162043-b872873f19c8?q=80&w=600&h=600&auto=format&fit=crop",
    },
    {
      id: 2,
      serial_no: "SNF-2024-V02",
      name_ko: "프리즘 오로라 플라워 베이스",
      collection_en: "Aurora Line",
      stock_qty: 7,
      price: 1200000,
      image_url: "https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=600&h=600&auto=format&fit=crop",
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-blue-600 font-black tracking-[0.3em] text-xs uppercase">Sunflex Luxury ERP</span>
          <h1 className="text-4xl font-black tracking-tighter mt-1">재고 마스터 <span className="text-slate-300 font-light">v2.0</span></h1>
        </div>

        {/* VIEW TOGGLE BUTTONS */}
        <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
          <Button variant={viewMode === "large" ? "default" : "ghost"} onClick={() => setViewMode("large")} className="rounded-xl px-6">
            <LayoutGrid className="w-4 h-4 mr-2" /> 대 (룩북)
          </Button>
          <Button variant={viewMode === "medium" ? "default" : "ghost"} onClick={() => setViewMode("medium")} className="rounded-xl px-6">
            <List className="w-4 h-4 mr-2" /> 중 (리스트)
          </Button>
          <Button variant={viewMode === "small" ? "default" : "ghost"} onClick={() => setViewMode("small")} className="rounded-xl px-6">
            <AlignJustify className="w-4 h-4 mr-2" /> 소 (탐색기)
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* VIEW: LARGE (Lookbook Style) */}
        {viewMode === "large" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {dummyData.map((item) => (
              <div key={item.id} className="flex bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all h-[320px] group">
                <div className="w-[320px] h-full overflow-hidden border-r bg-slate-50">
                  <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-blue-600 font-bold text-xs tracking-widest">{item.serial_no}</span>
                    <h2 className="text-3xl font-black mt-2 leading-tight">{item.name_ko}</h2>
                    <p className="text-slate-400 italic mt-1 font-medium text-lg">{item.collection_en}</p>
                  </div>
                  <div className="flex justify-between items-end border-t pt-6">
                    <span className="text-emerald-600 font-black text-xl">{item.stock_qty} PCS</span>
                    <span className="text-3xl font-black tracking-tighter">₩{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: MEDIUM (Balanced List Style) */}
        {viewMode === "medium" && (
          <div className="space-y-4">
            {dummyData.map((item) => (
              <div key={item.id} className="flex items-center gap-8 bg-white p-4 rounded-[24px] border border-slate-200 hover:shadow-lg transition-all group">
                <img src={item.image_url} className="w-24 h-24 object-cover rounded-2xl shadow-inner group-hover:rotate-2 transition-transform" />
                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Serial</p><p className="font-bold text-blue-900">{item.serial_no}</p></div>
                  <div className="col-span-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Product</p><p className="font-bold text-slate-800">{item.name_ko}</p></div>
                  <div className="col-span-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Collection</p><p className="text-slate-400 italic text-sm">{item.collection_en}</p></div>
                  <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Stock</p><p className="font-black text-emerald-600 text-lg">{item.stock_qty}pcs</p></div>
                  <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Price</p><p className="text-2xl font-black tracking-tighter">₩{item.price.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: SMALL (Data Grid Style) */}
        {viewMode === "small" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-tighter">
                <tr>
                  <th className="p-4">제품번호</th>
                  <th className="p-4">한글 제품명</th>
                  <th className="p-4 font-light">Collection</th>
                  <th className="p-4 text-right">재고</th>
                  <th className="p-4 text-right">판매가</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dummyData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors">
                    <td className="p-4 font-bold text-blue-900 leading-none">{item.serial_no}</td>
                    <td className="p-4 font-bold text-slate-800 leading-none">{item.name_ko}</td>
                    <td className="p-4 text-slate-400 italic leading-none">{item.collection_en}</td>
                    <td className="p-4 text-right font-black text-emerald-600 leading-none">{item.stock_qty}</td>
                    <td className="p-4 text-right font-black text-slate-900 leading-none">₩{item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
