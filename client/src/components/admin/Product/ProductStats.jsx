import { Card, Row, Col, Statistic } from 'antd';
import { 
  AppstoreOutlined, 
  DollarOutlined, 
  WarningOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons';

const ProductStats = ({ products, formatPrice, getTotalStock }) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => {
    const stock = getTotalStock?.(p.variants) ?? 0;
    return sum + (Number(p.basePrice) || 0) * stock;
  }, 0);
  const lowStock = products.filter((p) => {
    const stock = getTotalStock(p.variants);
    return stock > 0 && stock < 10;
  }).length;
  const outOfStock = products.filter((p) => getTotalStock(p.variants) === 0).length;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="Tổng sản phẩm"
            value={totalProducts}
            prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
            // antd v5+: valueStyle deprecated -> styles.content
            styles={{ content: { color: '#000', fontWeight: 600 } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="Tổng giá trị kho"
            value={totalValue}
            prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
            suffix="₫"
            styles={{ content: { color: '#000', fontWeight: 600 } }}
            formatter={(value) => formatPrice(value).replace('₫', '')}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="Low Stock"
            value={lowStock}
            prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            styles={{ content: { color: '#000', fontWeight: 600 } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable>
          <Statistic
            title="Hết hàng"
            value={outOfStock}
            prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            styles={{ content: { color: '#000', fontWeight: 600 } }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ProductStats;
