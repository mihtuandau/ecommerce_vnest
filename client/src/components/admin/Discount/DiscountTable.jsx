import React from 'react';
import { Table } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { getColumns } from './DiscountColumns';

const DiscountTable = ({ 
  discounts = [], loading, mode = 'regular', currentPage = 1, 
  itemsPerPage = 10, total = 0, onPageChange, onSort, onEdit, onDelete 
}) => {
  const columns = getColumns(mode, { current: currentPage, pageSize: itemsPerPage, onEdit, onDelete });

  return (
    <Table
      columns={columns}
      dataSource={discounts}
      loading={loading}
      rowKey="id"
      size="small"
      scroll={{ x: 900 }}
      onChange={(_, __, sorter) => sorter.field && onSort?.(sorter.field)}
      pagination={{
        current: currentPage,
        total: total || discounts.length,
        pageSize: itemsPerPage,
        onChange: onPageChange,
        size: 'small',
        showSizeChanger: false,
        showTotal: (n) => `Tổng: ${n}`,
      }}
      locale={{
        emptyText: (
          <div className="py-8 flex flex-col items-center text-gray-400">
            <TagOutlined style={{ fontSize: 24, marginBottom: 8 }} />
            <span className="text-xs">Chưa có dữ liệu</span>
          </div>
        ),
      }}
    />
  );
};

export default DiscountTable;
