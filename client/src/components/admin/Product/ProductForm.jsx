import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { 
  DollarOutlined, 
  InboxOutlined, 
  FileTextOutlined,
  TagOutlined 
} from '@ant-design/icons';
import ImageUploadSection from './ImageUploadSection';
import productService from '../../../services/productService';
import { notify } from '../../../utils/notification';

const { TextArea } = Input;
const { Option } = Select;

const ProductForm = ({ product, categories = [], brands = [], onClose, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [images, setImages] = useState(product?.images?.filter(img => !img.variantId) || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name || '',
        basePrice: product.basePrice || '',
        stock: product.stock || '',
        description: product.description || '',
        categoryId: product.categoryId,
        brandId: product.brandId,
      });
      setImages(product?.images?.filter(img => !img.variantId) || []);
    }
  }, [product, form]);

  const refreshProduct = async () => {
    if (!currentProduct?.id) return;
    try {
      const res = await productService.getOne(currentProduct.id);
      const p = res?.data || res;
      setCurrentProduct(p);
      setImages(p?.images?.filter(img => !img.variantId) || []);
    } catch (err) {
      console.error('Error refreshing product:', err);
    }
  };

  const handleImageUpload = async (e) => {
    if (!currentProduct?.id) {
      notify.error('Vui lòng lưu sản phẩm trước khi upload ảnh');
      return;
    }
    const files = Array.from(e.target.files || []).filter(f => f && f.size > 0);
    if (!files.length) return;
    
    setUploading(true);
    try {
      await productService.uploadImages(currentProduct.id, files);
      notify.success('Upload ảnh thành công');
      await refreshProduct();
    } catch (err) {
      notify.error(err?.response?.data?.message || 'Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (img) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await productService.deleteImage(img.id);
      notify.success('Đã xóa ảnh');
      await refreshProduct();
    } catch (err) {
      notify.error('Không thể xóa ảnh');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const submitData = {
        ...values,
        categoryId: values.categoryId ? Number(values.categoryId) : null,
        brandId: values.brandId ? Number(values.brandId) : null,
        basePrice: Number(values.basePrice),
        stock: Number(values.stock) || 0,
      };
      
      const result = await onSave(submitData);
      
      // Nếu là tạo mới, cập nhật currentProduct để có thể upload ảnh
      if (!product && result?.id) {
        setCurrentProduct(result);
        notify.success('Đã tạo sản phẩm! Bạn có thể upload ảnh ngay bây giờ.');
      } else {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // Error handled by parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      title={product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
      width={600}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          basePrice: '',
          stock: 0,
          description: '',
          categoryId: undefined,
          brandId: undefined,
        }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
        >
          <Input 
            placeholder="Nhập tên sản phẩm" 
            size="large"
            prefix={<TagOutlined />}
          />
        </Form.Item>

        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            label="Giá bán"
            name="basePrice"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <InputNumber
              placeholder="0"
              min={0}
              style={{ width: '100%' }}
              size="large"
              prefix={<DollarOutlined />}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="stock"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <InputNumber
              placeholder="0"
              min={0}
              style={{ width: '100%' }}
              size="large"
              prefix={<InboxOutlined />}
            />
          </Form.Item>
        </Space>

        <Space style={{ width: '100%', marginTop: 16 }} size="middle">
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select
              placeholder="Chọn danh mục"
              size="large"
              showSearch
              optionFilterProp="children"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brandId"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <Select
              placeholder="Chọn thương hiệu"
              size="large"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {brands.map(brand => (
                <Option key={brand.id} value={brand.id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space>

        <Form.Item
          label="Mô tả"
          name="description"
          style={{ marginTop: 16 }}
        >
          <TextArea
            rows={4}
            placeholder="Mô tả sản phẩm..."
          />
        </Form.Item>

        {/* Image Upload Section */}
        <div style={{ marginTop: 16 }}>
          <ImageUploadSection
            product={currentProduct}
            images={images}
            uploading={uploading}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
          />
        </div>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} disabled={loading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {product ? 'Cập nhật' : 'Tạo sản phẩm'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;