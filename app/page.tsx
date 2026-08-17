"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Package, LayoutGrid, List, Maximize2, 
  Menu, Settings, BarChart3, CreditCard, Users, 
  ChevronRight, Info, MapPin, X
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'tile' | 'list'
  const [activeModule, setActiveModule] = useState('inventory');

  useEffect(() => { fetchInventory(); }, []);

  async function fetchInventory() {
    const { data } = await supabase
      .from('inventory')
      .select(`*, store_stocks(store_name, quantity)`)
      .order('product_no', { ascending: true });
    setItems(data || []);
  }

  const filteredItems = items.filter(item => 
    item.item_name_kr.includes(search) || 
    item.product_no.includes(search) ||
    item.collection_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      
      {/* 1. 좌측 ERP 통합 사이드바 */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-zinc-100">
          <h1 className="text-xl font-bold tracking-tighter italic serif">SUNFLEX</h1>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">Management System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'inventory', name: '재고 관리', icon: Package },
            { id: 'finance', name: '재무/지출 (준비중)', icon: CreditCard },
            { id: 'hr', name: '인사/급여 (준비중)', icon: Users },
            { id: 'stats', name: '경영 대시보드', icon: BarChart3 },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                activeModule === m.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3 text-sm font-medium">
                <m.icon size={18} /> {m.name}
              </div>
              {activeModule === m.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-500 hover:bg-zinc-100 rounded-xl transition-all">
            <Settings size={18} /> 시스템 설정
          </button>
        </div>
      </aside>

      {/* 2. 메인 콘텐츠 구역 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 상단 툴바 */}
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-10 p-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="제품 검색 (번호, 이름, 컬렉션)..."
                className="w-full bg-zinc-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* 뷰 모드 전환 버튼들 */}
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              {[
                { id: 'grid', icon: LayoutGrid, label: '카드' },
                { id: 'tile', icon: Maximize2, label: '타일' },
                { id: 'list', icon: List, label: '목록' }
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === v.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <v.icon size={14} /> {v.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* 재고 리스트 영역 */}
        <section className="p-4 md:p-6 max-w-7xl mx-auto w-full flex-1">
          {viewMode === 'list' ? (
            /* [목록 뷰] 엑셀처럼 한눈에 보기 */
            <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">제품번호</th>
                    <th className="px-4 py-3">상품명</th>
                    <th className="px-4 py-3">판매가</th>
                    <th className="px-4 py-3 text-center bg-blue-50/50">본사</th>
                    <th className="px-4 py-3 text-center bg-blue-50/50">본점</th>
                    <th className="px-4 py-3 text-center bg-blue-50/50">잠실</th>
                    <th className="px-4 py-3">카테고리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredItems.map(item => (
                    <tr key={item.id} onClick={() => setSelectedItem(item)} className="hover:bg-zinc-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3 font-mono text-zinc-400">{item.product_no}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{item.item_name_kr}</td>
                      <td className="px-4 py-3 font-semibold text-zinc-600">₩{item.retail_price?.toLocaleString()}</td>
                      {['본사', '롯데본점', '롯데잠실'].map(store => {
                        const qty = item.store_stocks?.find(s => s.store_name === store)?.quantity || 0;
                        return (
                          <td key={store} className={`px-4 py-3 text-center font-bold ${qty > 0 ? 'text-blue-600' : 'text-zinc-200'}`}>
                            {qty}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-zinc-400">{item.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* [그리드/타일 뷰] */
            <div className={`grid gap-4 ${
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8'
            }`}>
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className={`bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
                >
                  <div className={`bg-zinc-100 relative overflow-hidden ${viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'}`}>
                    <img src={item.main_image_url} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {viewMode === 'grid' && (
                    <div className="p-4">
                      <p className="text-[9px] text-zinc-400 tracking-tighter mb-1 font-mono">{item.product_no}</p>
                      <h3 className="text-sm font-medium text-zinc-800 leading-tight truncate">{item.item_name_kr}</h3>
                      <div className="flex gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
                        {item.store_stocks?.map(stock => (
                          <div key={stock.store_name} className="flex-shrink-0 flex flex-col bg-zinc-50 px-2 py-1 rounded text-[8px] border border-zinc-100">
                            <span className="text-zinc-400">{stock.store_name.slice(0,2)}</span>
                            <span className={`font-bold ${stock.quantity > 0 ? 'text-blue-600' : 'text-zinc-300'}`}>{stock.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewMode === 'tile' && (
                    <div className="p-2 border-t border-zinc-50 bg-white/90 backdrop-blur">
                      <h3 className="text-[10px] font-medium truncate">{item.item_name_kr}</h3>
                      <p className="text-[10px] font-bold text-blue-600 mt-0.5">
                        {item.store_stocks?.reduce((acc, curr) => acc + curr.quantity, 0)} pcs
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* [룩북 모달 상세페이지 - 기존 코드 유지/강화] */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
            <button onClick={() => setSelectedItem(null)} className="sticky top-6 left-6 z-[60] bg-zinc-900 text-white p-3 rounded-full">
              <X size={20} />
            </button>
            <div className="p-10 space-y-12">
               <img src={selectedItem.main_image_url} className="w-full aspect-[4/5] object-contain bg-zinc-50 rounded-3xl" />
               <div>
                  <p className="text-zinc-400 tracking-[0.3em] uppercase text-xs mb-3">{selectedItem.collection_en}</p>
                  <h2 className="text-4xl font-light italic serif mb-4">{selectedItem.item_name_en}</h2>
                  <h3 className="text-2xl text-zinc-800">{selectedItem.item_name_kr}</h3>
               </div>
               <div className="grid grid-cols-2 gap-y-10 border-t border-zinc-100 pt-10">
                  <div><p className="text-xs text-zinc-400 mb-1">Artist</p><p className="text-base">{selectedItem.artist_name}</p></div>
                  <div><p className="text-xs text-zinc-400 mb-1">Retail Price</p><p className="text-base font-bold italic">₩{selectedItem.retail_price?.toLocaleString()}</p></div>
                  <div className="col-span-2 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><MapPin size={16}/> 실시간 지점 재고</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedItem.store_stocks?.map(stock => (
                        <div key={stock.store_name} className="text-center p-3 bg-white rounded-xl border border-zinc-200">
                          <p className="text-[10px] text-zinc-400 mb-1">{stock.store_name}</p>
                          <p className={`text-lg font-bold ${stock.quantity > 0 ? 'text-blue-600' : 'text-zinc-300'}`}>{stock.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
