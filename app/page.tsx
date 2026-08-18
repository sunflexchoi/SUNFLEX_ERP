"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, ArrowRightLeft, AlertCircle, 
  Trash2, Plus, Minus, CheckCircle2, MapPin, Package, X,
  LayoutGrid, CreditCard, Users, BarChart3, Settings, Menu, ChevronRight
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SunflexLuxuryERP() {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]); 
  const [txType, setTxType] = useState('SALE'); 
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // 모바일용 장바구니 열림 상태
  const [activeModule, setActiveModule] = useState('inventory');

  useEffect(() => { fetchInitialData(); }, []);

  async function fetchInitialData() {
    const { data: inv } = await supabase.from('inventory').select(`*, store_stocks(store_name, quantity)`);
    const { data: str } = await supabase.from('stores').select('*').eq('is_active', true);
    setItems(inv || []);
    setStores(str || []);
  }

  const addToCart = (product) => {
    const exists = cart.find(c => c.product_no === product.product_no);
    if (exists) {
      setCart(cart.map(c => c.product_no === product.product_no ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  async function handleBulkSubmit() {
    if (cart.length === 0) return alert("처리할 품목이 없습니다.");
    if (['SALE', 'TRANSFER', 'DAMAGE'].includes(txType) && !selectedSource) return alert("출발지 매장을 선택해주세요.");
    if (['TRANSFER', 'RETURN_CUSTOMER'].includes(txType) && !selectedDest) return alert("목적지 매장을 선택해주세요.");
    
    setIsLoading(true);
    try {
      for (const p of cart) {
        if (['SALE', 'TRANSFER', 'DAMAGE'].includes(txType)) {
          const { data: s } = await supabase.from('store_stocks').select('quantity').eq('product_no', p.product_no).eq('store_name', selectedSource).single();
          await supabase.from('store_stocks').update({ quantity: Number(s.quantity || 0) - p.qty }).eq('product_no', p.product_no).eq('store_name', selectedSource);
        }
        if (['TRANSFER', 'RETURN_CUSTOMER'].includes(txType)) {
          const { data: s } = await supabase.from('store_stocks').select('quantity').eq('product_no', p.product_no).eq('store_name', selectedDest).single();
          await supabase.from('store_stocks').update({ quantity: Number(s.quantity || 0) + p.qty }).eq('product_no', p.product_no).eq('store_name', selectedDest);
        }
        await supabase.from('inventory_logs').insert({
          product_no: p.product_no, from_store: selectedSource || null, to_store: selectedDest || null,
          change_qty: p.qty, reason: txType, created_by: 'CEO_ADMIN'
        });
      }
      alert("일괄 처리가 완료되었습니다.");
      setCart([]); setIsCartOpen(false); fetchInitialData();
    } catch (e) { alert("오류 발생"); } finally { setIsLoading(false); }
  }

  // [강화된 검색 로직] 모든 필드를 대조합니다.
  const filteredItems = items.filter(i => {
    const s = search.toLowerCase();
    return (
      i.item_name_kr?.toLowerCase().includes(s) ||
      i.item_name_en?.toLowerCase().includes(s) ||
      i.product_no?.toLowerCase().includes(s) ||
      i.category?.toLowerCase().includes(s) ||
      i.collection_en?.toLowerCase().includes(s) ||
      i.retail_price?.toString().includes(s) ||
      i.barcode_ean?.includes(s)
    );
  });

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      
      {/* 1. 좌측 통합 사이드바 (데스크톱 전용) */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden xl:flex flex-col sticky top-0 h-screen z-30">
        <div className="p-8 border-b border-zinc-100">
          <h1 className="text-xl font-bold tracking-tighter italic serif">SUNFLEX</h1>
          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest mt-1">Global Crystal ERP</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'inventory', name: '재고 관리', icon: Package },
            { id: 'finance', name: '재무/지출', icon: CreditCard, status: 'soon' },
            { id: 'hr', name: '인사/급여', icon: Users, status: 'soon' },
            { id: 'stats', name: '경영 통계', icon: BarChart3, status: 'soon' },
          ].map((m) => (
            <button key={m.id} onClick={() => m.status !== 'soon' && setActiveModule(m.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${activeModule === m.id ? 'bg-zinc-900 text-white shadow-xl scale-[1.02]' : 'text-zinc-500 hover:bg-zinc-100'}`}>
              <div className="flex items-center gap-3 text-sm font-semibold">
                <m.icon size={18} /> {m.name}
              </div>
              {m.status === 'soon' ? <span className="text-[8px] bg-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded">준비중</span> : <ChevronRight size={14} />}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-100"><button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-100 rounded-xl"><Settings size={18} /> 설정</button></div>
      </aside>

      {/* 2. 중앙 메인 영역 */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-20 p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input className="w-full bg-zinc-100 border-none rounded-2xl py-3.5 pl-12 text-sm focus:ring-2 focus:ring-zinc-900 transition-all shadow-inner" 
                placeholder="어떤 정보로든 검색하세요 (이름, 품번, 가격, 카테고리...)" onChange={(e) => setSearch(e.target.value)} />
            </div>
            {/* 모바일 장바구니 버튼 */}
            <button onClick={() => setIsCartOpen(true)} className="xl:hidden relative p-3.5 bg-zinc-900 text-white rounded-2xl shadow-lg">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">{cart.length}</span>}
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => addToCart(item)} className="bg-white p-3 md:p-4 rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all active:scale-95 group">
                <div className="aspect-square mb-3 bg-zinc-50 rounded-[1.5rem] overflow-hidden">
                  <img src={item.main_image_url} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="px-1">
                  <p className="text-[9px] text-zinc-400 font-mono mb-1">{item.product_no}</p>
                  <h3 className="text-[11px] md:text-xs font-bold truncate text-zinc-800">{item.item_name_kr}</h3>
                  <p className="text-[10px] text-zinc-400 italic truncate mb-2">{item.item_name_en}</p>
                  <p className="text-[11px] font-black text-blue-600 italic">₩{item.retail_price?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. 우측 트랜잭션 창 (PC 고정 / 모바일 팝업) */}
      <aside className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-white shadow-2xl transition-transform duration-500 ease-in-out border-l border-zinc-200 flex flex-col
        xl:relative xl:translate-x-0 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 md:p-8 border-b border-zinc-100 relative">
          <button onClick={() => setIsCartOpen(false)} className="xl:hidden absolute top-6 right-6 p-2 bg-zinc-100 rounded-full"><X size={20}/></button>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><ShoppingCart /> 트랜잭션 설정</h2>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { id: 'SALE', label: '판매 (-)', color: 'bg-zinc-900' },
              { id: 'TRANSFER', label: '매장간 이동 (⇄)', color: 'bg-blue-600' },
              { id: 'RETURN_CUSTOMER', label: '고객 반품 (+)', color: 'bg-emerald-600' },
              { id: 'DAMAGE', label: '파손/폐기 (-)', color: 'bg-red-600' }
            ].map(t => (
              <button key={t.id} onClick={() => setTxType(t.id)}
                className={`py-3 rounded-xl text-[11px] font-bold transition-all ${txType === t.id ? t.color + ' text-white shadow-lg' : 'bg-zinc-100 text-zinc-400'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 tracking-widest">From</label>
              <select className="w-full bg-zinc-50 border-zinc-200 rounded-xl text-xs py-3" onChange={(e) => setSelectedSource(e.target.value)}>
                <option value="">출발지 선택...</option>
                {stores.map(s => <option key={s.id} value={s.store_name}>{s.store_name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase ml-1 tracking-widest">To</label>
              <select className="w-full bg-zinc-50 border-zinc-200 rounded-xl text-xs py-3" onChange={(e) => setSelectedDest(e.target.value)}>
                <option value="">목적지 선택...</option>
                {stores.map(s => <option key={s.id} value={s.store_name}>{s.store_name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
          {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-4 opacity-50"><Package size={64}/><p className="text-sm font-medium italic">품목을 선택하세요</p></div>}
          {cart.map(p => (
            <div key={p.product_no} className="flex gap-4 bg-zinc-50 p-4 rounded-3xl border border-zinc-100 relative shadow-sm">
              <img src={p.main_image_url} className="w-16 h-16 object-contain bg-white rounded-2xl shadow-sm border border-zinc-100" />
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-bold text-zinc-800 truncate pr-6 mb-2">{p.item_name_kr}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white border border-zinc-200 rounded-xl overflow-hidden">
                    <button className="p-2 hover:bg-zinc-100" onClick={() => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: Math.max(0.1, c.qty - 1)} : c))}><Minus size={14}/></button>
                    <input type="number" className="w-12 text-center text-xs font-bold border-none bg-transparent p-0" value={p.qty} onChange={(e) => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: Number(e.target.value)} : c))} />
                    <button className="p-2 hover:bg-zinc-100" onClick={() => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: c.qty + 1} : c))}><Plus size={14}/></button>
                  </div>
                  <span className="text-[10px] font-black text-zinc-400">₩{(p.retail_price * p.qty).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => setCart(cart.filter(c => c.product_no !== p.product_no))} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><X size={16}/></button>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-zinc-50 border-t border-zinc-200">
          <button disabled={isLoading} onClick={handleBulkSubmit}
            className={`w-full py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${isLoading ? 'bg-zinc-300' : 'bg-zinc-900 text-white hover:shadow-2xl active:scale-95'}`}>
            {isLoading ? "데이터 동기화 중..." : <><CheckCircle2 size={20}/> 트랜잭션 일괄 승인</>}
          </button>
        </div>
      </aside>

      {/* 모바일 하단 플로팅 요약 바 */}
      {cart.length > 0 && !isCartOpen && (
        <div className="xl:hidden fixed bottom-6 left-6 right-6 bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center z-40 animate-in slide-in-from-bottom duration-500" onClick={() => setIsCartOpen(true)}>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg"><ShoppingCart size={18}/></div>
            <div>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Selected Items</p>
              <p className="text-sm font-bold">{cart.length}개 품목 대기 중</p>
            </div>
          </div>
          <ChevronRight size={20} className="opacity-50" />
        </div>
      )}
    </div>
  );
}
