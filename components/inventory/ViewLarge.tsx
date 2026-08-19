import React from 'react';

export const ViewLarge = ({ data, isCEO }: { data: any[], isCEO: boolean }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm h-[280px]">
        <div className="w-[280px] h-full flex-shrink-0">
          <img src={item.image_url} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <p className="text-blue-600 font-bold text-[10px] tracking-widest uppercase">{item.serial_no}</p>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{item.name_ko}</h2>
          </div>
          <div className="border-t pt-4 flex justify-between items-end font-sans">
            <div className="flex flex-col">
               <span className="text-emerald-600 font-bold text-xs">STOCK: {item.stock_qty}</span>
               {/* CEO 모드일 때만 원가 노출 */}
               {isCEO && <span className="text-rose-500 font-bold text-xs uppercase tracking-tighter">Cost: ₩{item.cost_price?.toLocaleString()}</span>}
            </div>
            <span className="text-3xl font-black text-slate-900">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
