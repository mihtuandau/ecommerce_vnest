import React from 'react';
import { Card, List, Tag, Typography, Space, Button, Empty } from 'antd';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { formatPrice, formatDateTime } from '../../../utils/formatters';

const { Text, Title } = Typography;

const RecentOrders = ({ orders }) => {
  const formatCurrency = formatPrice;
  const formatDate = formatDateTime;

  const getOrderStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      PROCESSING: 'processing',
      SHIPPED: 'blue',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      PENDING: 'Chờ xử lý',
      PROCESSING: 'Đang xử lý',
      SHIPPED: 'Đang giao',
      DELIVERED: 'Đã giao',
      CANCELLED: 'Đã hủy',
    };
    return texts[status] || status;
  };

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 18 }} />
          <Text strong style={{ fontSize: 16 }}>Đơn hàng gần đây</Text>
        </Space>
      }
      extra={
        orders.length > 5 && (
          <Tag color="blue">{orders.length} đơn hàng</Tag>
        )
      }
      style={{ height: '100%' }}
    >
      <List
        dataSource={orders.slice(0, 5)}
        locale={{
          emptyText: <Empty description="Chưa có đơn hàng nào" />
        }}
        renderItem={(order) => (
          <List.Item
            key={order.id}
            style={{ 
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              marginBottom: 12,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            className="hover-list-item"
            actions={[
              <Button 
                type="link" 
                icon={<EyeOutlined />}
                size="small"
              >
                Xem
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{order.orderCode || `#${order.id}`}</Text>
                  <Tag color={getOrderStatusColor(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={2}>
                  <Text type="secondary">
                    {order.user ? order.user.name : (order.guestEmail || 'Khách vãng lai')}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatDate(order.createdAt)}
                  </Text>
                </Space>
              }
            />
            <div>
              <Text strong style={{ fontSize: 16 }}>{formatCurrency(order.total)}</Text>
            </div>
          </List.Item>
        )}
      />
      
      
      {orders.length > 5 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <Button type="link">
            Xem tất cả {orders.length} đơn hàng →
          </Button>
        </div>
      )}
      
      <style>{`
        .hover-list-item:hover {
          background-color: #fafafa;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
      `}</style>
    </Card>
  );
};

export default RecentOrders;