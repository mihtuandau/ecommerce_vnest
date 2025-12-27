import React from 'react';
import { Table, Avatar, Tag, Button, Space, Tooltip, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';

const UserTable = ({ users, onEdit, onDelete, onViewAddresses }) => {
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
      title: 'Địa chỉ',
      key: 'addresses',
      width: 120,
      align: 'center',
      sorter: (a, b) => (a.addresses?.length || 0) - (b.addresses?.length || 0),
      render: (_, record) => (
        <Button
          type="text"
          icon={<EnvironmentOutlined />}
          onClick={() => onViewAddresses(record)}
        >
          {record.addresses?.length || 0}
        </Button>
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
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
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
