export const ViewLarge = ({ data }: { data: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((item) => (
      <div key={item.id} className="flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-56">
        <div className="w-56 h-full flex-shrink-0">
          <img src={item.image_url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between text-slate-900">
          <div>
            <span className="text-[10px] font-bold text-blue-600 tracking-widest">{item.serial_no}</span>
            <h2 className="text-xl font-black mt-1 leading-tight">{item.name_ko}</h2>
            <p className="text-slate-400 italic text-sm mt-1">{item.collection_en}</p>
          </div>
          <div className="flex justify-between items-end border-t pt-4">
            <span className="text-emerald-600 font-bold">In Stock: {item.stock_qty}</span>
            <span className="text-2xl font-black tracking-tighter">₩{item.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);
