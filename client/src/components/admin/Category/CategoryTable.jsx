import { Table, Image, Button, Space, Tooltip, Empty, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CategoryTable = ({
  categories,
  loading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  currentPage = 1,
  itemsPerPage = 10,
  total = 0,
  onPageChange,
}) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <Text type="secondary">{(currentPage - 1) * itemsPerPage + index + 1}</Text>
      )
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => (
        image ? (
          <Image
            width={48}
            height={48}
            src={image}
            alt={record.name}
            style={{ objectFit: 'cover', borderRadius: 8 }}
            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect fill='%23f0f0f0' width='48' height='48'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'%3E📁%3C/text%3E%3C/svg%3E"
          />
        ) : (
          <div style={{ 
            width: 48, 
            height: 48, 
            background: '#f0f0f0', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <PictureOutlined style={{ fontSize: 24, color: '#999' }} />
          </div>
        )
      )
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name, record) => (
        <div>
          <Text strong style={{ display: 'block', fontSize: 13 }}>{name}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 11 }}>{record.description}</Text>
          )}
        </div>
      )
    },
    {
      title: 'Số sản phẩm',
      key: 'products',
      width: 150,
      align: 'center',
      sorter: true,
      render: (_, record) => (
        <Text strong style={{ 
          display: 'inline-flex', 
          padding: '4px 12px', 
          borderRadius: 16, 
          background: '#f0f0f0',
          fontSize: 12
        }}>
          {record._count?.products || 0} sản phẩm
        </Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="id"
      loading={loading}
      size="small"
      pagination={{
        current: currentPage,
        total: total || categories.length,
        pageSize: itemsPerPage,
        showSizeChanger: true,
        showTotal: (count) => `Hiển thị ${count} danh mục`,
        onChange: onPageChange,
        size: 'small',
        position: ['bottomRight'],
      }}
      locale={{
        emptyText: <Empty description="Không tìm thấy danh mục nào" />
      }}
      scroll={{ x: 800 }}
      onChange={(pagination, filters, sorter) => {
        if (sorter.field) {
          onSort(sorter.field);
        }
      }}
      className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-2 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-2"
    />
  );
};

export default CategoryTable;






