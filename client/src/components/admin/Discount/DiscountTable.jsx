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
          <div className="py-8 flex flex-col items-center text-gray-500 font-semibold">
            <TagOutlined style={{ fontSize: 24, marginBottom: 8 }} />
            <span className="text-xs">Chưa có dữ liệu</span>
          </div>
        ),
      }}
      className="[&_.ant-table-thead>tr>th]:bg-slate-50/50 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-slate-800 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-slate-100 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-3"
    />
  );
};

export default DiscountTable;
