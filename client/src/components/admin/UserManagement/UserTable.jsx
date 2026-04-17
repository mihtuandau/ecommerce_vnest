import React from 'react';
import { Table, Avatar, Tag, Button, Space, Tooltip, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const UserTable = ({ users, currentUserId, hasPermission, currentPage = 1, itemsPerPage = 10, total = 0, onPageChange, onEdit, onDelete, onViewAddresses }) => {
  const getStatusMeta = (record) => {
    if (record.deletedAt) {
      return { color: 'default', label: 'Đã xóa mềm' };
    }

    if (record.status === 'SUSPENDED') {
      return { color: 'orange', label: 'Tạm khóa' };
    }

    if (record.status === 'PENDING') {
      return { color: 'blue', label: 'Chờ xác thực' };
    }

    return { color: 'green', label: 'Đang hoạt động' };
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => (currentPage - 1) * itemsPerPage + index + 1,
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
      render: (role) => {
        let color = 'blue';
        let label = 'Khách hàng';
        
        switch(role) {
          case 'ADMIN': color = 'red'; label = 'Admin'; break;
          case 'KHO': color = 'emerald'; label = 'Thủ kho'; break;
          case 'BAN_HANG': color = 'orange'; label = 'Bán hàng'; break;
          default: color = 'blue'; label = 'Khách hàng';
        }

        return <Tag color={color}>{label}</Tag>;
      },
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
      title: 'Chi tiết',
      key: 'addresses',
      width: 120,
      align: 'center',
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
  ].filter(col => col.key !== 'actions' || hasPermission?.('user.manage'));

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{
        current: currentPage,
        total: total || users.length,
        pageSize: itemsPerPage,
        showSizeChanger: true,
        showTotal: (count) => `Hiển thị ${count} người dùng`,
        onChange: onPageChange,
        size: 'small',
        position: ['bottomRight'],
      }}
      size="small"
      locale={{
        emptyText: <Empty description="Không tìm thấy người dùng" />,
      }}
      scroll={{ x: 800 }}
      className="[&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:font-medium [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-thead>tr>th]:border-b [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:px-2 [&_.ant-table-thead>tr>th]:py-2 [&_.ant-table-tbody>tr>td]:px-2 [&_.ant-table-tbody>tr>td]:py-2"
    />
  );
};

export default UserTable; 
