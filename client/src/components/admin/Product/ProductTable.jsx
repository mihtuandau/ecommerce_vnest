import { memo } from 'react';
import { Table, Empty } from 'antd';
import { getProductTableColumns } from './productTableColumns';

const ProductTable = ({
  products = [],
  loading,
  total = 0,
  totalPages = 0,
  currentPage = 1,
  onView,
  onEdit,
  onDelete,
  onManageVariants,
  selectedProducts = [],
  onSelectAll,
  onSelectProduct,
  onPageChange,
  visibleColumns = [],
}) => {
  const columns = getProductTableColumns({
    selectedProducts,
    onSelectProduct,
    onSelectAllProducts: (checked) => onSelectAll?.(checked),
    products,
    onView,
    onEdit,
    onDelete,
    onManageVariants,
  }).filter(col => visibleColumns.length === 0 || visibleColumns.includes(col.key));

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (t) => `Hiển thị ${t} sản phẩm`,
          onChange: onPageChange,
          size: 'small',
          position: ['bottomRight'],
        }}
        locale={{
          emptyText: <Empty description="Không có sản phẩm nào" />,
        }}
        scroll={{ x: 1100 }}
        size="small"
        rowClassName={(record) => 
          `transition-colors ${selectedProducts.includes(record.id) ? 'ant-table-row-selected bg-blue-50' : 'hover:bg-gray-50'}`
        }
        className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-2 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-2 [&_.ant-table-tbody>tr>td]:overflow-hidden [&_.ant-table-tbody>tr>td]:text-ellipsis"
      />
    </div>
  );
};

export default memo(ProductTable);






