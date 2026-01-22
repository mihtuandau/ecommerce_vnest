import { Tag, Space, Checkbox, Tooltip, Button, Image } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  AppstoreOutlined 
} from '@ant-design/icons';
import { formatPrice } from '../../../utils/formatters';

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
        onChange={(e) => onSelectAllProducts(e.target.checked)}
      />
    ),
    key: 'select',
    width: 50,
    render: (_, record) => (
      <Checkbox
        checked={selectedProducts.includes(record.id)}
        onChange={(e) => onSelectProduct(record.id, e.target.checked)}
      />
    ),
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'images',
    key: 'images',
    width: 80,
    render: (images) => {
      const mainImages = images?.filter(img => !img.variantId) || [];
      const firstImage = mainImages[0];
      return firstImage ? (
        <Image
          width={60}
          height={60}
          src={firstImage.url}
          alt={firstImage.altText || 'Product'}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ) : (
        <div
          style={{
            width: 60,
            height: 60,
            background: '#f0f0f0',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          N/A
        </div>
      );
    },
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
    width: 300,
    render: (name, record) => (
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>{name}</div>
        {record.sku && (
          <div style={{ fontSize: 12, color: '#999' }}>SKU: {record.sku}</div>
        )}
      </div>
    ),
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    key: 'category',
    width: 120,
    render: (category) => (
      <Tag color="blue">{category?.name || 'N/A'}</Tag>
    ),
  },
  {
    title: 'Thương hiệu',
    dataIndex: 'brand',
    key: 'brand',
    width: 120,
    render: (brand) => (
      <Tag color="purple">{brand?.name || 'N/A'}</Tag>
    ),
  },
  {
    title: 'Giá',
    dataIndex: 'basePrice',
    key: 'price',
    width: 120,
    render: (basePrice, record) => (
      <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
        {formatPrice(basePrice || record.price || 0)}
      </span>
    ),
  },
  {
    title: 'Tồn kho',
    dataIndex: 'stock',
    key: 'stock',
    width: 100,
    render: (stock, record) => {
      let totalStock = stock || 0;
      
      if (Array.isArray(record.variants) && record.variants.length > 0) {
        totalStock = record.variants.reduce((total, variant) => 
          total + (variant.stock || 0), 0
        );
      }

      return (
        <Tag color={totalStock > 0 ? 'success' : 'error'}>
          {totalStock}
        </Tag>
      );
    },
  },
  {
    title: 'Biến thể',
    key: 'variants',
    width: 100,
    render: (_, record) => {
      const variantCount = record.variants?.length || 0;
      return (
        <Tooltip title="Quản lý biến thể">
          <Button
            type="link"
            icon={<AppstoreOutlined />}
            onClick={() => onManageVariants(record)}
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
    width: 180,
    fixed: 'right',
    render: (_, record) => (
      <Space>
        <Tooltip title="Xem chi tiết">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Xóa">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete([record.id])}
          />
        </Tooltip>
      </Space>
    ),
  },
];
