import React from 'react';

interface ViewProps {
  data: any[];
  isCEO: boolean;
  fields: any[]; // 설정에서 넘어온 필드 구성 정보
}

// 1. 대 (Lookbook View)
export const ViewLarge = ({ data, isCEO, fields }: ViewProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
    {data.length === 0 ? (
      <div className="col-span-2 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase tracking-widest">No Inventory Data</div>
    ) : (
      data.map((item) => (
        <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm h-[280px]">
          <div className="w-[280px] h-full flex-shrink-0 bg-slate-50 border-r">
            <img src={item.image_url} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div className="space-y-2">
              {/* [설정기반] 상단 필드 (주로 제품번호) */}
              <p className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">{item[fields[0]?.key]}</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{item[fields[1]?.key]}</h2>
            </div>
            <div className="border-t pt-4 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-emerald-600 font-bold text-[10px] uppercase">STOCK: {item.stock_qty}</span>
                {isCEO && <span className="text-rose-500 font-bold text-[10px] uppercase tracking-tighter italic">COST: ₩{item.cost_price?.toLocaleString()}</span>}
              </div>
              <span className="text-3xl font-black text-slate-900 tracking-tighter italic font-sans">₩{item.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

// 2. 중 (List View)
export const ViewMedium = ({ data, isCEO, fields }: ViewProps) => (
  <div className="space-y-3 font-sans">
    {data.map((item) => (
      <div key={item.id} className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <img src={item.image_url} className="w-16 h-16 object-cover rounded-xl border border-slate-100" alt="" />
        <div className="flex-1 grid grid-cols-4 items-center gap-4 text-sm text-slate-900">
          {fields.slice(0, 4).map((f) => (
            <div key={f.key} className={f.key.includes('qty') || f.key.includes('price') ? "text-right font-black" : "font-bold text-slate-800"}>
              {f.key.includes('price') ? `₩${item[f.key]?.toLocaleString()}` : item[f.key]}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// 3. 소 (Grid/Table View)
export const ViewSmall = ({ data, isCEO, fields }: ViewProps) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-sans text-xs">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
        <tr>
          {fields.map(f => <th key={f.key} className={`p-4 ${f.key.includes('qty') || f.key.includes('price') ? "text-right" : ""}`}>{f.label}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors tracking-tight font-medium">
            {fields.map(f => (
              <td key={f.key} className={`p-4 ${f.key.includes('qty') || f.key.includes('price') ? "text-right font-black text-slate-900" : "font-bold text-blue-900"}`}>
                {f.key.includes('price') ? `₩${item[f.key]?.toLocaleString()}` : item[f.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
