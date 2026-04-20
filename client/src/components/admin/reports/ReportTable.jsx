import { useMemo, useState } from 'react';
import { Card, Table } from 'antd';

const ReportTable = ({ productTableData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortState, setSortState] = useState({ field: null, order: null });
  const productColumns = [
    {
      title: 'Xếp hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true,
      render: (value) => value?.toLocaleString('vi-VN') || 0,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: true,
      render: (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value || 0),
    },
  ];

  const sortedData = useMemo(() => {
    const source = Array.isArray(productTableData) ? [...productTableData] : [];
    if (!sortState.field || !sortState.order) return source;

    const direction = sortState.order === 'ascend' ? 1 : -1;
    source.sort((a, b) => {
      const va = Number(a?.[sortState.field] || 0);
      const vb = Number(b?.[sortState.field] || 0);
      if (va < vb) return -1 * direction;
      if (va > vb) return 1 * direction;
      return 0;
    });

    return source;
  }, [productTableData, sortState]);

  return (
    <Card
      title="Sản phẩm bán chạy"
      bordered={false}
      className="shadow-sm"
    >
      <Table
        columns={productColumns}
        dataSource={sortedData}
        rowKey="rank"
        size="small"
        pagination={{
          current: currentPage,
          total: sortedData.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Hiển thị ${total} sản phẩm`,
          onChange: (page) => setCurrentPage(page),
          size: 'small',
          position: ['bottomRight'],
        }}
        onChange={(_, __, sorter) => {
          const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
          setSortState({
            field: activeSorter?.field || null,
            order: activeSorter?.order || null,
          });
          setCurrentPage(1);
        }}
        scroll={{ x: 800 }}
        className="[&_.ant-table-thead>tr>th]:bg-slate-50/50 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-slate-800 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-slate-100 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-4 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-3"
      />
    </Card>
  );
};

export default ReportTable;






