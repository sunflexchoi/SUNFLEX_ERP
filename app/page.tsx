"use client";

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// [도움말] DB에 저장된 아이콘 문자열을 실제 컴포넌트로 변환하는 마법의 함수
const DynamicIcon = ({ name, size = 20, ...props }: { name: string; size?: number; [key: string]: any }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent size={size} {...props} /> : <LucideIcons.HelpCircle size={size} />;
};

export default function ConfigurationDrivenERP() {
  // 1. 상태 관리 (설정 데이터 중심)
  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [menus, setMenus] = useState<any[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState('inventory_list');
  const [inventory, setInventory] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, tile, list
  
  // 2. 초기 로드 (DB에서 모든 설정을 가져옴)
  useEffect(() => {
    async function loadSystem() {
      const { data: settings } = await supabase.from('system_settings').select('*');
      const { data: menuData } = await supabase.from('menu_config').select('*').eq('is_active', true).order('sort_order');
      const { data: invData } = await supabase.from('inventory').select('*, store_stocks(*)');

      const settingMap = settings?.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}) || {};
      setConfig(settingMap);
      setMenus(menuData || []);
      setInventory(invData || []);
    }
    loadSystem();
  }, []);

  // 3. UI 렌더링 (사이드바 중심 통합)
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      
      {/* [확장/축소형 사이드바] */}
      <aside className={`bg-white border-r border-zinc-200 flex flex-col transition-all duration-300 shadow-xl z-30 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between border-b border-zinc-100">
          {isSidebarExpanded && (
            <div>
              <h1 className="text-xl font-black italic serif tracking-tighter">{config.erp_title || 'LOADING...'}</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          )}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-zinc-100 rounded-lg">
            <DynamicIcon name={isSidebarExpanded ? "ChevronLeft" : "Menu"} size={18} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menus.filter(m => !m.parent_id).map(mainMenu => (
            <div key={mainMenu.id} className="space-y-1">
              <button 
                onClick={() => mainMenu.path && setActiveMenu(mainMenu.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeMenu.startsWith(mainMenu.path?.split('_')[0]) ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'}`}
              >
                <DynamicIcon name={mainMenu.icon_name} />
                {isSidebarExpanded && <span className="text-sm font-bold flex-1 text-left">{mainMenu.title}</span>}
              </button>
              
              {/* 서브메뉴 (Inventory 액션 병합) */}
              {isSidebarExpanded && menus.filter(sub => sub.parent_id === mainMenu.id).map(subMenu => (
                <button 
                  key={subMenu.id}
                  onClick={() => setActiveMenu(subMenu.path)}
                  className={`w-full flex items-center gap-3 pl-12 pr-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeMenu === subMenu.path ? 'text-zinc-900 bg-zinc-50' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <DynamicIcon name={subMenu.icon_name} size={14} /> {subMenu.title}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* [메인 콘텐츠] - 탐색기 뷰 기능 복구 */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 p-6 flex justify-between items-center">
          <h2 className="text-lg font-bold">{menus.find(m => m.path === activeMenu)?.title}</h2>
          
          {/* 윈도우 탐색기 스타일 뷰 전환기 */}
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {[{id:'grid', i:'LayoutGrid'}, {id:'tile', i:'Maximize2'}, {id:'list', i:'List'}].map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)} className={`p-2 rounded-lg transition-all ${viewMode === v.id ? 'bg-white shadow-sm' : 'text-zinc-400'}`}>
                <DynamicIcon name={v.i} size={16} />
              </button>
            ))}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8">
          {activeMenu === 'inventory_list' && (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-4' : viewMode === 'tile' ? 'grid-cols-8' : 'grid-cols-1'}`}>
              {inventory.map(item => (
                <div key={item.id} className="bg-white rounded-3xl border border-zinc-100 p-4 shadow-sm">
                  <img src={item.main_image_url} className="w-full aspect-square object-contain mb-4 bg-zinc-50 rounded-2xl" />
                  {viewMode !== 'tile' && (
                    <>
                      <h3 className="font-bold text-sm">{item.item_name_kr}</h3>
                      <p className="text-xs text-zinc-400 font-mono">{item.product_no}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeMenu === 'inventory_tx' && (
            <div className="max-w-2xl bg-white p-10 rounded-[3rem] shadow-2xl border border-zinc-100">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-2"><DynamicIcon name="ArrowRightLeft" /> 트랜잭션 엔진 가동</h2>
              <p className="text-zinc-400 italic mb-8">사이드바에서 선택된 제품들을 일괄 처리합니다...</p>
              {/* 트랜잭션 폼이 여기에 들어갑니다 */}
            </div>
          )}
          
          {activeMenu === 'settings' && (
            <div className="max-w-4xl space-y-6">
              <h2 className="text-2xl font-black mb-10 italic">SYSTEM MASTER CONTROL</h2>
              <p className="p-6 bg-blue-50 text-blue-600 rounded-2xl font-bold border border-blue-100">
                현재 시스템은 '메타데이터 구동' 모드입니다. DB의 system_settings 테이블을 수정하면 즉시 제목과 정책이 변경됩니다.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
