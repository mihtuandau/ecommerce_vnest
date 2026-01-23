// ProductDetailPage.jsx - Cải thiện UI, giữ nguyên logic
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dropdown, Button } from 'antd';
import { EditOutlined, CopyOutlined, EyeOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { ArrowLeft, AlertCircle } from 'lucide-react';
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
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: brands = [], isLoading: loadingBrands } = useBrands();

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        basePrice: product.basePrice || 0,
        originalPrice: product.originalPrice || 0,
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        status: product.isActive ? 'active' : 'inactive',
      });
    }
  }, [product]);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        name: `${(formData.name || product.name || '').trim()} (Copy)`,
        description: formData.description || product.description || undefined,
        basePrice: Number(formData.basePrice ?? product.basePrice) || 0,
        categoryId: formData.categoryId || product.categoryId ? Number(formData.categoryId || product.categoryId) : undefined,
        brandId: formData.brandId || product.brandId ? Number(formData.brandId || product.brandId) : undefined,
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
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="text-center bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/admin-products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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

  const tabs = [
    { id: 'info', label: 'Thông tin' },
    { id: 'variants', label: 'Biến thể', badge: product.variants?.length },
    { id: 'images', label: 'Ảnh' },
    { id: 'reviews', label: 'Đánh giá', badge: reviewCount },
    { id: 'orders', label: 'Đơn hàng' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky với shadow mượt */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-full w-full mx-auto px-6 py-4">
          {/* Breadcrumb & Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin-products')} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Link to="/admin-products" className="hover:text-gray-700 transition-colors">
                    Sản phẩm
                  </Link>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  SKU: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{sku}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/admin-products/${id}/edit`)}
                className="shadow-sm"
              >
                Chỉnh sửa
              </Button>
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => setDeleteModalOpen(true)}
                className="shadow-sm"
              >
                Xóa
              </Button>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    { key: 'duplicate', icon: <CopyOutlined />, label: 'Nhân bản', onClick: handleDuplicate },
                    { key: 'view', icon: <EyeOutlined />, label: 'Xem trên web', onClick: () => window.open(`/products/${product.id}`, '_blank') },
                  ],
                }}
                placement="bottomRight"
              >
                <Button icon={<EllipsisOutlined />} className="shadow-sm" />
              </Dropdown>
            </div>
          </div>

          {/* Stats Cards - Cải thiện gradient và spacing */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-1">
                <span className="text-xl">📦</span> 
                <span>Tồn kho</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{totalStock}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                <span className="text-xl">📈</span>
                <span>Đã bán</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{sold}</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl border border-yellow-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-yellow-700 text-sm font-medium mb-1">
                <span className="text-xl">⭐</span>
                <span>Đánh giá</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {Number(rating).toFixed(1)}
                {reviewCount > 0 && (
                  <span className="text-base text-yellow-700 ml-1">({reviewCount})</span>
                )}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 p-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-purple-700 text-sm font-medium mb-1">
                <span className="text-xl">👁️</span>
                <span>Lượt xem</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">{views}</div>
            </div>
          </div>

          {/* Tabs - Cải thiện active state */}
          <div className="flex gap-1 -mb-px border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600 -mb-px' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.label}</span>
                  {tab.badge != null && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-full w-full mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2">
            <TabContent
              activeTab={activeTab}
              product={product}
              formData={formData}
              onFormChange={handleFormChange}
              onUpdate={loadProduct}
              readOnly
            />
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            <StatusCard 
              product={product} 
              formData={formData} 
              onFormChange={handleFormChange} 
              readOnly 
            />
            <OrganizationCard 
              formData={formData} 
              onFormChange={handleFormChange} 
              categories={categories} 
              brands={brands} 
              loadingCategories={loadingCategories} 
              loadingBrands={loadingBrands} 
              readOnly 
            />
            <StatsCard product={product} />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
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

// TabContent Component - Giữ nguyên logic
const TabContent = ({ activeTab, product, formData, onFormChange, onUpdate, readOnly }) => {
  switch (activeTab) {
    case 'info':
      return <InfoTab product={product} formData={formData} onFormChange={onFormChange} readOnly={readOnly} />;
    case 'variants':
      return <VariantsTab product={product} onUpdate={onUpdate} readOnly={readOnly} />;
    case 'images':
      return <ImagesTab product={product} />;
    case 'reviews':
      return <Placeholder icon="⭐" title="Đánh giá" desc={`Đánh giá từ khách hàng (${product.reviewCount ?? 0})`} />;
    case 'orders':
      return <Placeholder icon="📦" title="Đơn hàng" desc="Các đơn hàng có chứa sản phẩm này" />;
    default:
      return null;
  }
};

// Placeholder Component - Cải thiện UI
const Placeholder = ({ icon, title, desc }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
      <p className="text-sm text-gray-400 mt-3">Chức năng đang được phát triển</p>
    </div>
  </div>
);

export default ProductDetailPage;