import { Card, Table } from 'antd';

const ReportTable = ({ productTableData }) => {
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
      sorter: (a, b) => a.quantity - b.quantity,
      render: (value) => value?.toLocaleString('vi-VN') || 0,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value) => new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value || 0),
    },
  ];

  return (
    <Card
      title="Sản phẩm bán chạy"
      bordered={false}
      className="shadow-sm"
    >
      <Table
        columns={productColumns}
        dataSource={productTableData}
        rowKey="rank"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sản phẩm`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default ReportTable;
