import { Tag, Checkbox, Tooltip, Button, Image, Dropdown } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  MoreOutlined,
  StarFilled,
} from '@ant-design/icons';
import { formatPrice } from '../../../utils/formatters';

const ACCENT_TEXT_CLASS = 'text-[#37A76B] hover:text-[#2E955F]';
const CATEGORY_TAG_CLASS = 'text-xs bg-[#F3FBF6] border-[#CDEBD9] text-[#2E7D55]';

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
    title: 'Sản phẩm',
    key: 'product',
    width: 280,
    ellipsis: true,
    render: (_, record) => {
      const mainImages = record.images?.filter((img) => !img.variantId) || [];
      const firstImage = mainImages[0];
      const brandName = record.brand?.name || '—';
      return (
        <div className="flex items-center gap-2 py-1 max-w-full">
          <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden border border-gray-200 bg-gray-100">
            {firstImage?.url ? (
              <Image
                width={40}
                height={40}
                src={firstImage.url}
                alt=""
                style={{ objectFit: 'cover' }}
                preview={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                N/A
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <button
              type="button"
              onClick={() => onView?.(record)}
              className="text-left font-medium text-gray-900 hover:text-[#2E955F] hover:underline focus:outline-none block w-full truncate text-sm transition-colors"
              title={record.name}
            >
              {record.name}
            </button>
            <div className="text-[11px] text-gray-500 truncate w-full" title={brandName}>{brandName}</div>
          </div>
        </div>
      );
    },
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    width: 100,
    render: (_, record) => (
      <span className="text-gray-600 font-mono text-xs">{getProductSku(record)}</span>
    ),
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    key: 'category',
    width: 100,
    render: (category) => (
      <Tag className={CATEGORY_TAG_CLASS}>{category?.name || 'N/A'}</Tag>
    ),
  },
  {
    title: 'Giá',
    dataIndex: 'basePrice',
    key: 'price',
    width: 100,
    render: (basePrice, record) => (
      <span className="font-semibold text-emerald-600 text-sm">
        {formatPrice(basePrice || record.price || 0)}
      </span>
    ),
  },
  {
    title: 'Tồn kho',
    key: 'stock',
    width: 90,
    render: (_, record) => {
      const total = getTotalStock(record);
      return (
        <Tag color={total > 0 ? 'success' : 'error'} className="text-xs">
          {total}
        </Tag>
      );
    },
  },
  {
    title: 'Đã bán',
    dataIndex: 'soldCount',
    key: 'sold',
    width: 70,
    render: (v) => <span className="text-gray-700 text-sm">{v ?? 0}</span>,
  },
  {
    title: 'Đánh giá',
    key: 'rating',
    width: 90,
    render: (_, record) => {
      const rating = record.averageRating ?? 0;
      const count = record.reviewCount ?? 0;
      return (
        <span className="text-gray-700 text-xs">
          <StarFilled style={{ color: '#faad14', marginRight: 2, fontSize: 12 }} />
          {Number(rating).toFixed(1)} {count > 0 && <span className="text-gray-500">({count})</span>}
        </span>
      );
    },
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 90,
    render: (_, record) => (
      <Tag color={record.isActive !== false ? 'success' : 'default'} className="text-xs">
        {record.isActive !== false ? 'Đang bán' : 'Ngừng bán'}
      </Tag>
    ),
  },
  {
    title: 'Biến thể',
    key: 'variants',
    width: 70,
    render: (_, record) => {
      const variantCount = record.variants?.length || 0;
      return (
        <Tooltip title="Quản lý biến thể">
          <Button
            type="link"
            icon={<AppstoreOutlined />}
            onClick={() => onManageVariants(record)}
            className={`p-0 text-xs ${ACCENT_TEXT_CLASS}`}
            size="small"
          >
            {variantCount > 0 ? variantCount : 'Thêm'}
          </Button>
        </Tooltip>
      );
    },
  },
  {
    title: 'Thao tác',
    key: 'actions',
    width: 60,
    fixed: 'right',
    render: (_, record) => (
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            {
              key: 'view',
              icon: <EyeOutlined />,
              label: 'Xem chi tiết',
              onClick: () => onView(record),
            },
            {
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Chỉnh sửa',
              onClick: () => onEdit(record),
            },
            { type: 'divider' },
            {
              key: 'delete',
              icon: <DeleteOutlined />,
              label: 'Xóa',
              danger: true,
              onClick: () => onDelete(record),
            },
          ],
        }}
        placement="bottomRight"
      >
        <Button type="text" icon={<MoreOutlined />} className="p-0" size="small" />
      </Dropdown>
    ),
  },
];
