// components/inventory/ViewLarge.tsx (룩북 형태)
export const ViewLarge = ({ data, config }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map(item => (
      <div key={item.id} className="flex gap-6 bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-xl transition-all cursor-pointer overflow-hidden">
        <div className="w-48 h-48 flex-shrink-0">
          <img src={item.image_url} className="w-full h-full object-cover rounded-lg shadow-inner" />
        </div>
        <div className="flex flex-col justify-between py-2 flex-1">
          <div>
            <div className="flex justify-between items-start">
               {renderField(item, 'serial_no')}
               {renderField(item, 'stock_qty')}
            </div>
            <h3 className="text-xl font-bold mt-2 text-slate-900">{item.name_ko}</h3>
            <p className="text-slate-400 italic">{item.collection_en}</p>
          </div>
          <div className="border-t pt-4 flex justify-between items-end">
            <span className="text-xs text-slate-400 italic font-medium">SUNFLEX LUXURY LINE</span>
            <span className="text-2xl font-black text-slate-900">{renderField(item, 'price')}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
