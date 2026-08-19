export const ViewLarge = ({ data }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group h-[280px]">
        {/* 큰 정사각형 이미지 */}
        <div className="w-[280px] h-full flex-shrink-0 overflow-hidden border-r">
          <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name_ko} />
        </div>
        
        {/* 정보 텍스트 */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black tracking-tighter uppercase">Premium Crystal</span>
              <span className="text-emerald-600 font-black text-lg">{item.stock_qty?.toLocaleString()}pcs</span>
            </div>
            
            <div className="mt-4">
              <p className="text-blue-900 text-xs font-bold tracking-widest uppercase leading-none mb-1">{item.serial_no}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{item.name_ko}</h2>
              <p className="text-slate-400 font-medium italic mt-1">{item.collection_en}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-between items-baseline">
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Sunflex Luxury ERP</span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
