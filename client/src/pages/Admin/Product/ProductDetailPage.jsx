// ProductDetailPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { Pagination as AntdPagination } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ArrowLeft, AlertCircle, Eye, ShoppingCart, Star, Box, BarChart2, MessageSquare, Layers, Info } from 'lucide-react';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';
import dayjs from 'dayjs';

import Loading from '../../../components/common/Loading';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';

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

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id, { allVariants: 'true' });
      const productData = response?.data || response;
      if (!productData || !productData.id) throw new Error('Invalid product data received');
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

  const allVariants = product?.variants || [];
  const totalVariantPages = Math.max(1, Math.ceil(allVariants.length / variantsPerPage));
  const paginatedVariants = useMemo(() => {
    const start = (variantsPage - 1) * variantsPerPage;
    return allVariants.slice(start, start + variantsPerPage);
  }, [allVariants, variantsPage]);

  useEffect(() => {
    if (activeTab !== 'variants') {
      setVariantsPage(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (variantsPage > totalVariantPages) {
      setVariantsPage(totalVariantPages);
    }
  }, [variantsPage, totalVariantPages]);

  if (loading) return <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />;

  if (!product) {
    return (
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
  }

  const totalStock = product.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? product.stock ?? 0;
  const sold = product.soldCount ?? product.sold ?? 0;
  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const views = product.viewCount ?? product.views ?? 0;
  const thumbnail = product.images?.[0]?.url || product.variants?.[0]?.images?.[0]?.url || 'https://placehold.co/400x400/f8fafc/94a3b8?text=No+Image';

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Chưa phân loại';
  const brandName = brands.find(b => b.id === product.brandId)?.name || 'N/A';
  
  // Format prices
  const formatPrice = (price) => `${price?.toLocaleString('vi-VN')} ₫`;
  const basePriceFormatted = formatPrice(product.basePrice || 0);

  let priceRange = basePriceFormatted;
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => v.price).filter(Boolean);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      priceRange = minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 text-gray-900">
      {/* Top Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin-products')} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg text-gray-600 transition-colors border border-transparent hover:border-gray-200">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-0.5">
              <span>#{product.id || id}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>Sản phẩm</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 text-sm font-bold shadow-sm">
            <CheckCircleOutlined className="text-xs" />
            <span>Đang bán</span>
          </div>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin-products/${id}/edit`)} className="rounded-full h-9 font-bold px-5 shadow-md shadow-blue-500/20">
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden aspect-square">
            <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Performance Summary (Hiệu suất) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-2 bg-white">
              <h3 className="font-bold text-gray-900 text-sm">Hiệu suất</h3>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="p-4 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0"><Eye size={18}/></div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xs font-medium text-gray-400 mb-0.5">Lượt xem</div>
                  <div className="font-bold text-gray-900 text-base">{views.toLocaleString()}</div>
                </div>
              </div>
              <div className="p-4 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0"><ShoppingCart size={18}/></div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xs font-medium text-gray-400 mb-0.5">Đã bán</div>
                  <div className="font-bold text-gray-900 text-base">{sold.toLocaleString()} sản phẩm</div>
                </div>
              </div>
              <div className="p-4 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-50 text-orange-400 flex items-center justify-center flex-shrink-0"><Star size={18}/></div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xs font-medium text-gray-400 mb-0.5">Đánh giá</div>
                  <div className="font-bold text-gray-900 text-base flex items-baseline gap-1">
                    {Number(rating).toFixed(1)} / 5 <span className="text-xs font-medium text-gray-400">({reviewCount})</span>
                  </div>
                </div>
              </div>
              <div className="p-4 flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0"><Box size={18}/></div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-xs font-medium text-gray-400 mb-0.5">Tồn kho</div>
                  <div className="font-bold text-gray-900 text-base">
                    {totalStock.toLocaleString()} <span className="text-xs font-medium text-gray-400">· {product.variants?.length || 0} biến thể</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          {/* Detailed Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 flex items-center gap-2 bg-white">
              <h3 className="font-bold text-gray-900 text-sm">Thông tin sản phẩm</h3>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed">
                <span className="text-gray-500 font-medium flex items-center gap-2">Danh mục</span>
                <span className="font-medium bg-gray-50 text-gray-800 px-2.5 py-1 rounded-md">{categoryName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed">
                <span className="text-gray-500 font-medium flex items-center gap-2">Thương hiệu</span>
                <span className="font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{brandName}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed">
                <span className="text-gray-500 font-medium flex items-center gap-2">Giá cơ bản</span>
                <span className="font-bold text-gray-900">{basePriceFormatted}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed">
                <span className="text-gray-500 font-medium flex items-center gap-2">Khoảng giá</span>
                <span className="font-bold text-gray-700">{priceRange}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-50 border-dashed">
                <span className="text-gray-500 font-medium flex items-center gap-2">Slug</span>
                <span className="font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                  /{product.slug || (product.name ? product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-') : 'N/A')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-400 font-medium">Ngày tạo</span>
                <span className="text-gray-500 font-medium">{dayjs(product.createdAt).format('DD/MM/YYYY')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Cập nhật</span>
                <span className="text-gray-500 font-medium">{dayjs(product.updatedAt).format('HH:mm DD/MM/YYYY')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-100 mb-6 bg-white px-2 pt-2 rounded-t-xl">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-2 font-medium flex items-center justify-center gap-2 text-sm border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <BarChart2 size={16} /> 
              Tổng quan
            </button>
            <button 
              onClick={() => setActiveTab('variants')}
              className={`py-3 px-2 font-medium flex items-center justify-center gap-2 text-sm border-b-2 transition-all ${activeTab === 'variants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Layers size={16} /> 
              Biến thể 
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'variants' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{product.variants?.length || 0}</span>
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-2 font-medium flex items-center justify-center gap-2 text-sm border-b-2 transition-all ${activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <MessageSquare size={16} /> 
              Đánh giá 
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === 'reviews' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{reviewCount}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in text-gray-900">
                {/* Description */}
                <div>
                  <h3 className="font-bold text-sm mb-4">Mô tả sản phẩm</h3>
                  <div className="bg-[#f8f9fa] rounded-2xl p-5 text-sm leading-relaxed border border-transparent min-h-[80px]">
                    {product.description ? (
                      <div dangerouslySetInnerHTML={{ __html: product.description }} className="prose prose-sm max-w-none text-gray-600" />
                    ) : (
                      <div className="text-gray-400 font-medium">Bạn chưa viết mô tả cho sản phẩm.</div>
                    )}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div>
                  <h3 className="font-bold text-sm mb-4">Thông tin nhanh</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Tổng tồn kho</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{totalStock.toLocaleString()}</div>
                      <div className="text-xs font-medium text-gray-500">sản phẩm</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Biến thể hoạt động</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{product.variants?.filter(v => v.isActive !== false)?.length || 0}<span className="text-lg text-gray-400">/{product.variants?.length || 0}</span></div>
                      <div className="text-xs font-medium text-gray-500">biến thể</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Đã bán</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{sold.toLocaleString()}</div>
                      <div className="text-xs font-medium text-gray-500">lượt</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Lượt xem</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{views.toLocaleString()}</div>
                      <div className="text-xs font-medium text-gray-500">lượt</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Đánh giá TB</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{Number(rating).toFixed(1)}</div>
                      <div className="text-xs font-medium text-gray-500">/ 5 sao</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-transparent">
                      <div className="text-xs font-semibold text-gray-500 mb-1">Số đánh giá</div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{reviewCount.toLocaleString()}</div>
                      <div className="text-xs font-medium text-gray-500">lượt</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'variants' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{product.variants?.length || 0} biến thể</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Tổng tồn kho: {totalStock.toLocaleString()} · {product.variants?.filter(v => v.isActive !== false)?.length || 0} đang hoạt động</p>
                  </div>
                  <Button type="default" icon={<EditOutlined />} onClick={() => navigate(`/admin-products/${id}/edit`)} className="rounded-full h-8 px-4 text-blue-600 bg-blue-50 border-transparent font-semibold shadow-none hover:bg-blue-100">
                    Quản lý biến thể
                  </Button>
                </div>

                {product.variants?.length > 0 ? (
                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#f9fafb] border-b border-gray-100 uppercase text-[11px] font-bold text-gray-400 tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Size</th>
                          <th className="px-6 py-4">Màu sắc</th>
                          <th className="px-6 py-4">SKU</th>
                          <th className="px-6 py-4">Giá bán</th>
                          <th className="px-6 py-4">Tồn kho</th>
                          <th className="px-6 py-4">Ngưỡng</th>
                          <th className="px-6 py-4">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 bg-white">
                        {paginatedVariants.map((v, i) => (
                          <tr key={v.id || i} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900 block min-w-[30px]">{v.size || '—'}</span>
                            </td>
                            <td className="px-6 py-4">
                              {v.color ? (
                                <div className="flex items-center gap-2">
                                  {v.color.startsWith('#') ? (
                                    <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: v.color }}></span>
                                  ) : (
                                    <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm bg-gray-200"></span>
                                  )}
                                  <span className="text-gray-600 text-sm">{v.color}</span>
                                </div>
                              ) : <span className="text-gray-400">—</span>}
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-500">{v.sku || 'N/A'}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(v.price)}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1.5 w-24">
                                <span className={`font-bold text-[13px] ${v.stock < (v.lowStockThreshold || 5) ? 'text-red-500' : 'text-emerald-500'}`}>
                                  {v.stock}
                                </span>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${v.stock < (v.lowStockThreshold || 5) ? 'bg-red-500' : 'bg-emerald-400'}`} style={{ width: `${Math.min((v.stock / 100) * 100, 100)}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-[13px]">{v.lowStockThreshold || 5}</td>
                            <td className="px-6 py-4">
                              {v.isActive !== false ? (
                                <span className="inline-flex flex-shrink-0 items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                  <CheckCircleOutlined className="text-[10px]" /> Đang bán
                                </span>
                              ) : (
                                <span className="inline-flex text-center items-center gap-1 bg-gray-50 text-gray-500 px-2.5 py-1 rounded-full text-[11px] font-bold">
                                  Tạm ẩn
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {allVariants.length > 0 && (
                      <div className="flex items-center justify-between gap-4 border-t border-gray-100 p-4">
                        <div className="text-sm text-gray-500">
                          {allVariants.length === 1
                            ? 'Hiển thị 1 biến thể'
                            : `Hiển thị ${(variantsPage - 1) * variantsPerPage + 1}-${Math.min(variantsPage * variantsPerPage, allVariants.length)} / ${allVariants.length} biến thể`}
                        </div>
                        <AntdPagination
                          current={variantsPage}
                          pageSize={variantsPerPage}
                          total={allVariants.length}
                          onChange={(page) => setVariantsPage(page)}
                          showSizeChanger
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Layers size={32} className="mx-auto text-gray-300 mb-3" />
                    <h4 className="text-sm font-bold text-gray-700 mb-1">Chưa có biến thể</h4>
                    <p className="text-[13px] text-gray-500 max-w-sm mx-auto">Sản phẩm này hiện tại chưa có thiết lập biến thể màu sắc hoặc kích thước.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-gray-400 rounded-sm"></div>
                  PHẢN HỒI KHÁCH HÀNG
                </h3>
                <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                  <h4 className="text-sm font-bold text-gray-700 mb-1">Chưa có đánh giá</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">Chưa có khách hàng nào để lại đánh giá cho sản phẩm này.</p>
                </div>
              </div>
            )}
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

export default ProductDetailPage;