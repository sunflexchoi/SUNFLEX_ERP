import React from 'react';

interface ViewProps {
  data: any[];
  isCEO?: boolean; // ?를 붙여서 필수가 아닌 '선택'으로 바꿨습니다 (에러 방지 핵심)
}

export const ViewLarge = ({ data, isCEO = false }: ViewProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm h-[280px]">
        <div className="w-[280px] h-full flex-shrink-0 bg-slate-50 border-r">
          <img src={item.image_url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-between text-slate-900">
          <div>
            <p className="text-blue-600 font-bold text-[10px] tracking-[0.2em] uppercase">{item.serial_no}</p>
            <h2 className="text-2xl font-black mt-2 tracking-tighter leading-none">{item.name_ko}</h2>
          </div>
          <div className="border-t pt-4 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider font-sans">Stock: {item.stock_qty}</span>
              {isCEO && <span className="text-rose-500 font-bold text-[10px] uppercase tracking-tighter italic">Cost: ₩{item.cost_price?.toLocaleString()}</span>}
            </div>
            <span className="text-3xl font-black tracking-tighter leading-none font-sans italic">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ViewMedium, ViewSmall은 이전과 같으므로 생략하지만, 
// 파일 첫 줄의 interface ViewProps 부분에 ? 가 붙어있는지가 중요합니다.
