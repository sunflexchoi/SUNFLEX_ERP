export const ViewSmall = ({ data }) => (
  <div className="w-full overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
    <table className="w-full text-[13px] text-left border-collapse font-sans">
      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-tighter">
        <tr>
          <th className="px-4 py-3 min-w-[140px]">제품번호</th>
          <th className="px-4 py-3 min-w-[200px]">한글 제품명</th>
          <th className="px-4 py-3">영문 컬렉션</th>
          <th className="px-4 py-3 text-right">재고수량</th>
          <th className="px-4 py-3 text-right">판매가격</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((item) => (
          <tr key={item.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
            <td className="px-4 py-2 font-bold text-blue-900 group-hover:text-blue-600 tracking-tight">{item.serial_no}</td>
            <td className="px-4 py-2 font-semibold text-slate-800">{item.name_ko}</td>
            <td className="px-4 py-2 text-slate-400 italic font-light">{item.collection_en}</td>
            <td className="px-4 py-2 text-right font-bold text-emerald-600">{item.stock_qty?.toLocaleString()}pcs</td>
            <td className="px-4 py-2 text-right font-black text-slate-900">₩{item.price?.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
