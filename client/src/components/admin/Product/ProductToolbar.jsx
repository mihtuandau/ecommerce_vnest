import { Input, Select, Button, Space, Badge } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const ProductToolbar = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedProducts,
  onBulkDelete,
  onAddProduct
}) => {
  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      padding: 16, 
      marginBottom: 24,
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)'
    }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
        <Input
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          size="large"
          allowClear
        />

        <Space wrap>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 200 }}
            size="large"
            placeholder="All Categories"
          >
            <Option value="">All Categories</Option>
            {categories.map(cat => (
              <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            ))}
          </Select>

          <Button 
            type="default" 
            icon={<FilterOutlined />}
            size="large"
          />

          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={onAddProduct}
            size="large"
            // style ={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
          >
            Add Product
          </Button>
        </Space>
      </Space>

      {selectedProducts.length > 0 && (
        <div style={{ 
          marginTop: 16, 
          padding: '12px 16px', 
          background: '#e6f7ff', 
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Badge 
            count={selectedProducts.length} 
            style={{ backgroundColor: '#1890ff' }}
          >
            <span style={{ marginRight: 8, color: '#0050b3', fontWeight: 500 }}>
              selected
            </span>
          </Badge>
          <Button 
            danger
            icon={<DeleteOutlined />}
            onClick={onBulkDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductToolbar;