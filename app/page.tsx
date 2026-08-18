"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Package, MapPin, X, ShoppingCart, 
  AlertTriangle, RotateCcw, History, LayoutGrid, List, Maximize2 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SunflexERP() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [userRole, setUserRole] = useState('STAFF'); // 실제 운영시에는 로그인 정보로 대체

  useEffect(() => { fetchInventory(); }, []);

  async function fetchInventory() {
    const { data } = await supabase
      .from('inventory')
      .select(`*, store_stocks(store_name, quantity)`)
      .order('product_no', { ascending: true });
    setItems(data || []);
  }

  // [핵심 로직] 재고 변동 처리 (판매, 파손, 조정 등)
  async function handleStockChange(productNo, storeName, delta, reason) {
    const actionText = delta < 0 ? '차감' : '추가';
    if (!window.confirm(`${storeName}에서 [${reason}] 사유로 재고 ${Math.abs(delta)}개를 ${actionText}하시겠습니까?`)) return;

    try {
      // 1. 현재 재고 조회
      const { data: currentStock } = await supabase
        .from('store_stocks')
        .select('quantity')
        .eq('product_no', productNo)
        .eq('store_name', storeName)
        .single();

      const newQty = Number(currentStock?.quantity || 0) + delta;

      if (newQty < 0) {
        alert('재고가 부족하여 처리할 수 없습니다.');
        return;
      }

      // 2. 재고 업데이트
      await supabase
        .from('store_stocks')
        .update({ quantity: newQty })
        .eq('product_no', productNo)
        .eq('store_name', storeName);

      // 3. 로그 기록 (장부에 흔적 남기기)
      await supabase
        .from('inventory_logs')
        .insert({
          product_no: productNo,
          store_name: storeName,
          change_qty: delta,
          reason: reason,
          created_by: userRole
        });

      alert('성공적으로 기록되었습니다.');
      fetchInventory(); // 화면 새로고침
      setSelectedItem(null);
    } catch (error) {
      console.error(error);
      alert('오류가 발생했습니다.');
    }
  }

  // 검색 필터
  const filteredItems = items.filter(item => 
    item.item_name_kr.includes(search) || 
    item.product_no.includes(search) ||
    item.collection_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pb-20">
      {/* 상단 툴바 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 p-4">
        <div className="max-w-5xl mx-auto flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="제품명, 번호 검색..." 
              className="w-full bg-zinc-100 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-xl">
             <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><LayoutGrid size={16}/></button>
             <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List size={16}/></button>
          </div>
        </div>
      </header>

      {/* 리스트 구역 */}
      <main className="max-w-5xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <div className="aspect-square bg-zinc-50 rounded-2xl mb-4 overflow-hidden">
              <img src={item.main_image_url} className="w-full h-full object-contain" />
            </div>
            <p className="text-[10px] text-zinc-400 font-mono mb-1">{item.product_no}</p>
            <h3 className="text-sm font-bold truncate mb-2">{item.item_name_kr}</h3>
            <div className="flex justify-between items-end">
               <span className="text-xs font-bold text-blue-600">
                {item.store_stocks?.reduce((acc, curr) => acc + Number(curr.quantity), 0)} PCS
               </span>
               <span className="text-[10px] text-zinc-300 italic">{item.collection_en}</span>
            </div>
          </div>
        ))}
      </main>

      {/* 상세 조작 화면 (모달) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-start">
              <button onClick={() => setSelectedItem(null)} className="p-3 bg-zinc-100 rounded-full"><X /></button>
              <div className="text-right">
                <p className="text-xs text-zinc-400 uppercase tracking-widest">{selectedItem.collection_en}</p>
                <h2 className="text-2xl font-light italic serif">{selectedItem.item_name_en}</h2>
              </div>
            </div>

            <div className="aspect-[4/3] bg-zinc-50 rounded-3xl overflow-hidden shadow-inner">
               <img src={selectedItem.main_image_url} className="w-full h-full object-contain p-8" />
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-b pb-4">{selectedItem.item_name_kr}</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {selectedItem.store_stocks?.map(stock => (
                  <div key={stock.store_name} className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 font-bold text-zinc-500"><MapPin size={16}/> {stock.store_name}</span>
                      <span className="text-3xl font-black text-zinc-900">{stock.quantity} <small className="text-xs font-normal">PCS</small></span>
                    </div>

                    {/* 조작 버튼 그룹 */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleStockChange(selectedItem.product_no, stock.store_name, -1, '판매')}
                        className="flex flex-col items-center justify-center gap-1 bg-zinc-900 text-white py-4 rounded-2xl active:bg-black"
                      >
                        <ShoppingCart size={18} />
                        <span className="text-[10px] font-bold">판매 (-1)</span>
                      </button>
                      <button 
                        onClick={() => handleStockChange(selectedItem.product_no, stock.store_name, -1, '파손/반품')}
                        className="flex flex-col items-center justify-center gap-1 bg-white border border-zinc-200 text-red-500 py-4 rounded-2xl active:bg-zinc-100"
                      >
                        <AlertTriangle size={18} />
                        <span className="text-[10px] font-bold">파손/반품</span>
                      </button>
                      
                      {userRole === 'CEO' && (
                        <button 
                          onClick={() => handleStockChange(selectedItem.product_no, stock.store_name, 1, '입고/조정')}
                          className="col-span-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-4 rounded-2xl border border-blue-100 font-bold text-sm"
                        >
                          <RotateCcw size={16} /> 재고 강제 입고/조정 (+1)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 대표님 모드 전환 (테스트용) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur p-1 rounded-2xl shadow-2xl border border-zinc-200 z-50">
         <button onClick={() => setUserRole('STAFF')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${userRole === 'STAFF' ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}>직원 모드</button>
         <button onClick={() => setUserRole('CEO')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${userRole === 'CEO' ? 'bg-blue-600 text-white' : 'text-zinc-400'}`}>대표님 모드</button>
      </div>
    </div>
  );
}
