// components/inventory/ViewSmall.tsx (탐색기 형태)
export const ViewSmall = ({ data, config }) => (
  <div className="w-full overflow-x-auto bg-white rounded-lg border border-slate-200">
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
        <tr>
          {config.visible_fields.map(field => (
            <th key={field} className="px-4 py-2 uppercase tracking-wider">{field}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map(item => (
          <tr key={item.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => onOpenDetail(item)}>
            {config.visible_fields.map(field => (
              <td key={field} className="px-4 py-2 whitespace-nowrap">
                {renderField(item, field)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
