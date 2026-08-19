// components/inventory/ViewMedium.tsx (가로형 리스트)
export const ViewMedium = ({ data, config }) => (
  <div className="flex flex-col gap-2">
    {data.map(item => (
      <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer">
        <img src={item.image_url} className="w-16 h-16 object-cover rounded-md bg-slate-100" />
        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
          <div className="col-span-1 flex flex-col">
             <span className="text-[10px] text-slate-400 font-bold uppercase">No.</span>
             {renderField(item, 'serial_no')}
          </div>
          <div className="col-span-1 flex flex-col">
             <span className="text-[10px] text-slate-400 font-bold uppercase">Product</span>
             {renderField(item, 'name_ko')}
          </div>
          <div className="col-span-1">{renderField(item, 'collection_en')}</div>
          <div className="col-span-1 text-right">{renderField(item, 'stock_qty')}</div>
          <div className="col-span-1 text-right font-bold text-slate-900">{renderField(item, 'price')}</div>
        </div>
      </div>
    ))}
  </div>
);
