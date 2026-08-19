import React from 'react';

interface ViewProps {
  data: any[];
  isCEO: boolean;
}

export const ViewLarge = ({ data, isCEO }: ViewProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm h-[280px]">
        <div className="w-[280px] h-full flex-shrink-0 bg-slate-50 border-r">
          <img src={item.image_url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <p className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">{item.serial_no}</p>
            <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tighter leading-none">{item.name_ko}</h2>
          </div>
          <div className="border-t pt-4 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-emerald-600 font-bold text-[10px] uppercase">Stock: {item.stock_qty}</span>
              {isCEO && <span className="text-rose-500 font-bold text-[10px] uppercase tracking-tighter mt-1">Cost: ₩{item.cost_price?.toLocaleString()}</span>}
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ViewMedium = ({ data, isCEO }: ViewProps) => (
  <div className="space-y-3 font-sans">
    {data.map((item) => (
      <div key={item.id} className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <img src={item.image_url} className="w-16 h-16 object-cover rounded-xl border" alt="" />
        <div className="flex-1 grid grid-cols-4 items-center gap-4">
          <div className="font-bold text-sm text-blue-900 leading-none">{item.serial_no}</div>
          <div className="font-bold text-sm text-slate-800 leading-none">{item.name_ko}</div>
          <div className="text-right font-black text-emerald-600 leading-none">{item.stock_qty}pcs</div>
          <div className="text-right font-black text-slate-900 leading-none tracking-tighter">₩{item.price?.toLocaleString()}</div>
        </div>
      </div>
    ))}
  </div>
);

export const ViewSmall = ({ data, isCEO }: ViewProps) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-sans text-xs">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-widest text-[10px]">
        <tr>
          <th className="p-4">Serial</th>
          <th className="p-4">Product</th>
          <th className="p-4 text-right">Qty</th>
          <th className="p-4 text-right">Price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
            <td className="p-4 font-bold text-blue-900">{item.serial_no}</td>
            <td className="p-4 font-bold text-slate-800">{item.name_ko}</td>
            <td className="p-4 text-right font-black text-emerald-600">{item.stock_qty}</td>
            <td className="p-4 text-right font-black text-slate-900 tracking-tighter">₩{item.price?.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
