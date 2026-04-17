import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, BarChart2, MessageSquare, Layers } from 'lucide-react';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';
import Loading from '../../../components/common/Loading';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';

import ProductHeader from '../../../components/admin/Product/ProductHeader';
import ProductSidebar from '../../../components/admin/Product/ProductSidebar';
import ProductOverviewTab from '../../../components/admin/Product/ProductOverviewTab';
import ProductVariantsTab from '../../../components/admin/Product/ProductVariantsTab';
import ProductReviewsTab from '../../../components/admin/Product/ProductReviewsTab';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [variantsPage, setVariantsPage] = useState(1);
  const variantsPerPage = 10;

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id, { allVariants: 'true' });
      setProduct(response?.data || response);
    } catch (error) {
      notify.error('Không thể tải sản phẩm');
      navigate('/admin-products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProduct(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await productService.delete(id);
      notify.success('Đã xóa sản phẩm');
      navigate('/admin-products');
    } catch (error) {
      notify.error('Xóa thất bại');
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const allVariants = product?.variants || [];
  const paginatedVariants = useMemo(() => {
    const start = (variantsPage - 1) * variantsPerPage;
    return allVariants.slice(start, start + variantsPerPage);
  }, [allVariants, variantsPage]);

  if (loading) return <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />;
  if (!product) return <NotFound navigate={navigate} />;

  const stats = {
    totalStock: product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? product.stock ?? 0,
    sold: product.soldCount ?? product.sold ?? 0,
    rating: product.averageRating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    views: product.viewCount ?? product.views ?? 0,
  };

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Chưa phân loại';
  const brandName = brands.find(b => b.id === product.brandId)?.name || 'N/A';
  const formatPrice = (price) => `${price?.toLocaleString('vi-VN')} ₫`;
  const basePriceFormatted = formatPrice(product.basePrice || 0);

  const getPriceRange = () => {
    if (!product.variants?.length) return basePriceFormatted;
    const prices = product.variants.map(v => v.price).filter(Boolean);
    if (!prices.length) return basePriceFormatted;
    const min = Math.min(...prices), max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 text-gray-900">
      <ProductHeader product={product} id={id} navigate={navigate} />

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        <ProductSidebar 
          product={product} 
          {...stats} 
          categoryName={categoryName} 
          brandName={brandName} 
          basePriceFormatted={basePriceFormatted} 
          priceRange={getPriceRange()} 
        />

        <div className="flex-1 flex flex-col">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} variantsCount={product.variants?.length} reviewCount={stats.reviewCount} />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1">
            {activeTab === 'overview' && <ProductOverviewTab product={product} {...stats} />}
            {activeTab === 'variants' && (
              <ProductVariantsTab 
                product={product} 
                totalStock={stats.totalStock} 
                paginatedVariants={paginatedVariants} 
                variantsPage={variantsPage} 
                variantsPerPage={variantsPerPage} 
                allVariants={allVariants} 
                setVariantsPage={setVariantsPage} 
                navigate={navigate} 
                id={id} 
              />
            )}
            {activeTab === 'reviews' && <ProductReviewsTab />}
          </div>
        </div>
      </div>

      <DeleteConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} title="Xóa sản phẩm" message="Hành động này không thể hoàn tác." itemName={product?.name} loading={deleting} />
    </div>
  );
};

const TabNavigation = ({ activeTab, setActiveTab, variantsCount, reviewCount }) => (
  <div className="flex gap-6 border-b border-gray-100 mb-6 bg-white px-2 pt-2 rounded-t-xl">
    <TabButton id="overview" label="Tổng quan" icon={<BarChart2 size={16} />} activeTab={activeTab} onClick={setActiveTab} />
    <TabButton id="variants" label="Biến thể" icon={<Layers size={16} />} count={variantsCount} activeTab={activeTab} onClick={setActiveTab} />
    <TabButton id="reviews" label="Đánh giá" icon={<MessageSquare size={16} />} count={reviewCount} activeTab={activeTab} onClick={setActiveTab} />
  </div>
);

const TabButton = ({ id, label, icon, count, activeTab, onClick }) => (
  <button 
    onClick={() => onClick(id)}
    className={`py-3 px-2 font-medium flex items-center justify-center gap-2 text-sm border-b-2 transition-all ${activeTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
  >
    {icon} {label} 
    {count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === id ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
  </button>
);

const NotFound = ({ navigate }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
      <p className="text-gray-600 mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
      <Link to="/admin-products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        <ArrowLeft size={18} /> Quay lại danh sách
      </Link>
    </div>
  </div>
);

export default ProductDetailPage;
