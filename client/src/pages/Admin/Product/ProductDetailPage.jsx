import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, MoreVertical, Trash2, Copy, Eye, AlertCircle } from 'lucide-react';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';

// Import components
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
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id);
      const productData = response?.data || response;
      
      // Ensure product has required fields
      if (!productData || !productData.id) {
        throw new Error('Invalid product data received');
      }
      
      setProduct(productData);
    } catch (error) {
      console.error('Load product error:', error);
      notify.error(error.message || 'Không thể tải sản phẩm');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return notify.info('Không có thay đổi nào để lưu');

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        brandId: formData.brandId ? Number(formData.brandId) : undefined,
        status: formData.status,
      };

      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
      });

      await productService.update(id, updateData);
      notify.success('Đã lưu thay đổi thành công');
      setHasChanges(false);
      await loadProduct();
    } catch (error) {
      notify.error(error.response?.data?.message || error.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) return;
    
    try {
      await productService.delete(id);
      notify.success('Đã xóa sản phẩm');
      navigate('/admin/products');
    } catch (error) {
      notify.error(error.message || 'Xóa thất bại');
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await productService.create({ ...formData, name: `${formData.name} (Copy)` });
      notify.success('Đã nhân bản sản phẩm');
      navigate(`/admin-products/${response?.data?.id || response?.id}`);
    } catch (error) {
      notify.error(error.message || 'Nhân bản thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">Sản phẩm không tồn tại hoặc đã bị xóa</p>
          <Link to="/admin-products" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ArrowLeft size={18} /> Quay lại
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: '📝' },
    { id: 'variants', label: 'Biến thể', icon: '🎨', badge: product.variants?.length },
    { id: 'images', label: 'Ảnh', icon: '📷' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'history', label: 'Lịch sử', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Link to="/admin/products" className="hover:text-gray-700">Sản phẩm</Link>
                  <span>/</span>
                  <span className="text-gray-900">{product.name}</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-sm text-amber-700 font-medium">Có thay đổi chưa lưu</span>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>

              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                  <button onClick={handleDuplicate} className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-lg">
                    <Copy size={16} className="text-gray-600" />
                    <div><div className="font-medium text-sm">Nhân bản</div></div>
                  </button>
                  <a href={`/products/${product.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50">
                    <Eye size={16} className="text-gray-600" />
                    <div><div className="font-medium text-sm">Xem trên web</div></div>
                  </a>
                  <div className="border-t"></div>
                  <button onClick={handleDelete} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg">
                    <Trash2 size={16} />
                    <div><div className="font-medium text-sm">Xóa sản phẩm</div></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1 mt-6 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm rounded-t-lg ${
                  activeTab === tab.id ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.badge && <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{tab.badge}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TabContent activeTab={activeTab} product={product} formData={formData} onFormChange={handleFormChange} onUpdate={loadProduct} />
          </div>
          <div className="space-y-6">
            <StatusCard product={product} formData={formData} onFormChange={handleFormChange} />
            <OrganizationCard formData={formData} onFormChange={handleFormChange} categories={categories} brands={brands} loadingCategories={loadingCategories} loadingBrands={loadingBrands} />
            <StatsCard product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

const TabContent = ({ activeTab, product, formData, onFormChange, onUpdate }) => {
  switch (activeTab) {
    case 'info': return <InfoTab product={product} formData={formData} onFormChange={onFormChange} />;
    case 'variants': return <VariantsTab product={product} onUpdate={onUpdate} />;
    case 'images': return <ImagesTab product={product} />;
    case 'seo': return <Placeholder icon="🔍" title="SEO & Meta tags" desc="Quản lý SEO meta title, description, keywords" />;
    case 'history': return <Placeholder icon="📊" title="Lịch sử" desc="Xem lịch sử chỉnh sửa giá, kho, thông tin" />;
    default: return null;
  }
};

const Placeholder = ({ icon, title, desc }) => (
  <div className="bg-white rounded-lg border p-6">
    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  </div>
);

export default ProductDetailPage;
