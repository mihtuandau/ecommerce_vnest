import React from 'react';
import { Card, List, Tag, Typography, Space, Avatar, Button, Empty } from 'antd';
import { TrophyOutlined, FireOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TopProducts = ({ products }) => {
  const getRankColor = (index) => {
    if (index === 0) return '#ffd700'; // Gold
    if (index === 1) return '#c0c0c0'; // Silver
    if (index === 2) return '#cd7f32'; // Bronze
    return '#1890ff';
  };

  const getRankIcon = (index) => {
    if (index < 3) return <TrophyOutlined style={{ color: getRankColor(index) }} />;
    return <FireOutlined style={{ color: '#1890ff' }} />;
  };

  return (
    <Card
      title={
        <Space>
          <TrophyOutlined style={{ color: '#faad14', fontSize: 18 }} />
          <Text strong style={{ fontSize: 16 }}>Sản phẩm bán chạy</Text>
        </Space>
      }
      extra={
        products.length > 5 && (
          <Tag color="orange">Top {products.length}</Tag>
        )
      }
      style={{ height: '100%' }}
    >
      <List
        grid={{ 
          gutter: 16, 
          xs: 1, 
          sm: 2, 
          md: 3,
          lg: 5,
          xl: 5,
          xxl: 5
        }}
        dataSource={products.slice(0, 5)}
        locale={{
          emptyText: <Empty description="Chưa có dữ liệu" />
        }}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: 8,
                border: index < 3 ? `2px solid ${getRankColor(index)}` : '1px solid #f0f0f0'
              }}
              bodyStyle={{ padding: 16 }}
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {/* Rank Badge */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <Avatar 
                    size={32}
                    style={{ 
                      backgroundColor: index < 3 ? getRankColor(index) : '#1890ff',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                  {getRankIcon(index)}
                </div>

                {/* Product Info */}
                <div>
                  <Text 
                    strong 
                    style={{ 
                      fontSize: 14,
                      display: 'block',
                      marginBottom: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={item.product.name}
                  >
                    {item.product.name}
                  </Text>
                  
                  <Space size={4} style={{ marginBottom: 8 }}>
                    {item.product.category?.name && (
                      <Tag color="blue" style={{ fontSize: 11, padding: '0 4px' }}>
                        {item.product.category.name}
                      </Tag>
                    )}
                    {item.product.brand?.name && (
                      <Tag color="green" style={{ fontSize: 11, padding: '0 4px' }}>
                        {item.product.brand.name}
                      </Tag>
                    )}
                  </Space>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 8,
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Đã bán</Text>
                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                      {item.totalSold}
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>
          </List.Item>
        )}
      />
      
      
      {products.length > 5 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
          <Button type="link">
            Xem tất cả {products.length} sản phẩm →
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TopProducts;
