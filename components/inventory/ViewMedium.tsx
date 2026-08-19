export const ViewMedium = ({ data }: { data: any[] }) => (
  <div className="flex flex-col gap-3">
    {data.map((item) => (
      <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 hover:shadow-md transition-all">
        <img src={item.image_url} className="w-16 h-16 object-cover rounded-lg" alt="" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Serial</p><p className="font-bold text-sm leading-none">{item.serial_no}</p></div>
          <div><p className="text-[10px] text-slate-400 uppercase font-bold">Name</p><p className="font-bold text-sm leading-none">{item.name_ko}</p></div>
          <div className="text-right font-bold text-emerald-600">{item.stock_qty} pcs</div>
          <div className="text-right font-black text-slate-900">₩{item.price.toLocaleString()}</div>
        </div>
      </div>
    ))}
  </div>
);
