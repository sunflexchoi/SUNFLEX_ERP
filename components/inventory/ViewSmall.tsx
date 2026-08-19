export const ViewSmall = ({ data }: { data: any[] }) => (
  <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
    <table className="w-full text-sm text-left border-collapse">
      <thead className="bg-slate-50 text-slate-500 font-bold border-b">
        <tr>
          <th className="px-4 py-3">제품번호</th>
          <th className="px-4 py-3">제품명</th>
          <th className="px-4 py-3 text-right">재고</th>
          <th className="px-4 py-3 text-right">가격</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50 transition-colors">
            <td className="px-4 py-2 font-bold text-blue-800">{item.serial_no}</td>
            <td className="px-4 py-2 font-semibold text-slate-700">{item.name_ko}</td>
            <td className="px-4 py-2 text-right font-bold text-emerald-600">{item.stock_qty}</td>
            <td className="px-4 py-2 text-right font-bold">₩{item.price.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
