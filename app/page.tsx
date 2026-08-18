"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const DynamicIcon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent size={size} /> : <LucideIcons.HelpCircle size={size} />;
};

export default function SunflexMetadataERP() {
  const [config, setConfig] = useState<any>({});
  const [menus, setMenus] = useState<any[]>([]);
  const [inventory, setInventory] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState('inventory_list');
  const [viewMode, setViewMode] = useState('grid'); // grid, tile, list
  const [search, setSearch] = useState('');

  useEffect(() => { loadSystem(); }, []);

  async function loadSystem() {
    const { data: settings } = await supabase.from('system_settings').select('*');
    const { data: menuData } = await supabase.from('menu_config').select('*').eq('is_active', true).order('sort_order');
    const { data: invData } = await supabase.from('inventory').select('*, store_stocks(*)');
    
    setConfig(settings?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || {});
    setMenus(menuData || []);
    setInventory(invData || []);
  }

  const filteredItems = inventory.filter(i => i.item_name_kr?.includes(search) || i.product_no?.includes(search));

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-zinc-900">
      
      {/* [1] 가변형 통합 사이드바 */}
      <aside className={`bg-white border-r border-zinc-200 flex flex-col transition-all duration-300 shadow-xl z-30 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 h-24">
          {isSidebarExpanded && (
            <div className="animate-in fade-in duration-500">
              <h1 className="text-xl font-black italic serif tracking-tighter uppercase">{config.erp_title}</h1>
              <p className="text-[10px] text-zinc-400 font-bold tracking-widest">SYSTEM MASTER</p>
            </div>
          )}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-zinc-100 rounded-xl">
            <DynamicIcon name={isSidebarExpanded ? "PanelLeftClose" : "Menu"} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menus.filter(m => !m.parent_id).map(mainMenu => (
            <div key={mainMenu.id} className="space-y-1">
              <button 
                onClick={() => mainMenu.path && setActiveMenu(mainMenu.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeMenu.startsWith(mainMenu.path?.split('_')[0]) ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'}`}
              >
                <DynamicIcon name={mainMenu.icon_name} />
                {isSidebarExpanded && <span className="text-sm font-bold flex-1 text-left">{mainMenu.title}</span>}
              </button>
              
              {/* 서브메뉴 (트랜잭션 등) */}
              {isSidebarExpanded && menus.filter(sub => sub.parent_id === mainMenu.id).map(subMenu => (
                <button 
                  key={subMenu.id} onClick={() => setActiveMenu(subMenu.path)}
                  className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeMenu === subMenu.path ? 'text-zinc-900 bg-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <DynamicIcon name={subMenu.icon_name} size={14} /> {subMenu.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* [2] 가변형 메인 영역 */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 p-6 flex justify-between items-center h-24">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-lg font-bold">{menus.find(m => m.path === activeMenu)?.title || '메뉴'}</h2>
            <div className="relative max-w-md w-full">
              <LucideIcons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input type="text" placeholder="검색..." className="w-full bg-zinc-100 border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-zinc-900" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {/* [3] 탐색기 뷰 스위처 (Grid, Tile, List) */}
          <div className="flex bg-zinc-100 p-1 rounded-xl gap-1">
            {[
              { id: 'grid', icon: 'LayoutGrid', label: '카드' },
              { id: 'tile', icon: 'Maximize2', label: '타일' },
              { id: 'list', icon: 'List', label: '자세히' }
            ].map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${viewMode === v.id ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}>
                <DynamicIcon name={v.icon} size={14} /> {isSidebarExpanded && v.label}
              </button>
            ))}
          </div>
        </header>

        {/* [4] 콘텐츠 영역 */}
        <section className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'inventory_list' && (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-4' : viewMode === 'tile' ? 'grid-cols-8 md:grid-cols-12' : 'grid-cols-1'}`}>
              {filteredItems.map(item => (
                <div key={item.id} className={`bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden ${viewMode === 'list' ? 'flex items-center p-3 gap-6' : 'p-4 text-center'}`}>
                  <img src={item.main_image_url} className={`${viewMode === 'list' ? 'w-12 h-12' : 'w-full aspect-square'} object-contain bg-zinc-50 rounded-2xl mb-2`} />
                  {viewMode !== 'tile' && (
                    <div className={viewMode === 'list' ? 'flex-1 grid grid-cols-4 items-center' : ''}>
                      <h3 className="font-bold text-sm truncate">{item.item_name_kr}</h3>
                      <p className="text-[10px] text-zinc-400 font-mono">{item.product_no}</p>
                      {viewMode === 'list' && <p className="text-sm font-black text-blue-600">₩{item.retail_price?.toLocaleString()}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeMenu === 'inventory_tx' && (
             <div className="max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-100 mx-auto mt-10 text-center">
                <DynamicIcon name="ArrowRightLeft" size={48} className="mx-auto text-blue-600 mb-6" />
                <h2 className="text-2xl font-black mb-4 uppercase italic serif">Transaction Center</h2>
                <p className="text-zinc-400 italic">사이드바에서 선택한 품목들을 일괄 처리하는 마스터 화면입니다.</p>
             </div>
          )}

          {activeMenu === 'settings' && (
             <div className="max-w-3xl mx-auto mt-10 p-10 bg-white border border-zinc-200 rounded-[3rem] shadow-xl">
                <h2 className="text-2xl font-black italic mb-6">SYSTEM MASTER CONTROL</h2>
                <div className="p-6 bg-zinc-50 rounded-2xl space-y-4 text-sm text-zinc-600">
                  <p>이 화면은 DB의 **system_settings** 테이블과 **menu_config** 테이블을 통해 통제됩니다.</p>
                  <ul className="list-disc ml-6 space-y-2">
                    <li>개발자 없이 메뉴 명칭, 아이콘, 제목 변경 가능</li>
                    <li>모든 액션은 사이드바에 통합되어 관리됨</li>
                  </ul>
                </div>
             </div>
          )}
        </section>
      </main>
    </div>
  );
}
