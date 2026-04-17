import { Table, Image, Tag, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PictureOutlined } from '@ant-design/icons';

const BannerTable = ({
  banners,
  loading,
  currentPage = 1,
  itemsPerPage = 10,
  total = 0,
  onPageChange,
  onEdit,
  onDelete,
  onReorder,
}) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image, record) => (
        image ? (
          <Image
            src={image}
            alt={record.title}
            width={80}
            height={48}
            className="object-cover rounded-md"
            fallback="https://placehold.co/600x400?text=No+Image"
          />
        ) : (
          <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center">
            <PictureOutlined className="text-xl text-gray-400" />
          </div>
        )
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div className="font-medium text-gray-900">{title}</div>
          {record.subtitle && (
            <div className="text-xs text-gray-500 mt-0.5">{record.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Button Text',
      dataIndex: 'buttonText',
      key: 'buttonText',
      render: (text) => text || 'Mua ngay',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 140,
      render: (order, record) => (
        <Space>
          <Tag color="blue" className="rounded-full">#{order}</Tag>
          <Space direction="vertical" size={0}>
            <Tooltip title="Di chuyển lên">
              <Button type="text" size="small" icon={<ArrowUpOutlined className="text-xs" />} onClick={() => onReorder(record.id, 'up')} />
            </Tooltip>
            <Tooltip title="Di chuyển xuống">
              <Button type="text" size="small" icon={<ArrowDownOutlined className="text-xs" />} onClick={() => onReorder(record.id, 'down')} />
            </Tooltip>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active ? 'success' : 'default'} className="rounded-md">
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined className="text-blue-600" />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={banners}
      loading={loading}
      rowKey="id"
      size="middle"
      pagination={{
        current: currentPage,
        total: total || banners.length,
        pageSize: itemsPerPage,
        showSizeChanger: true,
        showTotal: (count) => `Tổng cộng ${count} banner`,
        onChange: onPageChange,
        size: 'small',
      }}
      className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-semibold"
    />
  );
};

export default BannerTable;
