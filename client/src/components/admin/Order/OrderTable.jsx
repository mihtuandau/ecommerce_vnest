import { useState } from 'react';
import { Table, Tag, Space, Button, Tooltip, Empty, Typography } from 'antd';
import { 
  EyeOutlined, 
  SyncOutlined, 
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import Badge from '../../common/Badge';
import { formatCurrency, formatDate, statusVariants, statusLabels } from '../../../utils/orderHelpers';

const { Text } = Typography;

const OrderTable = ({ 
  orders = [], 
  loading, 
  sortBy, 
  sortDir, 
  onSort, 
  onViewDetails, 
  onSyncPayment 
}) => {
  const [syncingPaymentId, setSyncingPaymentId] = useState(null);

  const handleSyncPayment = async (e, paymentId) => {
    e.stopPropagation();
    setSyncingPaymentId(paymentId);
    try {
      await onSyncPayment(paymentId);
    } catch (error) {
      console.error('Sync payment error:', error);
    } finally {
      setSyncingPaymentId(null);
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS': return 'success';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'default';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  const getOrderStatusColor = (status) => {
    const variants = {
      PENDING: 'warning',
      PROCESSING: 'processing',
      SHIPPED: 'blue',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return variants[status] || 'default';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
          #{id}
        </Text>
      )
    },
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 120,
      render: (code, record) => (
        <Text strong style={{ fontSize: 13 }}>
          {code || `#${record.id}`}
        </Text>
      )
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <Text style={{ display: 'block', fontSize: 13, fontWeight: 500 }}>
            {record.user?.name || 
             record.shippingInfo?.fullName || 
             record.guestEmail || 
             'Khách vãng lai'}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.user?.email || 
             record.guestEmail || 
             record.guestPhone || 
             'N/A'}
          </Text>
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: 130,
      sorter: true,
      render: (total) => (
        <Text strong style={{ fontSize: 13 }}>
          {formatCurrency(total)}
        </Text>
      )
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 150,
      render: (_, record) => {
        if (!record.payment) {
          return (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Chưa có
            </Text>
          );
        }
        
        const paymentIcon = record.payment.method === 'CASH' ? <DollarOutlined /> : <CreditCardOutlined />;

        return (
          <Space direction="vertical" size={2}>
            <Space size={4}>
              <span className="text-gray-500">{paymentIcon}</span>
              <Text style={{ fontSize: 11, fontWeight: 500 }}>
                {record.payment.method === 'CASH' ? 'COD' : record.payment.method}
              </Text>
              {record.payment.status === 'PENDING' && 
               record.payment.method === 'PAYOS' && (
                <Button
                  type="text"
                  size="small"
                  icon={<SyncOutlined spin={syncingPaymentId === record.payment.id} />}
                  onClick={(e) => handleSyncPayment(e, record.payment.id)}
                  disabled={syncingPaymentId === record.payment.id}
                  title="Kiểm tra trạng thái thanh toán"
                  style={{ padding: 0, height: 'auto' }}
                />
              )}
            </Space>
            <Tag 
              color={getPaymentStatusColor(record.payment.status)} 
              style={{ fontSize: 10, margin: 0 }}
            >
              {record.payment.status === 'SUCCESS' && <span><CheckCircleOutlined /> Đã TT</span>}
              {record.payment.status === 'PENDING' && <span><ClockCircleOutlined /> Chờ</span>}
              {record.payment.status === 'FAILED' && <span><CloseCircleOutlined /> Lỗi</span>}
              {record.payment.status === 'CANCELLED' && <span><CloseCircleOutlined /> Hủy</span>}
            </Tag>
          </Space>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getOrderStatusColor(status)}>
          {statusLabels[status] || status}
        </Tag>
      )
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: true,
      defaultSortOrder: 'descend',
      render: (date) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatDate(date)}
        </Text>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'right',
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(record)}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng ${total} đơn hàng`,
        pageSizeOptions: ['10', '20', '50', '100']
      }}
      locale={{
        emptyText: <Empty description="Không tìm thấy đơn hàng phù hợp" />
      }}
      scroll={{ x: 1100 }}
      onChange={(pagination, filters, sorter) => {
        if (sorter.field) {
          onSort(sorter.field);
        }
      }}
    />
  );
};

export default OrderTable;