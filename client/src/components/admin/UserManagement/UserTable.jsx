import React from 'react';
import { Table, Avatar, Tag, Button, Space, Tooltip, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const UserTable = ({ users, currentUserId, onEdit, onDelete, onViewAddresses }) => {
  const getStatusMeta = (record) => {
    if (record.deletedAt) {
      return { color: 'default', label: 'Đã xóa mềm' };
    }

    if (record.status === 'SUSPENDED') {
      return { color: 'orange', label: 'Tạm khóa' };
    }

    return { color: 'green', label: 'Đang hoạt động' };
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      render: (name, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {(name || record.email || '?').charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ fontWeight: 500 }}>{name || '-'}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      sorter: (a, b) => (a.role || '').localeCompare(b.role || ''),
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 160,
      align: 'center',
      render: (_, record) => {
        const statusMeta = getStatusMeta(record);
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
      },
    },
    {
      title: (
        <Tooltip title="Xem chi tiết">
          <EyeOutlined />
        </Tooltip>
      ),
      key: 'addresses',
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.addresses?.length || 0) - (b.addresses?.length || 0),
      render: (_, record) => (
        <Tooltip title={`Xem chi tiết (${record.addresses?.length || 0} địa chỉ)`}>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewAddresses(record)}
            aria-label={`Xem chi tiết ${record.name || record.email || 'người dùng'}`}
          />
        </Tooltip>
      ),
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
          <Tooltip title={Number(currentUserId) === Number(record.id) ? 'Không thể tự xóa chính mình' : 'Vô hiệu hóa / Xóa mềm'}>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={Number(currentUserId) === Number(record.id)}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} người dùng`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      locale={{
        emptyText: <Empty description="Không tìm thấy người dùng" />,
      }}
      scroll={{ x: 800 }}
    />
  );
};

export default UserTable; 
