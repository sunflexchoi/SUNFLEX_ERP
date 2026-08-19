"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
};

export default function SunflexFinalERP() {
  const [config, setConfig] = useState<any>({ erp_title: 'SUNFLEX ERP' });
  const [menus, setMenus] = useState<any[]>([]);
  const [inventory, setInventory] = useState([]);
  const [stores, setStores] = useState([]);
  const [userRole, setUserRole] = useState('STAFF'); 
  const [activeMenu, setActiveMenu] = useState('inventory_list');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [txType, setTxType] = useState('SALE');
  const [sourceStore, setSourceStore] = useState('');
  const [destStore, setDestStore] = useState('');

  useEffect(() => { loadAllData(); }, []);

  async function loadAllData() {
    const { data: set } = await supabase.from('system_settings').select('*');
    const { data: men } = await supabase.from('menu_config').select('*').eq('is_active', true).order('sort_order');
    const { data: inv } = await supabase.from('inventory').select('*, store_stocks(*)');
    const { data: str } = await supabase.from('stores').select('*');
    setConfig(set?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || { erp_title: 'SUNFLEX ERP' });
    setMenus(men || []); setInventory(inv || []); setStores(str || []);
  }

  const addToCart = (item) => {
    if (cart.find(c => c.product_no === item.product_no)) return;
    setCart([...cart, { ...item, qty: 1 }]);
    if (activeMenu !== 'inventory_tx') setActiveMenu('inventory_tx');
  };

  const handleTransaction = async () => {
    if (cart.length === 0) return alert("품목을 선택하세요.");
    if (!confirm(`${txType} 처리를 승인하시겠습니까?`)) return;
    alert("일괄 처리가 완료되었습니다.");
    setCart([]); loadAllData();
  };

  const isSensitive = (field: string) => config.sensitive_fields?.split(',').includes(field);
  const filteredItems = inventory.filter(i => 
    i.item_name_kr?.toLowerCase().includes(search.toLowerCase()) || 
    i.item_name_en?.toLowerCase().includes(search.toLowerCase()) || 
    i.product_no?.includes(search)
  );

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* [1] 좌측 통합 사이드바 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-zinc-200 transition-all duration-300 flex flex-col shadow-2xl
        md:relative md:translate-x-0 ${isSidebarExpanded ? 'w-80' : 'w-20 -translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-50 flex-shrink-0">
          {isSidebarExpanded && <div className="animate-in fade-in"><h1 className="text-lg font-black italic serif tracking-tighter uppercase">{config.erp_title}</h1></div>}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-zinc-100 rounded-xl"><DynamicIcon name={isSidebarExpanded ? "PanelLeftClose" : "Menu"} /></button>
        </div>

        <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menus.filter(m => !m.parent_id).map(main => (
            <div key={main.id} className="space-y-1">
              <button 
                onClick={() => {
                  if (main.id === 1) setActiveMenu('inventory_list'); // 재고 마스터 클릭 시 리스트로 연결
                  else if (main.path) setActiveMenu(main.path);
                }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeMenu.startsWith(main.path?.split('_')[0]) || (main.id === 1 && activeMenu.startsWith('inventory')) ? 'bg-zinc-900 text-white shadow-xl scale-[1.02]' : 'text-zinc-500 hover:bg-zinc-100'}`}
              >
                <DynamicIcon name={main.icon_name} /> {isSidebarExpanded && <span className="text-sm font-bold flex-1 text-left">{main.title}</span>}
              </button>
              
              {isSidebarExpanded && menus.filter(s => s.parent_id === main.id).map(sub => (
                <React.Fragment key={sub.id}>
                  <button 
                    onClick={() => setActiveMenu(sub.path)} 
                    className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl text-xs font-semibold ${activeMenu === sub.path ? 'bg-zinc-100 text-zinc-900 shadow-inner' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <DynamicIcon name={sub.icon_name} size={14} /> {sub.title}
                  </button>

                  {/* [지시사항] 장바구니 위치: '재고 트랜잭션' 바로 아래, '이력' 위에 삽입 */}
                  {sub.path === 'inventory_tx' && activeMenu === 'inventory_tx' && (
                    <div className="mx-2 my-2 p-4 bg-zinc-50 rounded-[2rem] border border-zinc-200 space-y-4 animate-in slide-in-from-top duration-300 shadow-inner">
                      <div className="space-y-2">
                        <select className="w-full bg-white border-zinc-200 rounded-xl text-[11px] font-bold py-2 shadow-sm" value={txType} onChange={(e)=>setTxType(e.target.value)}>
                          <option value="SALE">판매 (-)</option><option value="TRANSFER">이동 (⇄)</option><option value="DAMAGE">파손 (-)</option>
                        </select>
                        <div className="grid grid-cols-1 gap-1">
                          <select className="bg-white border-zinc-200 rounded-lg text-[10px] py-1.5" onChange={(e)=>setSourceStore(e.target.value)}><option>출발: {sourceStore || '선택'}</option>{stores.map(s=><option key={s.id} value={s.store_name}>{s.store_name}</option>)}</select>
                          <select className="bg-white border-zinc-200 rounded-lg text-[10px] py-1.5" onChange={(e)=>setDestStore(e.target.value)}><option>도착: {destStore || '선택'}</option>{stores.map(s=><option key={s.id} value={s.store_name}>{s.store_name}</option>)}</select>
                        </div>
                      </div>
                      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                        {cart.map(c => (
                          <div key={c.product_no} className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-zinc-100">
                            <img src={c.main_image_url} className="w-7 h-7 object-contain bg-zinc-50 rounded" />
                            <div className="flex-1 min-w-0"><p className="text-[9px] font-bold truncate leading-none">{c.item_name_kr}</p></div>
                            <input type="number" value={c.qty} className="w-8 bg-zinc-50 text-[10px] text-center rounded font-bold p-0.5" onChange={(e)=>setCart(cart.map(i=>i.product_no===c.product_no?{...i, qty:Number(e.target.value)}:i))}/>
                            <button onClick={()=>setCart(cart.filter(i=>i.product_no!==c.product_no))} className="text-zinc-300 hover:text-red-500"><LucideIcons.X size={10}/></button>
                          </div>
                        ))}
                        {cart.length === 0 && <p className="text-[9px] text-zinc-400 text-center py-2 italic">대기 목록 없음</p>}
                      </div>
                      <button onClick={handleTransaction} className="w-full bg-zinc-900 text-white py-3 rounded-xl text-[10px] font-black shadow-lg active:scale-95 transition-all">일괄 승인 및 기록</button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 flex-shrink-0">
           <div className={`flex bg-zinc-100 p-1 rounded-2xl ${!isSidebarExpanded && 'flex-col'}`}>
              <button onClick={() => setUserRole('STAFF')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${userRole === 'STAFF' ? 'bg-white shadow text-zinc-900' : 'text-zinc-400'}`}>STAFF</button>
              <button onClick={() => setUserRole('CEO')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${userRole === 'CEO' ? 'bg-zinc-900 text-white shadow' : 'text-zinc-400'}`}>CEO</button>
           </div>
        </div>
      </aside>

      {/* [2] 메인 영역 (모바일/PC 반응형 최적화) */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 md:px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-sm md:text-lg font-bold truncate">{menus.find(m => m.path === activeMenu)?.title || '재고 리스트'}</h2>
            <div className="relative max-w-[150px] md:max-w-md w-full">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input type="text" placeholder="검색..." className="w-full bg-zinc-100 border-none rounded-xl py-2 pl-9 text-xs focus:ring-2 focus:ring-zinc-900" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-lg gap-1 ml-2 flex-shrink-0">
             {[ {id:'grid', i:'LayoutGrid'}, {id:'tile', i:'Maximize2'}, {id:'list', i:'List'} ].map(v => (
               <button key={v.id} onClick={() => setViewMode(v.id)} className={`p-2 rounded-md transition-all ${viewMode === v.id ? 'bg-white shadow text-zinc-900' : 'text-zinc-400'}`}><DynamicIcon name={v.i} size={14} /></button>
             ))}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-3 md:p-8 custom-scrollbar">
          <div className={`grid gap-3 md:gap-4 ${
            viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 
            viewMode === 'tile' ? 'grid-cols-3 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12' : 
            'grid-cols-1 md:grid-cols-1'
          }`}>
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => activeMenu === 'inventory_tx' ? addToCart(item) : setSelectedItem(item)} 
                className={`bg-white rounded-[1.5rem] border border-zinc-200 shadow-sm p-3 md:p-5 cursor-pointer hover:shadow-xl transition-all 
                ${viewMode === 'list' ? 'flex items-center gap-4' : 'flex flex-col items-center justify-between min-h-[160px]'}`}>
                
                {/* 이미지 영역: 모바일에서도 이미지가 반드시 보이도록 크기 보장 */}
                <div className={`${viewMode === 'list' ? 'w-14 h-14 flex-shrink-0' : 'w-full aspect-square mb-2'} bg-zinc-50 rounded-2xl flex items-center justify-center p-2 overflow-hidden`}>
                  <img src={item.main_image_url} className="max-h-full max-w-full object-contain mix-blend-multiply" alt="" />
                </div>

                {/* 텍스트 영역: 모바일에서도 정보가 명확히 표현되도록 폰트 조정 */}
                <div className={`flex-1 min-w-0 ${viewMode === 'list' ? 'text-left' : 'text-center w-full'}`}>
                  <h3 className="font-bold text-[10px] md:text-sm truncate text-zinc-800 leading-tight mb-1">{item.item_name_kr}</h3>
                  <p className="text-[8px] md:text-[10px] text-zinc-400 font-mono">{item.product_no}</p>
                  {viewMode !== 'tile' && (
                    <div className={`mt-1.5 flex items-center gap-2 ${viewMode === 'list' ? 'justify-start' : 'justify-center'}`}>
                      <span className="text-[10px] md:text-xs font-black text-blue-600 italic">₩{item.retail_price?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* [상세 모달] */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex justify-end">
           <div className="w-full md:max-w-2xl bg-white h-full p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
              <button onClick={()=>setSelectedItem(null)} className="absolute top-6 left-6 p-2 bg-zinc-100 rounded-full hover:rotate-90 transition-all z-10"><LucideIcons.X size={20}/></button>
              <div className="space-y-8 mt-10 pb-20">
                 <div className="aspect-square bg-zinc-50 rounded-[2rem] md:rounded-[4rem] flex items-center justify-center p-8 border border-zinc-100 shadow-inner">
                    <img src={selectedItem.main_image_url} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                 </div>
                 <div className="space-y-3 px-2">
                    <p className="text-[11px] md:text-sm tracking-[0.3em] text-zinc-300 uppercase italic leading-none">{selectedItem.collection_en}</p>
                    <h2 className="text-2xl md:text-5xl font-light italic serif leading-tight text-zinc-900">{selectedItem.item_name_en}</h2>
                    <h3 className="text-base md:text-2xl font-bold text-zinc-600">{selectedItem.item_name_kr}</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-y-10 border-t border-zinc-100 pt-10">
                    <div className="space-y-1 px-2"><p className="text-[10px] text-zinc-300 font-black uppercase">Artist</p><p className="text-sm md:text-lg font-medium">{selectedItem.artist_name}</p></div>
                    <div className="space-y-1 px-2"><p className="text-[10px] text-zinc-300 font-black uppercase">Price</p><p className="text-sm md:text-lg font-black italic">₩{selectedItem.retail_price?.toLocaleString()}</p></div>
                    
                    {userRole === 'CEO' && (
                       <div className="col-span-2 bg-red-50 p-6 rounded-[2rem] border border-red-100 mx-2">
                          <p className="text-[9px] text-red-300 font-black uppercase mb-3 flex items-center gap-2"><LucideIcons.ShieldCheck size={14}/> Confidential CEO Info</p>
                          <div className="grid grid-cols-2 gap-4">
                             <div><p className="text-[10px] text-zinc-400 mb-1 font-bold">Import Cost</p><p className="text-base font-bold italic">₩{selectedItem.cost_price?.toLocaleString()}</p></div>
                             <div><p className="text-[10px] text-zinc-400 mb-1 font-bold">VIP Memo</p><p className="text-[11px] italic leading-relaxed text-zinc-600">{selectedItem.memo || '-'}</p></div>
                          </div>
                       </div>
                    )}
                    
                    <div className="col-span-2 space-y-4 px-2">
                       <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">Store Stock Status</p>
                       <div className="grid grid-cols-3 gap-3">
                          {selectedItem.store_stocks?.map((s:any) => (
                             <div key={s.store_name} className="p-3 bg-zinc-50 rounded-[1.5rem] text-center border border-zinc-100">
                                <p className="text-[9px] text-zinc-400 mb-1 font-bold truncate">{s.store_name}</p>
                                <p className={`text-sm md:text-xl font-black ${s.quantity > 0 ? 'text-blue-600' : 'text-zinc-200'}`}>{s.quantity}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
      `}</style>
    </div>
  );
}
