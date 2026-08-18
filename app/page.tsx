"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
};

export default function SunflexMasterControlERP() {
  // --- [상태 관리] ---
  const [config, setConfig] = useState<any>({});
  const [menus, setMenus] = useState<any[]>([]);
  const [inventory, setInventory] = useState([]);
  const [stores, setStores] = useState([]);
  const [userRole, setUserRole] = useState('STAFF'); 
  const [activeMenu, setActiveMenu] = useState('inventory_list');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // --- [마스터 설정 편집용 상태] ---
  const [editingSettings, setEditingSettings] = useState<any[]>([]);

  useEffect(() => { loadAllData(); }, []);

  async function loadAllData() {
    const { data: set } = await supabase.from('system_settings').select('*');
    const { data: men } = await supabase.from('menu_config').select('*').eq('is_active', true).order('sort_order');
    const { data: inv } = await supabase.from('inventory').select('*, store_stocks(*)');
    const { data: str } = await supabase.from('stores').select('*');

    const configMap = set?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || {};
    setConfig(configMap);
    setEditingSettings(set || []);
    setMenus(men || []);
    setInventory(inv || []);
    setStores(str || []);
  }

  // [마스터 설정 저장 로직]
  const saveSystemSetting = async (key, newValue) => {
    await supabase.from('system_settings').update({ value: newValue }).eq('key', key);
    loadAllData(); // 즉시 반영
  };

  const isSensitive = (field) => config.sensitive_fields?.split(',').includes(field);

  const filteredItems = inventory.filter(i => 
    i.item_name_kr?.includes(search) || i.product_no?.includes(search)
  );

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* --- [1] 가변형 마스터 사이드바 --- */}
      <aside className={`${isSidebarExpanded ? 'w-64' : 'w-20'} bg-white border-r border-zinc-200 transition-all duration-500 flex flex-col z-30 shadow-2xl`}>
        <div className="h-24 flex items-center justify-between px-6 border-b border-zinc-50">
          {isSidebarExpanded && <div className="animate-in fade-in"><h1 className="text-xl font-black italic serif tracking-tighter uppercase">{config.erp_title}</h1><p className="text-[10px] text-zinc-400 font-bold tracking-widest">{config.erp_subtitle}</p></div>}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-zinc-100 rounded-xl transition-all"><DynamicIcon name={isSidebarExpanded ? "PanelLeftClose" : "Menu"} /></button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menus.filter(m => !m.parent_id).map(main => (
            <div key={main.id} className="space-y-1">
              <button onClick={() => main.path && setActiveMenu(main.path)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeMenu.startsWith(main.path?.split('_')[0]) ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'}`}>
                <DynamicIcon name={main.icon_name} /> {isSidebarExpanded && <span className="text-sm font-bold flex-1 text-left">{main.title}</span>}
              </button>
              {isSidebarExpanded && menus.filter(s => s.parent_id === main.id).map(sub => (
                <button key={sub.id} onClick={() => setActiveMenu(sub.path)} className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl text-xs font-semibold ${activeMenu === sub.path ? 'bg-zinc-50 text-zinc-900 shadow-inner' : 'text-zinc-400 hover:text-zinc-600'}`}>
                   <DynamicIcon name={sub.icon_name} size={14} /> {sub.title}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <div className={`flex bg-zinc-100 p-1 rounded-2xl ${!isSidebarExpanded && 'flex-col'}`}>
              <button onClick={() => setUserRole('STAFF')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${userRole === 'STAFF' ? 'bg-white shadow text-zinc-900' : 'text-zinc-400'}`}>STAFF</button>
              <button onClick={() => setUserRole('CEO')} className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${userRole === 'CEO' ? 'bg-zinc-900 text-white shadow' : 'text-zinc-400'}`}>CEO</button>
           </div>
        </div>
      </aside>

      {/* --- [2] 메인 레이아웃 --- */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-lg font-bold">{menus.find(m => m.path === activeMenu)?.title}</h2>
            <div className="relative max-w-md w-full">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="통합 검색..." className="w-full bg-zinc-100 border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-zinc-900 shadow-inner" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
             {[ {id:'grid', i:'LayoutGrid', l:'카드'}, {id:'tile', i:'Maximize2', l:'타일'}, {id:'list', i:'List', l:'목록'} ].map(v => (
               <button key={v.id} onClick={() => setViewMode(v.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${viewMode === v.id ? 'bg-white shadow text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>
                 <DynamicIcon name={v.i} size={14} /> {isSidebarExpanded && v.l}
               </button>
             ))}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {/* 재고 현황 모듈 */}
          {activeMenu === 'inventory_list' && (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-4' : viewMode === 'tile' ? 'grid-cols-10' : 'grid-cols-1'}`}>
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => setSelectedItem(item)} className={`bg-white rounded-[2rem] border border-zinc-100 shadow-sm p-4 cursor-pointer hover:shadow-xl transition-all ${viewMode === 'list' && 'flex items-center gap-6'}`}>
                  <img src={item.main_image_url} className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-full aspect-square'} object-contain bg-zinc-50 rounded-2xl mb-2`} />
                  <div className="flex-1 px-2">
                    <h3 className="font-bold text-sm truncate">{item.item_name_kr}</h3>
                    <p className="text-[10px] text-zinc-400 font-mono">{item.product_no}</p>
                    {viewMode === 'list' && <p className="text-sm font-black text-blue-600 mt-1 italic">₩{item.retail_price?.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 시스템 설정 모듈 (마스터 관리 화면) */}
          {activeMenu === 'settings' && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-700 pb-20">
              <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-4xl font-black italic serif tracking-tighter">SYSTEM MASTER CONTROL</h2>
                   <p className="text-zinc-400 mt-2 font-medium">프로그램의 모든 텍스트, 보안, 메뉴를 코딩 없이 여기서 관리하세요.</p>
                </div>
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                   <LucideIcons.ShieldAlert size={14}/> 수정 시 즉시 반영됩니다.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. 전역 설정 & 보안 필드 */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100">
                    <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-zinc-400 uppercase tracking-widest"><LucideIcons.Settings size={20}/> Global & Security</h3>
                    <div className="space-y-6">
                      {editingSettings.map((s) => (
                        <div key={s.key} className="group">
                          <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest ml-1 mb-2 block">{s.description || s.key}</label>
                          <div className="flex gap-2">
                            <input 
                              className="flex-1 bg-zinc-50 border-none rounded-2xl py-3.5 px-5 text-sm font-semibold focus:ring-2 focus:ring-zinc-900 transition-all"
                              defaultValue={s.value}
                              onBlur={(e) => saveSystemSetting(s.key, e.target.value)}
                            />
                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-300 group-focus-within:text-zinc-900 transition-colors">
                              <LucideIcons.Save size={18} />
                            </div>
                          </div>
                          {s.key === 'sensitive_fields' && <p className="text-[10px] text-blue-500 mt-2 ml-1 italic">* 여기에 적힌 이름의 필드는 CEO 모드에서만 나타납니다. (쉼표 구분)</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. 매장(지점) 관리 */}
                <div className="bg-zinc-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
                   <h3 className="text-lg font-bold flex items-center gap-2 text-white/30 uppercase tracking-widest"><Store size={20}/> Store Management</h3>
                   <div className="space-y-3">
                      {stores.map(store => (
                        <div key={store.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                           <span className="font-bold text-sm">{store.store_name}</span>
                           <button className="text-white/20 group-hover:text-red-400 transition-colors"><LucideIcons.Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button className="w-full py-4 mt-4 border-2 border-dashed border-white/10 rounded-2xl text-xs font-bold text-white/40 hover:border-white/40 hover:text-white transition-all">
                         + 새 매장 추가 (DB stores 테이블에 추가됨)
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* --- [상세 정보 모달: 보안 필드 로직 적용] --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex justify-end">
           <div className="w-full max-w-2xl bg-white h-full p-12 overflow-y-auto animate-in slide-in-from-right duration-500 shadow-2xl relative">
              <button onClick={()=>setSelectedItem(null)} className="absolute top-10 left-10 p-3 bg-zinc-100 rounded-full hover:rotate-90 transition-all"><LucideIcons.X size={24}/></button>
              <div className="space-y-12">
                 <img src={selectedItem.main_image_url} className="w-full aspect-square object-contain bg-zinc-50 rounded-[3rem] shadow-inner" />
                 <div className="space-y-4">
                    <p className="text-sm tracking-[0.3em] text-zinc-400 uppercase italic">{selectedItem.collection_en}</p>
                    <h2 className="text-5xl font-light italic serif leading-tight">{selectedItem.item_name_en}</h2>
                    <h3 className="text-2xl font-bold text-zinc-800">{selectedItem.item_name_kr}</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-x-12 gap-y-10 border-t border-zinc-100 pt-10">
                    <div className="space-y-1"><p className="text-xs text-zinc-300 font-black uppercase tracking-widest">Artist</p><p className="text-lg font-medium">{selectedItem.artist_name}</p></div>
                    <div className="space-y-1"><p className="text-xs text-zinc-300 font-black uppercase tracking-widest">Retail Price</p><p className="text-lg font-black italic">₩{selectedItem.retail_price?.toLocaleString()}</p></div>
                    
                    {/* [보안 필드 자동 렌더링] */}
                    {Object.entries(selectedItem).map(([key, val]: any) => {
                       if (isSensitive(key) && userRole !== 'CEO') return null; // STAFF 모드일 때 민감 필드 숨김
                       if (isSensitive(key)) return (
                         <div key={key} className="col-span-2 bg-red-50 p-6 rounded-[2rem] border border-red-100 animate-in zoom-in-95">
                            <p className="text-[10px] text-red-400 font-black uppercase mb-2 flex items-center gap-2"><LucideIcons.ShieldCheck size={14}/> CEO Confidential: {key}</p>
                            <p className="text-xl font-bold italic">{typeof val === 'number' ? `₩${val.toLocaleString()}` : val}</p>
                         </div>
                       );
                       return null;
                    })}

                    <div className="col-span-2 space-y-4">
                       <p className="text-xs text-zinc-300 font-black uppercase tracking-widest">Store Inventory</p>
                       <div className="grid grid-cols-3 gap-4">
                          {selectedItem.store_stocks?.map((s:any) => (
                             <div key={s.store_name} className="p-5 bg-zinc-50 rounded-3xl text-center border border-zinc-100">
                                <p className="text-[10px] text-zinc-400 mb-1 font-bold">{s.store_name}</p>
                                <p className={`text-2xl font-black ${s.quantity > 0 ? 'text-blue-600' : 'text-zinc-200'}`}>{s.quantity}</p>
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
