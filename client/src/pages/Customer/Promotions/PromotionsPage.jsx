import { useState, useEffect } from 'react';
import { Tag, Clock, Eye, Copy, CheckCircle } from 'lucide-react';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import discountService from '../../../services/discountService';
import toast from 'react-hot-toast';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await discountService.getDiscounts();
      
      console.log('API Response:', response);
      const data = response?.data || response || [];
      console.log('Promotions data:', data);
      
      if (Array.isArray(data)) {
        const activePromotions = data
          .filter(item => {
            const now = new Date();
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);
            return item.status === 'active' && start <= now && end >= now;
          })
          .map((item, index) => {
            console.log('Processing item:', item.code, 'image:', item.image || 'none');
            return {
              id: item.id,
              code: item.code,
              description: item.description,
              image: item.image, // URL ảnh từ API
              value: item.percentage || item.fixedAmount,
              type: item.percentage ? 'percentage' : 'fixed',
              startDate: item.startDate,
              endDate: item.endDate,
              minOrder: item.minOrderValue || 0,
              usageCount: item.usageCount || 0,
              gradient: getGradient(index),
            };
          });
        
        console.log('Active promotions:', activePromotions);
        setPromotions(activePromotions);
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      toast.error('Không thể tải khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const getGradient = (index) => {
    const gradients = [
      'from-red-500 to-pink-600',
      'from-green-500 to-emerald-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-violet-600',
      'from-orange-500 to-amber-600',
      'from-cyan-500 to-blue-600',
    ];
    return gradients[index % gradients.length];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Đã copy mã: ' + code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTimeRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Đã hết hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return 'Sắp hết hạn';
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải khuyến mãi..." />
      </Layout>
    );
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Khuyến mãi', path: '/promotions' },
  ];

  return (
    <Layout>
      <div className="bg-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Khuyến mãi</h1>
            <p className="text-gray-600">
              {promotions.length > 0 
                ? `${promotions.length} mã giảm giá đang hoạt động`
                : 'Hiện không có khuyến mãi nào'}
            </p>
          </div>

          {/* Promotions Grid */}
          {promotions.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Hiện không có khuyến mãi nào</p>
              <p className="text-gray-400 text-sm mt-2">Hãy quay lại sau để nhận ưu đãi hấp dẫn!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {promotions.map((promotion) => (
                <PromotionCard 
                  key={promotion.id} 
                  promotion={promotion} 
                  onCopy={handleCopyCode}
                  copiedCode={copiedCode}
                  getTimeRemaining={getTimeRemaining}
                  formatDateRange={formatDateRange}
                />
              ))}
            </div>
          )}

          
        
        </div>
      </div>
    </Layout>
  );
};

// Promotion Card Component
const PromotionCard = ({ promotion, onCopy, copiedCode, getTimeRemaining, formatDateRange }) => {
  console.log('Rendering promotion card:', promotion.code, 'has image:', !!promotion.image, 'image URL:', promotion.image || 'none');
  
  return (
    <div className="bg-white border border-gray-200 hover:border-gray-900 transition-all duration-300 overflow-hidden group hover:shadow-lg">
      {/* Banner with Image or Gradient */}
      <div className={`relative h-48 ${promotion.image ? '' : `bg-gradient-to-br ${promotion.gradient}`}`}>
        {/* Background Image if available */}
        {promotion.image ? (
          <img 
            src={promotion.image} 
            alt={promotion.description || promotion.code}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error for:', promotion.code, 'URL:', promotion.image || 'undefined');
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log('Image loaded successfully:', promotion.code)}
          />
        ) : null}
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30"></div>
      
        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col justify-between h-full">
          {/* Discount Badge */}
          <div className="flex justify-end">
            <div className="bg-white px-4 py-2 shadow-lg">
              <span className="text-2xl font-bold text-red-600">
                {promotion.type === 'percentage'
                  ? `-${promotion.value}%`
                  : `-${Math.floor(promotion.value / 1000)}K`}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="flex-1 flex items-center">
            <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">
              {promotion.description || promotion.code}
            </h3>
          </div>

          {/* Time & Views */}
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 backdrop-blur-sm">
              <Clock size={14} />
              <span>{getTimeRemaining(promotion.endDate)}</span>
            </div>
            {promotion.usageCount > 0 && (
              <div className="flex items-center gap-1 bg-black/40 px-2 py-1 backdrop-blur-sm">
                <Eye size={14} />
                <span>{promotion.usageCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Section */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">
          {formatDateRange(promotion.startDate, promotion.endDate)}
        </div>
        
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">Mã giảm giá:</p>
            <p className="text-sm font-bold text-gray-900 tracking-wider">
              {promotion.code}
            </p>
          </div>
          <button
            onClick={() => onCopy(promotion.code)}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              copiedCode === promotion.code
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            {copiedCode === promotion.code ? (
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-1 cursor-pointer">
                <Copy size={12} />
                COPY
              </span>
            )}
          </button>
        </div>

        {promotion.minOrder > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Đơn tối thiểu: {promotion.minOrder.toLocaleString()}₫
          </p>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
