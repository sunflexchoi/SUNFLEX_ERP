"use client";

import { useState } from "react";
import { LayoutGrid, List, AlignJustify } from "lucide-react";

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
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-blue-600 font-bold tracking-[0.3em] text-[10px] uppercase">Sunflex Luxury ERP</span>
          <h1 className="text-4xl font-black tracking-tighter mt-1 text-slate-900">재고 마스터 <span className="text-slate-300 font-light">v2.0</span></h1>
        </div>

        {/* VIEW TOGGLE BUTTONS (HTML 기본 태그 사용) */}
        <div className="flex bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
          <button 
            onClick={() => setViewMode("large")}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "large" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> 대
          </button>
          <button 
            onClick={() => setViewMode("medium")}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "medium" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <List className="w-4 h-4 mr-2" /> 중
          </button>
          <button 
            onClick={() => setViewMode("small")}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === "small" ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <AlignJustify className="w-4 h-4 mr-2" /> 소
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* VIEW: LARGE */}
        {viewMode === "large" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {dummyData.map((item) => (
              <div key={item.id} className="flex bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-xl h-[300px] group">
                <div className="w-[300px] h-full overflow-hidden bg-slate-50 border-r">
                  <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-blue-600 font-bold text-[10px] tracking-widest">{item.serial_no}</span>
                    <h2 className="text-2xl font-black mt-2 leading-tight">{item.name_ko}</h2>
                    <p className="text-slate-400 italic mt-1 font-medium text-base">{item.collection_en}</p>
                  </div>
                  <div className="flex justify-between items-end border-t pt-4">
                    <span className="text-emerald-600 font-black text-lg">{item.stock_qty} PCS</span>
                    <span className="text-2xl font-black tracking-tighter">₩{item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: MEDIUM */}
        {viewMode === "medium" && (
          <div className="space-y-4">
            {dummyData.map((item) => (
              <div key={item.id} className="flex items-center gap-6 bg-white p-3 rounded-[24px] border border-slate-200 hover:shadow-lg transition-all">
                <img src={item.image_url} className="w-20 h-20 object-cover rounded-2xl" alt="" />
                <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                  <div><p className="text-[10px] font-bold text-slate-300">Serial</p><p className="font-bold text-blue-900 text-sm">{item.serial_no}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-300">Product</p><p className="font-bold text-slate-800 text-sm">{item.name_ko}</p></div>
                  <div className="text-right"><p className="text-[10px] font-bold text-slate-300">Stock</p><p className="font-black text-emerald-600 font-bold">{item.stock_qty}pcs</p></div>
                  <div className="text-right"><p className="text-[10px] font-bold text-slate-300">Price</p><p className="text-xl font-black tracking-tighter text-slate-900">₩{item.price.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW: SMALL */}
        {viewMode === "small" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="p-4">제품번호</th>
                  <th className="p-4">한글 제품명</th>
                  <th className="p-4 text-right">재고</th>
                  <th className="p-4 text-right">판매가</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dummyData.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-bold text-blue-900">{item.serial_no}</td>
                    <td className="p-4 font-bold text-slate-800">{item.name_ko}</td>
                    <td className="p-4 text-right font-black text-emerald-600">{item.stock_qty}</td>
                    <td className="p-4 text-right font-black text-slate-900">₩{item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
