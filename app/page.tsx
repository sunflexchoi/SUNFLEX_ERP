"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, ArrowRightLeft, AlertCircle, 
  Trash2, Plus, Minus, CheckCircle2, MapPin, Package, X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Vercel 환경변수 연결
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SunflexAdvancedERP() {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]); 
  const [txType, setTxType] = useState('SALE'); 
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    if (txType === 'TRANSFER' && selectedSource === selectedDest) return alert("출발지와 목적지가 같습니다.");
    
    if (!confirm(`총 ${cart.length}개 품목을 [${txType}] 처리하시겠습니까?`)) return;

    setIsLoading(true);
    try {
      for (const p of cart) {
        // 1. 차감 로직
        if (['SALE', 'TRANSFER', 'DAMAGE'].includes(txType)) {
          const { data: s } = await supabase.from('store_stocks').select('quantity').eq('product_no', p.product_no).eq('store_name', selectedSource).single();
          await supabase.from('store_stocks').update({ quantity: Number(s.quantity || 0) - p.qty }).eq('product_no', p.product_no).eq('store_name', selectedSource);
        }
        // 2. 증액 로직
        if (['TRANSFER', 'RETURN_CUSTOMER'].includes(txType)) {
          const { data: s } = await supabase.from('store_stocks').select('quantity').eq('product_no', p.product_no).eq('store_name', selectedDest).single();
          await supabase.from('store_stocks').update({ quantity: Number(s.quantity || 0) + p.qty }).eq('product_no', p.product_no).eq('store_name', selectedDest);
        }
        // 3. 로그 남기기
        await supabase.from('inventory_logs').insert({
          product_no: p.product_no,
          from_store: selectedSource || null,
          to_store: selectedDest || null,
          change_qty: p.qty,
          reason: txType,
          created_by: 'CEO_ADMIN'
        });
      }
      alert("일괄 처리가 완료되었습니다.");
      setCart([]);
      fetchInitialData();
    } catch (e) {
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredItems = items.filter(i => 
    i.product_no.includes(search) || i.item_name_kr.includes(search)
  );

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      {/* 제품 선택 영역 */}
      <section className="flex-1 flex flex-col p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold italic serif tracking-tighter">SUNFLEX ADVANCED ERP</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              className="w-full bg-white border-none shadow-sm rounded-2xl py-3 pl-10 text-sm focus:ring-2 focus:ring-zinc-900" 
              placeholder="제품명, 번호 검색..." 
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => addToCart(item)} className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-95 group">
              <div className="aspect-square mb-4 bg-zinc-50 rounded-2xl overflow-hidden">
                <img src={item.main_image_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">{item.product_no}</p>
              <h3 className="text-xs font-bold truncate">{item.item_name_kr}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 처리 대기 목록 (장바구니) */}
      <aside className="w-[450px] bg-white border-l border-zinc-200 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-zinc-100 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart /> 트랜잭션 설정</h2>
          
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'SALE', label: '판매 (-)', color: 'bg-zinc-900' },
              { id: 'TRANSFER', label: '매장간 이동 (⇄)', color: 'bg-blue-600' },
              { id: 'RETURN_CUSTOMER', label: '고객 반품 (+)', color: 'bg-emerald-600' },
              { id: 'DAMAGE', label: '파손/폐기 (-)', color: 'bg-red-600' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setTxType(t.id)}
                className={`py-3 rounded-xl text-[11px] font-bold transition-all ${txType === t.id ? t.color + ' text-white shadow-lg scale-105' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">출발지 (From)</label>
              <select className="w-full mt-1 bg-zinc-50 border-zinc-200 rounded-xl text-sm" onChange={(e) => setSelectedSource(e.target.value)}>
                <option value="">선택...</option>
                {stores.map(s => <option key={s.id} value={s.store_name}>{s.store_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase">목적지 (To)</label>
              <select className="w-full mt-1 bg-zinc-50 border-zinc-200 rounded-xl text-sm" onChange={(e) => setSelectedDest(e.target.value)}>
                <option value="">선택...</option>
                {stores.map(s => <option key={s.id} value={s.store_name}>{s.store_name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-zinc-300 gap-2"><Package size={48}/><p className="text-sm">처리할 품목을 선택하세요</p></div>}
          {cart.map(p => (
            <div key={p.product_no} className="flex gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100 relative group">
              <img src={p.main_image_url} className="w-16 h-16 object-contain bg-white rounded-xl shadow-sm" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-zinc-800 pr-6">{p.item_name_kr}</h4>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-white border border-zinc-200 rounded-lg overflow-hidden">
                    <button className="p-1 hover:bg-zinc-100" onClick={() => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: Math.max(0.1, c.qty - 1)} : c))}><Minus size={14}/></button>
                    <input type="number" className="w-14 text-center text-xs font-bold border-none bg-transparent p-1" value={p.qty} onChange={(e) => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: Number(e.target.value)} : c))} />
                    <button className="p-1 hover:bg-zinc-100" onClick={() => setCart(cart.map(c => c.product_no === p.product_no ? {...c, qty: c.qty + 1} : c))}><Plus size={14}/></button>
                  </div>
                </div>
              </div>
              <button onClick={() => setCart(cart.filter(c => c.product_no !== p.product_no))} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500"><X size={16}/></button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-200">
          <button 
            disabled={isLoading}
            onClick={handleBulkSubmit}
            className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl transition-all ${isLoading ? 'bg-zinc-300 cursor-not-allowed' : 'bg-zinc-900 text-white hover:bg-black active:scale-95'}`}
          >
            {isLoading ? "처리 중..." : <><CheckCircle2 size={20}/> 일괄 승인 및 로그 기록</>}
          </button>
        </div>
      </aside>
    </div>
  );
}
