// components/inventory/FieldRenderer.tsx
const renderField = (item, fieldKey) => {
  switch (fieldKey) {
    case 'serial_no':
      return <span className="font-bold tracking-tight text-blue-900">{item.serial_no}</span>;
    case 'name_ko':
      return <span className="font-medium text-slate-800">{item.name_ko}</span>;
    case 'collection_en':
      return <span className="text-sm text-slate-400 italic">{item.collection_en}</span>;
    case 'stock_qty':
      return <span className="font-semibold text-emerald-600 text-right">{item.stock_qty.toLocaleString()}pcs</span>;
    case 'price':
      return <span className="font-bold text-right">₩{item.price.toLocaleString()}</span>;
    default:
      return <span>{item[fieldKey]}</span>;
  }
};
