// src/features/inventory/StaffApp.tsx
import React, { useState, useEffect } from 'react';
import { Search, Package, Image as ImageIcon, MapPin, Info } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 1. Supabase 연결 (대표님의 정보를 여기에 넣게 됩니다)
const supabase = createClient('PROJECT_URL', 'ANON_KEY');

export default function StaffApp() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // 데이터 불러오기
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    const { data } = await supabase
      .from('inventory')
      .select(`*, store_stocks(store_name, quantity)`)
      .order('item_name_kr', { ascending: true });
    setItems(data || []);
  }

  // 검색 필터링
  const filteredItems = items.filter(item => 
    item.item_name_kr.includes(search) || 
    item.product_no.includes(search) ||
    item.collection_en?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* 상단 헤더 & 검색바 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 py-4">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            placeholder="제품번호 또는 상품명 검색..."
            className="w-full bg-zinc-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* 상품 리스트 구역 */}
      <main className="p-4 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 active:scale-[0.98] transition-transform cursor-pointer"
          >
            {/* 상품 이미지 */}
            <div className="aspect-square bg-zinc-100 relative">
              <img src={item.main_image_url} alt={item.item_name_kr} className="object-cover w-full h-full" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                {item.collection_en}
              </div>
            </div>
            
            {/* 상품 간략 정보 */}
            <div className="p-4">
              <p className="text-[10px] text-zinc-400 uppercase tracking-tighter mb-1">{item.product_no}</p>
              <h3 className="font-medium text-zinc-800 leading-tight mb-3">{item.item_name_kr}</h3>
              
              {/* 지점별 재고 요약 (칩 형태) */}
              <div className="flex flex-wrap gap-2">
                {item.store_stocks?.map(stock => (
                  <div key={stock.store_name} className="flex items-center gap-1 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100">
                    <span className="text-[9px] text-zinc-500">{stock.store_name}</span>
                    <span className={`text-[10px] font-bold ${stock.quantity > 0 ? 'text-blue-600' : 'text-zinc-300'}`}>
                      {stock.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* [룩북 모달] 상품 클릭 시 나타나는 상세 화면 */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={() => setSelectedItem(null)}
            className="fixed top-6 right-6 z-[60] bg-zinc-900 text-white p-2 rounded-full shadow-xl"
          >
            닫기
          </button>

          {/* 룩북 이미지 갤러리 */}
          <section className="bg-zinc-100 min-h-[60vh] flex items-center justify-center p-6">
            <img src={selectedItem.main_image_url} className="max-h-[50vh] object-contain drop-shadow-2xl" />
          </section>

          <section className="max-w-2xl mx-auto p-8 space-y-10">
            {/* 제품 타이틀 */}
            <div>
              <p className="text-zinc-400 tracking-[0.3em] uppercase text-xs mb-2">{selectedItem.collection_en}</p>
              <h2 className="text-3xl font-light italic serif text-zinc-900 mb-2">{selectedItem.item_name_en}</h2>
              <h3 className="text-xl text-zinc-600">{selectedItem.item_name_kr}</h3>
            </div>

            {/* 상세 스펙 그리드 */}
            <div className="grid grid-cols-2 gap-y-8 border-t border-zinc-100 pt-8">
              <div><p className="text-xs text-zinc-400 mb-1">Artist</p><p className="text-sm">{selectedItem.artist_name}</p></div>
              <div><p className="text-xs text-zinc-400 mb-1">Origin</p><p className="text-sm">{selectedItem.origin}</p></div>
              <div><p className="text-xs text-zinc-400 mb-1">Dimensions</p><p className="text-sm">{selectedItem.height}H x {selectedItem.diameter}D</p></div>
              <div><p className="text-xs text-zinc-400 mb-1">Price</p><p className="text-sm font-bold italic">₩{selectedItem.retail_price?.toLocaleString()}</p></div>
            </div>

            {/* 판매 포인트/메모 */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
              <div className="flex items-center gap-2 mb-3 text-zinc-800">
                <Info className="w-4 h-4" />
                <span className="text-sm font-semibold">Sales Point</span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed italic">
                "{selectedItem.memo || "최고급 크리스탈의 투명함과 아티스트의 철학이 담긴 작품입니다."}"
              </p>
            </div>

            {/* 실시간 지점 재고 현황 */}
            <div className="pb-20">
              <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> 지점별 실시간 재고
              </h4>
              <div className="space-y-3">
                {selectedItem.store_stocks?.map(stock => (
                  <div key={stock.store_name} className="flex justify-between items-center p-4 bg-white border border-zinc-200 rounded-xl">
                    <span className="text-sm">{stock.store_name}</span>
                    <span className={`font-mono font-bold ${stock.quantity > 0 ? 'text-blue-600' : 'text-zinc-400'}`}>
                      {stock.quantity > 0 ? `${stock.quantity} pcs` : '품절'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
