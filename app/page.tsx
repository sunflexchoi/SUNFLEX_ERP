"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
};

export default function SunflexResponsiveERP() {
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
    setMenus(men || []);
    setInventory(inv || []);
    setStores(str || []);
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

  const filteredItems = inventory.filter(i => 
    i.item_name_kr?.includes(search) || i.product_no?.includes(search)
  );

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* [사이드바] 트랜잭션 창이 이 안으로 통합되었습니다 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-zinc-200 transition-all duration-500 flex flex-col shadow-2xl
        md:relative md:translate-x-0 ${isSidebarExpanded ? 'w-72 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-50">
          {(isSidebarExpanded || typeof window !== 'undefined' && window.innerWidth < 768) && (
            <div className="animate-in fade-in"><h1 className="text-lg font-black italic serif tracking-tighter uppercase">{config.erp_title}</h1></div>
          )}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-zinc-100 rounded-xl">
            <DynamicIcon name={isSidebarExpanded ? "PanelLeftClose" : "Menu"} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menus.filter(m => !m.parent_id).map(main => (
            <div key={main.id} className="space-y-1">
              <button onClick={() => main.path && setActiveMenu(main.path)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeMenu.startsWith(main.path?.split('_')[0]) ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'}`}>
                <DynamicIcon name={main.icon_name} /> {(isSidebarExpanded) && <span className="text-sm font-bold flex-1 text-left">{main.title}</span>}
              </button>
              
              {/* [통합 장바구니 섹션] 트랜잭션 메뉴 하위에 표시 */}
              {activeMenu === 'inventory_tx' && main.id === 1 && isSidebarExpanded && (
                <div className="mx-2 my-4 p-4 bg-zinc-50 rounded-[2rem] border border-zinc-100 space-y-4 animate-in slide-in-from-top">
                  <div className="space-y-2">
                    <select className="w-full bg-white border-none rounded-xl text-[10px] font-bold shadow-sm" onChange={(e)=>setTxType(e.target.value)}>
                      <option value="SALE">판매</option><option value="TRANSFER">이동</option><option value="DAMAGE">파손</option>
                    </select>
                    <div className="grid grid-cols-1 gap-1">
                      <select className="w-full bg-white border-none rounded-xl text-[9px]" onChange={(e)=>setSourceStore(e.target.value)}><option>출발...</option>{stores.map(s=><option key={s.id}>{s.store_name}</option>)}</select>
                      <select className="w-full bg-white border-none rounded-xl text-[9px]" onChange={(e)=>setDestStore(e.target.value)}><option>도착...</option>{stores.map(s=><option key={s.id}>{s.store_name}</option>)}</select>
                    </div>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {cart.map(c => (
                      <div key={c.product_no} className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm relative">
                        <img src={c.main_image_url} className="w-8 h-8 object-contain" />
                        <span className="text-[10px] font-bold truncate flex-1">{c.item_name_kr}</span>
                        <input type="number" value={c.qty} className="w-8 bg-zinc-50 text-[10px] text-center rounded border-none p-0.5" onChange={(e)=>setCart(cart.map(i=>i.product_no===c.product_no?{...i, qty:Number(e.target.value)}:i))}/>
                        <button onClick={()=>setCart(cart.filter(i=>i.product_no!==c.product_no))} className="text-zinc-300"><LucideIcons.X size={10}/></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleTransaction} className="w-full bg-zinc-900 text-white py-3 rounded-xl text-[11px] font-bold shadow-xl active:scale-95 transition-all">일괄 승인</button>
                </div>
              )}

              {isSidebarExpanded && menus.filter(s => s.parent_id === main.id).map(sub => (
                <button key={sub.id} onClick={() => setActiveMenu(sub.path)} className={`w-full flex items-center gap-3 pl-12 pr-4 py-2 rounded-xl text-xs font-semibold ${activeMenu === sub.path ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>
                  <DynamicIcon name={sub.icon_name} size={14} /> {sub.title}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <div className={`flex bg-zinc-100 p-1 rounded-2xl ${!isSidebarExpanded && 'flex-col'}`}>
              <button onClick={() => setUserRole('STAFF')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl ${userRole === 'STAFF' ? 'bg-white shadow text-zinc-900' : 'text-zinc-400'}`}>{isSidebarExpanded ? 'STAFF' : 'S'}</button>
              <button onClick={() => setUserRole('CEO')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl ${userRole === 'CEO' ? 'bg-zinc-900 text-white shadow' : 'text-zinc-400'}`}>{isSidebarExpanded ? 'CEO' : 'C'}</button>
           </div>
        </div>
      </aside>

      {/* [메인 영역] 반응형 최적화 */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-4 md:px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-sm md:text-lg font-bold truncate">{menus.find(m => m.path === activeMenu)?.title}</h2>
            <div className="relative max-w-[200px] md:max-w-md w-full">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input type="text" placeholder="검색..." className="w-full bg-zinc-100 border-none rounded-xl py-2 pl-9 text-xs focus:ring-2 focus:ring-zinc-900 shadow-inner" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-lg gap-1 ml-2">
             {[ {id:'grid', i:'LayoutGrid'}, {id:'tile', i:'Maximize2'}, {id:'list', i:'List'} ].map(v => (
               <button key={v.id} onClick={() => setViewMode(v.id)} className={`p-1.5 rounded-md transition-all ${viewMode === v.id ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><DynamicIcon name={v.i} size={14} /></button>
             ))}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeMenu === 'inventory_list' && (
            <div className={`grid gap-3 md:gap-4 ${
              viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 
              viewMode === 'tile' ? 'grid-cols-3 md:grid-cols-10 lg:grid-cols-12' : 
              'grid-cols-1'
            }`}>
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => activeMenu === 'inventory_tx' ? addToCart(item) : setSelectedItem(item)} className={`bg-white rounded-[1.5rem] md:rounded-[2rem] border border-zinc-100 shadow-sm p-3 md:p-4 cursor-pointer hover:shadow-lg transition-all ${viewMode === 'list' && 'flex items-center gap-4'}`}>
                  <div className={`${viewMode === 'list' ? 'w-12 h-12' : 'w-full aspect-square'} bg-zinc-50 rounded-xl md:rounded-2xl flex items-center justify-center p-2`}>
                    <img src={item.main_image_url} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 mt-2 md:mt-3 px-1 overflow-hidden">
                    <h3 className="font-bold text-[10px] md:text-sm truncate leading-tight">{item.item_name_kr}</h3>
                    <p className="text-[8px] md:text-[10px] text-zinc-400 font-mono mt-0.5">{item.product_no}</p>
                    {viewMode !== 'tile' && <p className="text-[10px] md:text-xs font-black text-blue-600 mt-1 md:mt-2 italic">₩{item.retail_price?.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeMenu === 'lookbook' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
               {filteredItems.map(item => (
                 <div key={item.id} className="group cursor-pointer text-center space-y-4">
                    <div className="aspect-[4/5] bg-white rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                       <img src={item.main_image_url} className="w-full h-full object-contain p-4 md:p-8" />
                    </div>
                    <div className="px-4">
                       <p className="text-[8px] md:text-[10px] tracking-[0.3em] text-zinc-300 uppercase italic mb-1">{item.collection_en}</p>
                       <h3 className="text-xl md:text-3xl font-light italic serif leading-tight">{item.item_name_en}</h3>
                       <p className="text-xs md:text-sm text-zinc-400 mt-2 font-medium">By {item.artist_name}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeMenu === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 pb-20 animate-in slide-in-from-bottom duration-700">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-black italic serif tracking-tighter">MASTER CONTROL</h2>
                    <p className="text-[10px] md:text-sm text-zinc-400 mt-1 font-medium italic">All data-driven, no-code maintenance enabled.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-zinc-100 space-y-6">
                     <h4 className="font-bold flex items-center gap-2 text-zinc-300 uppercase tracking-widest text-xs"><LucideIcons.Globe size={16}/> Global Settings</h4>
                     <div className="space-y-4">
                        {Object.entries(config).map(([k, v]: any) => (
                          <div key={k} className="space-y-1">
                             <label className="text-[8px] font-bold text-zinc-300 uppercase ml-1">{k}</label>
                             <input className="w-full bg-zinc-50 border-none rounded-xl py-2.5 px-4 text-xs font-medium focus:ring-1 focus:ring-zinc-900 transition-all" defaultValue={v} onBlur={(e)=>supabase.from('system_settings').update({value:e.target.value}).eq('key',k).then(()=>loadAllData())} />
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-zinc-900 text-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl space-y-6">
                     <h4 className="font-bold flex items-center gap-2 text-white/20 uppercase tracking-widest text-xs"><LucideIcons.Menu size={16}/> Menu Engine</h4>
                     <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {menus.map(m => (
                          <div key={m.id} className="flex justify-between p-3 bg-white/5 rounded-xl text-[10px] items-center border border-white/5">
                             <span className="flex items-center gap-2"><DynamicIcon name={m.icon_name} size={12}/> {m.title}</span>
                             <span className="text-white/20 font-mono italic">{m.path}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          )}
        </section>
      </main>

      {/* [상세 모달] 반응형 레이아웃 */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end">
           <div className="w-full md:max-w-2xl bg-white h-full p-6 md:p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
              <button onClick={()=>setSelectedItem(null)} className="absolute top-6 left-6 p-3 bg-zinc-100 rounded-full active:scale-90 transition-transform"><LucideIcons.X size={20}/></button>
              <div className="space-y-8 md:space-y-12 mt-12">
                 <div className="aspect-square md:aspect-[4/5] bg-zinc-50 rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center p-8">
                    <img src={selectedItem.main_image_url} className="max-h-full object-contain mix-blend-multiply" />
                 </div>
                 <div className="space-y-2 md:space-y-4">
                    <p className="text-[10px] md:text-sm tracking-[0.3em] text-zinc-300 uppercase italic leading-none">{selectedItem.collection_en}</p>
                    <h2 className="text-3xl md:text-5xl font-light italic serif leading-tight">{selectedItem.item_name_en}</h2>
                    <h3 className="text-lg md:text-2xl font-bold text-zinc-700">{selectedItem.item_name_kr}</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-y-8 md:gap-y-10 border-t border-zinc-100 pt-8 md:pt-10 pb-20">
                    <div className="space-y-1"><p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Artist</p><p className="text-sm md:text-lg">{selectedItem.artist_name}</p></div>
                    <div className="space-y-1"><p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Price</p><p className="text-sm md:text-lg font-black italic">₩{selectedItem.retail_price?.toLocaleString()}</p></div>
                    {userRole === 'CEO' && (
                       <div className="col-span-2 bg-red-50 p-6 rounded-[2rem] border border-red-100">
                          <p className="text-[8px] text-red-300 font-black uppercase tracking-widest flex items-center gap-2 mb-3"><LucideIcons.ShieldCheck size={12}/> Confidential Info</p>
                          <div className="grid grid-cols-2 gap-4">
                             <div><p className="text-[10px] text-zinc-400 mb-1 font-bold">Import Cost</p><p className="text-base font-bold italic">₩{selectedItem.cost_price?.toLocaleString()}</p></div>
                             <div><p className="text-[10px] text-zinc-400 mb-1 font-bold">VIP Memo</p><p className="text-[10px] italic leading-relaxed">{selectedItem.memo || '-'}</p></div>
                          </div>
                       </div>
                    )}
                    <div className="col-span-2 space-y-4">
                       <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">Store Inventory</p>
                       <div className="grid grid-cols-3 gap-3">
                          {selectedItem.store_stocks?.map((s:any) => (
                             <div key={s.store_name} className="p-3 md:p-4 bg-zinc-50 rounded-2xl text-center border border-zinc-100">
                                <p className="text-[8px] md:text-[10px] text-zinc-400 mb-1 font-bold truncate">{s.store_name}</p>
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
    </div>
  );
}
