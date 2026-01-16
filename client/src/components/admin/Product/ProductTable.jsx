import { memo, useState } from 'react';
import { Table, Image, Tag, Space, Button, Tooltip, Empty, Checkbox, Drawer, Descriptions, Carousel, Tabs, Dropdown } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  AppstoreOutlined,
  EyeOutlined,
  CloseOutlined,
  MoreOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { formatPrice, getTotalStock, getStockStatus } from '../../../utils/formatters';

const ProductTable = ({
  products = [],
  loading,
  totalPages = 0,
  currentPage = 1,
  onEdit,
  onDelete,
  onDuplicate,
  onManageVariants,
  onRefresh,
  selectedProducts = [],
  onSelectAll,
  onSelectProduct,
  onPageChange,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setDrawerVisible(true);
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={products.length > 0 && selectedProducts.length === products.length}
          indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
          onChange={onSelectAll}
        />
      ),
      key: 'select',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedProducts.includes(record.id)}
          onChange={() => onSelectProduct(record.id)}
        />
      ),
    },
    {
      title: 'Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (name, record) => {
        const imageUrl = Array.isArray(record.images) && record.images.length > 0
          ? (typeof record.images[0] === 'string' ? record.images[0] : record.images[0]?.url)
          : null;

        return (
          <Space>
            <Image
              width={48}
              height={48}
              src={imageUrl}
              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23f0f0f0' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'%3E📦%3C/text%3E%3C/svg%3E"
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={false}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <Tooltip title={name} placement="topLeft" overlayStyle={{ zIndex: 9999 }}>
                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {name}
                </div>
              </Tooltip>
              <div style={{ fontSize: 12, color: '#999' }}>
                {record.sku || 'Chưa có SKU'}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 150,
      render: (categoryName) => (
        <Tag color="blue">{categoryName || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'basePrice',
      key: 'price',
      width: 120,
      sorter: (a, b) => (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0),
      render: (basePrice, record) => (
        <span style={{ fontWeight: 500 }}>
          {formatPrice(basePrice || record.price || 0)}
        </span>
      ),
    },
    {
      title: 'Tồn Kho',
      key: 'stock',
      width: 120,
      sorter: (a, b) => {
        const stockA = Array.isArray(a.variants) && a.variants.length > 0 
          ? getTotalStock(a.variants) 
          : Number(a.stock) || 0;
        const stockB = Array.isArray(b.variants) && b.variants.length > 0 
          ? getTotalStock(b.variants) 
          : Number(b.stock) || 0;
        return stockA - stockB;
      },
      render: (_, record) => {
        const totalStock = Array.isArray(record.variants) && record.variants.length > 0 
          ? getTotalStock(record.variants) 
          : Number(record.stock) || 0;
        const stockStatus = getStockStatus(totalStock);
        
        return (
          <Space>
            <span style={{ fontWeight: 500 }}>{totalStock}</span>
            <Tag color={
              stockStatus.color.includes('red') ? 'red' : 
              stockStatus.color.includes('yellow') ? 'orange' : 
              'green'
            }>
              {stockStatus.text}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: 'Variants',
      key: 'variants',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const hasVariants = Array.isArray(record.variants) && record.variants.length > 0;
        return hasVariants ? (
          <Button
            type="link"
            icon={<AppstoreOutlined />}
            onClick={() => onManageVariants(record)}
          >
            {record.variants.length}
          </Button>
        ) : (
          <span style={{ color: '#999' }}>—</span>
        );
      },
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'duplicate',
            icon: <CopyOutlined />,
            label: 'Nhân bản',
            onClick: () => onDuplicate(record),
          },
          Array.isArray(record.variants) && record.variants.length > 0 && {
            key: 'variants',
            icon: <AppstoreOutlined />,
            label: 'Quản lý biến thể',
            onClick: () => onManageVariants(record),
          },
          {
            type: 'divider',
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Xóa',
            danger: true,
            onClick: () => onDelete(record),
          },
        ].filter(Boolean);

        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const mainImages = selectedProduct?.images?.filter(img => !img.variantId) || [];

  return (
    <>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: totalPages * 10,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
          onChange: onPageChange,
        }}
        locale={{
          emptyText: <Empty description="Không có sản phẩm nào" />,
        }}
        scroll={{ x: 1200 }}
        rowClassName={(record) => 
          selectedProducts.includes(record.id) ? 'ant-table-row-selected' : ''
        }
      />

      <Drawer
        title={
          <Space>
            <AppstoreOutlined />
            <span>Chi tiết sản phẩm</span>
          </Space>
        }
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button 
              onClick={() => {
                onEdit(selectedProduct);
                setDrawerVisible(false);
              }} 
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Button 
              onClick={() => setDrawerVisible(false)} 
              icon={<CloseOutlined />}
            >
              Đóng
            </Button>
          </Space>
        }
      >
        {selectedProduct && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Thông tin chung',
                children: (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Hình ảnh sản phẩm */}
                    {mainImages.length > 0 && (
                      <div>
                        <h4 style={{ marginBottom: 16 }}>Hình ảnh sản phẩm</h4>
                        <Carousel autoplay style={{ background: '#f5f5f5', borderRadius: 8, overflow: 'hidden' }}>
                          {mainImages.map(img => (
                            <div key={img.id} style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
                              <img 
                                src={img.url} 
                                alt={img.altText || selectedProduct.name}
                                style={{ maxHeight: '100%', width: '100%', objectFit: 'contain' }}
                              />
                            </div>
                          ))}
                        </Carousel>
                      </div>
                    )}

                    {/* Thông tin cơ bản */}
                    <Descriptions title="Thông tin cơ bản" bordered column={1}>
                      <Descriptions.Item label="Tên sản phẩm">{selectedProduct.name}</Descriptions.Item>
                      <Descriptions.Item label="SKU">{selectedProduct.sku || 'Chưa có SKU'}</Descriptions.Item>
                      <Descriptions.Item label="Danh mục">
                        <Tag color="blue">{selectedProduct.category?.name || 'N/A'}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Thương hiệu">
                        <Tag color="purple">{selectedProduct.brand?.name || 'N/A'}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Giá cơ bản">
                        <span style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
                          {formatPrice(selectedProduct.basePrice || selectedProduct.price || 0)}
                        </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="Tồn kho">
                        {Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 
                          ? `${getTotalStock(selectedProduct.variants)} (từ ${selectedProduct.variants.length} biến thể)`
                          : selectedProduct.stock || 0
                        }
                      </Descriptions.Item>
                      <Descriptions.Item label="Mô tả">
                        {selectedProduct.description || 'Chưa có mô tả'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                ),
              },
              {
                key: '2',
                label: `Biến thể (${selectedProduct.variants?.length || 0})`,
                children: (
                  <div>
                    {/* Nút thêm biến thể */}
                    <div style={{ marginBottom: 16, textAlign: 'right' }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          onManageVariants(selectedProduct);
                          setDrawerVisible(false);
                        }}
                      >
                        Thêm biến thể
                      </Button>
                    </div>

                    {Array.isArray(selectedProduct.variants) && selectedProduct.variants.length > 0 ? (
                      <Table
                        dataSource={selectedProduct.variants}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    columns={[
                      {
                        title: 'Hình ảnh',
                        key: 'images',
                        width: 100,
                        render: (_, variant) => {
                          const variantImages = selectedProduct.images?.filter(img => img.variantId === variant.id) || [];
                          return variantImages.length > 0 ? (
                            <Image.PreviewGroup>
                              <Space>
                                {variantImages.slice(0, 2).map(img => (
                                  <Image 
                                    key={img.id}
                                    width={40} 
                                    height={40} 
                                    src={img.url} 
                                    style={{ objectFit: 'cover', borderRadius: 4 }}
                                  />
                                ))}
                                {variantImages.length > 2 && (
                                  <Tag>+{variantImages.length - 2}</Tag>
                                )}
                              </Space>
                            </Image.PreviewGroup>
                          ) : <span style={{ color: '#999' }}>—</span>;
                        },
                      },
                      {
                        title: 'Size',
                        dataIndex: 'size',
                        key: 'size',
                        render: (size) => <Tag color="geekblue">{size || '—'}</Tag>,
                      },
                      {
                        title: 'Màu',
                        dataIndex: 'color',
                        key: 'color',
                        render: (color) => <Tag color="magenta">{color || '—'}</Tag>,
                      },
                      {
                        title: 'SKU',
                        dataIndex: 'sku',
                        key: 'sku',
                        render: (sku) => <span style={{ fontSize: 12, color: '#999' }}>{sku || '—'}</span>,
                      },
                      {
                        title: 'Giá',
                        dataIndex: 'price',
                        key: 'price',
                        render: (price) => (
                          <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                            {formatPrice(price)}
                          </span>
                        ),
                      },
                      {
                        title: 'Tồn kho',
                        dataIndex: 'stock',
                        key: 'stock',
                        render: (stock) => (
                          <Tag color={stock > 0 ? 'success' : 'error'}>
                            {stock}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Thao tác',
                        key: 'actions',
                        render: (_, variant) => (
                          <Space>
                            <Button
                              type="link"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => {
                                onManageVariants(selectedProduct, variant);
                                setDrawerVisible(false);
                              }}
                            >
                              Sửa
                            </Button>
                            <Button
                              type="link"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={async () => {
                                if (window.confirm(`Xóa variant "${variant.size} - ${variant.color}"?`)) {
                                  try {
                                    const productService = (await import('../../../services/productService')).default;
                                    await productService.deleteVariant(variant.id);
                                    if (onRefresh) {
                                      onRefresh();
                                    }
                                    setDrawerVisible(false);
                                  } catch (error) {
                                    console.error('Error deleting variant:', error);
                                  }
                                }
                              }}
                            >
                              Xóa
                            </Button>
                          </Space>
                        ),
                      },
                    ]}
                  />
                ) : (
                  <Empty 
                    description="Sản phẩm chưa có biến thể" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <p style={{ color: '#999', fontSize: 13 }}>
                      Click nút "Thêm biến thể" ở trên để tạo biến thể mới
                    </p>
                  </Empty>
                )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </>
  );
};

export default memo(ProductTable);