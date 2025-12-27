import React from 'react';
import { Table, Tag, Button, Space, Tooltip, Typography } from 'antd';
import {
  CreditCardOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  formatCurrency,
  formatDate,
  getStatusVariant,
  getStatusText,
  getMethodText,
} from '../../../utils/paymentHelpers';

const { Text } = Typography;

const getStatusIcon = (status) => {
  const icons = {
    PENDING: <ClockCircleOutlined />,
    SUCCESS: <CheckCircleOutlined />,
    FAILED: <CloseCircleOutlined />,
    REFUNDED: <SyncOutlined />,
  };
  return icons[status] || <ClockCircleOutlined />;
};

const getStatusColor = (status) => {
  const colors = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    default: 'default',
    info: 'processing',
  };
  return colors[getStatusVariant(status)] || 'default';
};

const PaymentTable = ({
  payments,
  loading,
  sortField,
  sortOrder,
  onSort,
  onViewDetail,
}) => {
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'ID Giao dịch',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      render: (id, record) => (
        <div>
          <Space>
            <CreditCardOutlined style={{ color: '#bfbfbf' }} />
            <Text strong>#{id}</Text>
          </Space>
          {record.transactionId && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              {record.transactionId}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId) => `#${orderId}`,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div>
            {record.order?.user?.name || 
             record.order?.shippingInfo?.fullName || 
             'Khách vãng lai'}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.order?.user?.email || 
             record.order?.guestEmail || 
             'N/A'}
          </Text>
          {record.order?.guestPhone && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.order?.guestPhone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (method) => (
        <Tag color="blue">{getMethodText(method)}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (createdAt) => (
        <Text type="secondary">{formatDate(createdAt)}</Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record)}
          >
            Chi tiết
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter.field) {
      onSort(sorter.field);
    }
  };

  return (
    <Table
      columns={columns}
      dataSource={payments}
      loading={loading}
      rowKey="id"
      onChange={handleTableChange}
      pagination={{
        pageSize: 10,
        showTotal: (total) => `Tổng ${total} giao dịch`,
      }}
      locale={{
        emptyText: (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <DollarOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
            <div style={{ fontWeight: 500 }}>Không có giao dịch nào</div>
          </div>
        ),
      }}
    />
  );
};

export default PaymentTable;
