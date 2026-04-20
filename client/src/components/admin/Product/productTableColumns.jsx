import { Checkbox, Dropdown, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { formatPrice, formatDate } from '../../../utils/formatters';
import { Star, AlertTriangle } from 'lucide-react';

const getTotalStock = (record) => {
  if (Array.isArray(record.variants) && record.variants.length > 0) {
    return record.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return record.stock || 0;
};

const getProductSku = (record) => {
  if (record.sku) return record.sku;
  const first = record.variants?.[0];
  return first?.sku || '—';
};

export const getProductTableColumns = ({
  selectedProducts,
  onSelectProduct,
  onSelectAllProducts,
  products,
  onView,
  onEdit,
  onDelete,
  onManageVariants,
}) => [
  {
    title: (
      <Checkbox
        checked={selectedProducts.length === products.length && products.length > 0}
        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
        onChange={(e) => onSelectAllProducts?.(e.target.checked)}
      />
    ),
    key: 'select',
    width: 40,
    render: (_, record) => (
      <Checkbox
        checked={selectedProducts.includes(record.id)}
        onChange={(e) => onSelectProduct(record.id, e.target.checked)}
      />
    ),
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Sản phẩm</span>,
    key: 'product',
    width: 320,
    render: (_, record) => {
      const mainImages = record.images?.filter((img) => !img.variantId) || [];
      const firstImage = mainImages[0];
      const variantCount = record.variants?.length || 0;
      
      return (
        <div className="flex items-center gap-3 py-2">
          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {firstImage?.url ? (
              <img src={firstImage.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 text-xs">N/A</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-slate-800 truncate" title={record.name}>
              {record.name}
            </span>
            <div className="text-xs text-slate-800 truncate mt-0.5">
              {variantCount > 0 ? `${variantCount} biến thể • ` : ''}
              {getProductSku(record)}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Danh mục / Thương hiệu</span>,
    key: 'category',
    width: 180,
    render: (_, record) => (
      <div className="flex flex-col items-start gap-1">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">
          {record.category?.name || 'N/A'}
        </span>
        <span className="text-[11px] font-medium text-blue-600 px-2">
          {record.brand?.name || '—'}
        </span>
      </div>
    ),
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Giá</span>,
    dataIndex: 'basePrice',
    key: 'price',
    width: 140,
    render: (basePrice, record) => (
      <span className="font-semibold text-slate-800 text-sm">
        {formatPrice(basePrice || record.price || 0)}
      </span>
    ),
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Tồn kho</span>,
    key: 'stock',
    width: 120,
    render: (_, record) => {
      const total = getTotalStock(record);
      if (total === 0) {
        return (
          <div className="flex items-center gap-1.5 text-red-500 font-semibold text-sm">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>0</span>
          </div>
        );
      }
      if (total < 50) {
        return (
          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs font-semibold">
            <AlertTriangle size={12} strokeWidth={3} />
            <span>{total} (thấp)</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5 text-emerald-500 font-semibold text-sm px-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>{total}</span>
        </div>
      );
    },
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Đã bán</span>,
    dataIndex: 'soldCount',
    key: 'sold',
    width: 100,
    render: (v) => <span className="font-semibold text-slate-800 text-sm">{v ?? 0}</span>,
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Rating</span>,
    key: 'rating',
    width: 120,
    render: (_, record) => {
      const rating = record.averageRating ?? 0;
      const count = record.reviewCount ?? 0;
      return (
        <div className="flex items-center gap-1">
          <Star className="text-amber-400 fill-amber-400" size={14} />
          <span className="font-semibold text-slate-800 text-sm">{Number(rating).toFixed(1)}</span>
          {count > 0 && <span className="text-slate-800 text-xs">({count})</span>}
        </div>
      );
    },
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Trạng thái</span>,
    key: 'status',
    width: 120,
    render: (_, record) => (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${record.isActive !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${record.isActive !== false ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
        {record.isActive !== false ? 'Đang bán' : 'Ngừng bán'}
      </span>
    ),
  },
  {
    title: <span className="text-slate-800 font-semibold text-xs tracking-wider uppercase">Ngày tạo</span>,
    key: 'createdAt',
    width: 120,
    render: (_, record) => (
      <span className="text-slate-800 text-xs">
        {formatDate(record.createdAt)}
      </span>
    ),
  },
  {
    title: '',
    key: 'actions',
    width: 50,
    fixed: 'right',
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            { key: 'view', label: 'Xem chi tiết', onClick: () => onView(record) },
            { key: 'edit', label: 'Chỉnh sửa', onClick: () => onEdit(record) },
            { key: 'variants', label: 'Quản lý biến thể', onClick: () => onManageVariants(record) },
            { type: 'divider' },
            { key: 'delete', label: 'Xóa', danger: true, onClick: () => onDelete(record) },
          ],
        }}
        trigger={['click']}
        placement="bottomRight"
      >
        <Button type="text" icon={<MoreOutlined rotate={90} className="text-gray-400" />} />
      </Dropdown>
    ),
  },
];






