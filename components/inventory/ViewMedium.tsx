export const ViewMedium = ({ data }) => (
  <div className="flex flex-col gap-3">
    {data.map((item) => (
      <div key={item.id} className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
        {/* 작은 썸네일 */}
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-inner">
          <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name_ko} />
        </div>
        
        {/* 정보 섹션 (5컬럼 배치) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Serial No.</span>
            <span className="font-bold text-blue-900 tracking-tight">{item.serial_no}</span>
          </div>
          <div className="flex flex-col col-span-1 md:col-span-1">
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Product Name</span>
            <span className="font-bold text-slate-800 truncate">{item.name_ko}</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Collection</span>
            <span className="text-slate-500 italic text-sm">{item.collection_en}</span>
          </div>
          <div className="text-right">
             <span className="md:hidden text-[10px] text-slate-400 mr-2 uppercase">Stock:</span>
             <span className="font-black text-emerald-600">{item.stock_qty?.toLocaleString()}pcs</span>
          </div>
          <div className="text-right pr-4">
             <span className="md:hidden text-[10px] text-slate-400 mr-2 uppercase">Price:</span>
             <span className="text-xl font-black text-slate-900 leading-none">₩{item.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
