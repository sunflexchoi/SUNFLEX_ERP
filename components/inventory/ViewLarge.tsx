import React from 'react';

export const ViewLarge = ({ data }: { data: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm h-[280px]">
        <div className="w-[280px] h-full flex-shrink-0">
          <img src={item.image_url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <p className="text-blue-600 font-bold text-xs tracking-widest uppercase">{item.serial_no}</p>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{item.name_ko}</h2>
          </div>
          <div className="border-t pt-4 flex justify-between items-end">
            <span className="text-emerald-600 font-bold uppercase text-sm">Stock: {item.stock_qty}</span>
            <span className="text-3xl font-black text-slate-900">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
