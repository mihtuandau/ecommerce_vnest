// ProductDetailPage.jsx - Tối ưu và tinh gọn
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dropdown, Button } from 'antd';
import { EditOutlined, CopyOutlined, EyeOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ArrowLeft, AlertCircle, Package, TrendingUp, Star, Eye, Image as ImageIcon, Tag, Layers, Hash } from 'lucide-react';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';

import Loading from '../../../components/common/Loading';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import InfoTab from '../../../components/admin/Product/tabs/InfoTab';
import VariantsTab from '../../../components/admin/Product/tabs/VariantsTab';
import ImagesTab from '../../../components/admin/Product/tabs/ImagesTab';
import StatusCard from '../../../components/admin/Product/sidebar/StatusCard';
import OrganizationCard from '../../../components/admin/Product/sidebar/OrganizationCard';
import StatsCard from '../../../components/admin/Product/sidebar/StatsCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: brands = [], isLoading: loadingBrands } = useBrands();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id);
      const productData = response?.data || response;
      
      if (!productData || !productData.id) {
        throw new Error('Invalid product data received');
      }
      
      setProduct(productData);
    } catch (error) {
      console.error('Load product error:', error);
      notify.error(error.message || 'Không thể tải sản phẩm');
      navigate('/admin-products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.delete(id);
      notify.success('Đã xóa sản phẩm');
      navigate('/admin-products');
    } catch (error) {
      notify.error(error.message || 'Xóa thất bại');
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      const payload = {
        name: `${(product.name || '').trim()} (Copy)`,
        description: product.description || undefined,
        basePrice: product.basePrice || 0,
        categoryId: product.categoryId || undefined,
        brandId: product.brandId || undefined,
      };
      const response = await productService.create(payload);
      const created = response?.data || response;
      const newId = created?.id;
      notify.success('Đã nhân bản sản phẩm');
      if (newId) navigate(`/admin-products/${newId}`);
      else navigate('/admin-products');
    } catch (error) {
      notify.error(error?.response?.data?.message || error?.message || 'Nhân bản thất bại');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/admin-products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  const sku = product.sku || product.variants?.[0]?.sku || '—';
  const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0;
  const sold = product.soldCount ?? product.sold ?? 0;
  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const views = product.viewCount ?? product.views ?? 0;
  const thumbnail = product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url;

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: <Tag size={16} /> },
    { id: 'variants', label: 'Biến thể', icon: <Layers size={16} />, badge: product.variants?.length },
    { id: 'images', label: 'Hình ảnh', icon: <ImageIcon size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin-products')} 
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>

              {/* Product Info */}
              <div className="flex items-center gap-3">
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Link to="/admin-products" className="hover:text-blue-600 transition-colors">
                      Sản phẩm
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">SKU:</span>
                    <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{sku}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                icon={<EyeOutlined />} 
                onClick={() => window.open(`/products/${product.id}`, '_blank')}
              >
                Xem
              </Button>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/admin-products/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    { key: 'duplicate', icon: <CopyOutlined />, label: 'Nhân bản', onClick: handleDuplicate },
                    { type: 'divider' },
                    { 
                      key: 'delete', 
                      icon: <DeleteOutlined />, 
                      label: 'Xóa', 
                      danger: true,
                      onClick: () => setDeleteModalOpen(true) 
                    },
                  ],
                }}
                placement="bottomRight"
              >
                <Button icon={<EllipsisOutlined />} />
              </Dropdown>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={<Package size={18} />}
              label="Tồn kho"
              value={totalStock.toLocaleString()}
              color="blue"
            />
            <StatCard 
              icon={<TrendingUp size={18} />}
              label="Đã bán"
              value={sold.toLocaleString()}
              color="green"
            />
            <StatCard 
              icon={<Star size={18} />}
              label="Đánh giá"
              value={Number(rating).toFixed(1)}
              subValue={reviewCount > 0 ? `${reviewCount} đánh giá` : null}
              color="yellow"
            />
            <StatCard 
              icon={<Eye size={18} />}
              label="Lượt xem"
              value={views.toLocaleString()}
              color="purple"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-colors ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge != null && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <TabContent activeTab={activeTab} product={product} readOnly />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Trạng thái</h3>
              <StatusCard product={product} readOnly />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Phân loại</h3>
              <OrganizationCard 
                product={product}
                categories={categories} 
                brands={brands} 
                loadingCategories={loadingCategories} 
                loadingBrands={loadingBrands} 
                readOnly 
              />
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Thống kê</h3>
              <StatsCard product={product} />
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message="Hành động này không thể hoàn tác."
        itemName={product?.name}
        loading={deleting}
      />
    </div>
  );
};

// StatCard - Đơn giản và gọn
const StatCard = ({ icon, label, value, subValue, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <div className="ml-11">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subValue && (
          <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
};

// TabContent
const TabContent = ({ activeTab, product, readOnly }) => {
  switch (activeTab) {
    case 'info':
      return <InfoTab product={product} readOnly={readOnly} />;
    case 'variants':
      return <VariantsTab product={product} readOnly={readOnly} />;
    case 'images':
      return <ImagesTab product={product} />;
    default:
      return null;
  }
};

export default ProductDetailPage;