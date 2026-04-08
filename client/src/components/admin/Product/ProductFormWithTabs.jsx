import { Tabs } from 'antd';
import {
  FileTextOutlined,
  PictureOutlined,
  AppstoreOutlined,
  DollarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import ProductFormUnified from './ProductFormUnified';

/**
 * Wrapper component thêm Tab Navigation vào ProductFormUnified
 * Chia form thành 5 tabs: Details, Gallery, Categories, Prices, Advance Options
 */
const ProductFormWithTabs = (props) => {
  const tabItems = [
    {
      key: 'details',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          <span>Chi tiết sản phẩm</span>
        </span>
      ),
      children: (
        <div className="mt-6">
          <ProductFormUnified {...props} activeSection="details" />
        </div>
      ),
    },
    {
      key: 'gallery',
      label: (
        <span className="flex items-center gap-2">
          <PictureOutlined />
          <span>Thư viện ảnh</span>
        </span>
      ),
      children: (
        <div className="mt-6">
          <ProductFormUnified {...props} activeSection="gallery" />
        </div>
      ),
    },
    {
      key: 'categories',
      label: (
        <span className="flex items-center gap-2">
          <AppstoreOutlined />
          <span>Danh mục</span>
        </span>
      ),
      children: (
        <div className="mt-6">
          <ProductFormUnified {...props} activeSection="categories" />
        </div>
      ),
    },
    {
      key: 'pricing',
      label: (
        <span className="flex items-center gap-2">
          <DollarOutlined />
          <span>Giá và chiết khấu</span>
        </span>
      ),
      children: (
        <div className="mt-6">
          <ProductFormUnified {...props} activeSection="pricing" />
        </div>
      ),
    },
    {
      key: 'advanced',
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          <span>Tùy chọn nâng cao</span>
        </span>
      ),
      children: (
        <div className="mt-6">
          <ProductFormUnified {...props} activeSection="advanced" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {props.isEdit ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
        </h2>
        <p className="text-gray-600">
          {props.isEdit 
            ? 'Cập nhật thông tin chi tiết của sản phẩm' 
            : 'Thêm sản phẩm mới vào hệ thống'}
        </p>
      </div>

      <Tabs
        items={tabItems}
        defaultActiveKey="details"
        size="large"
        type="card"
        className="[&_.ant-tabs-nav]:border-gray-200 [&_.ant-tabs-tab]:rounded-t-lg"
      />
    </div>
  );
};

export default ProductFormWithTabs;
