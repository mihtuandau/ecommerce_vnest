import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Archive, 
  Layers,
  EyeOff,
  Link
} from 'lucide-react';
import Button from '../../common/Button';
import DeleteConfirmModal from '../../common/DeleteConfirm';
import { notify } from '../../../utils/notification';
import ImageManagerModal from './ImageManagerModal';
// import ProductDetailModal from './ProductDetailModal';

const ProductActions = ({ 
  product, 
  onClose, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onManageVariants 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(product);
      notify.success('Đã xóa sản phẩm thành công');
      onClose();
    } catch (error) {notify.error('Không thể xóa sản phẩm');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      await onDuplicate(product);
      notify.success('Đã sao chép sản phẩm thành công');
      onClose();
    } catch (error) {notify.error('Không thể sao chép sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    // Open admin detail modal
    setShowDetailModal(true);
  };

  const handleCopyLink = () => {
    const productUrl = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(productUrl);
    notify.success('Đã sao chép link sản phẩm');
    onClose();
  };

  const actionItems = [
    {
      label: 'Xem chi tiết',
      icon: <Eye size={16} />,
      onClick: handleViewDetails,
      color: 'text-gray-700'
    },
    {
      label: 'Sao chép link',
      icon: <Link size={16} />,
      onClick: handleCopyLink,
      color: 'text-gray-900'
    },
    {
      label: 'Chỉnh sửa',
      icon: <Edit size={16} />,
      onClick: () => {
        onEdit(product);
        onClose();
      },
      color: 'text-gray-900'
    },
    {
      label: 'Sao chép sản phẩm',
      icon: <Copy size={16} />,
      onClick: handleDuplicate,
      color: 'text-gray-700'
    },
    {
      label: 'Quản lý biến thể',
      icon: <Layers size={16} />,
      onClick: () => {
        onManageVariants(product);
        onClose();
      },
      color: 'text-gray-900'
    },
    {
      label: 'Quản lý ảnh',
      icon: <Archive size={16} />,
      onClick: () => {
        setShowImageManager(true);
      },
      color: 'text-gray-700'
    },
    {
      label: product.active ? 'Ẩn sản phẩm' : 'Hiện sản phẩm',
      icon: product.active ? <EyeOff size={16} /> : <Eye size={16} />,
      onClick: () => {onClose();
      },
      color: 'text-gray-700'
    },
    {
      label: 'Lưu trữ',
      icon: <Archive size={16} />,
      onClick: () => {onClose();
      },
      color: 'text-gray-600'
    },
    {
      label: 'Xóa sản phẩm',
      icon: <Trash2 size={16} />,
      onClick: () => setShowDeleteModal(true),
      color: 'text-red-600',
      destructive: true
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={handleBackdropClick}
      >
        {/* Menu */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50">
          {actionItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              disabled={loading}
              className={`
                w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                ${item.color}
                ${item.destructive 
                  ? 'hover:bg-red-50 focus:bg-red-50' 
                  : 'hover:bg-gray-50 focus:bg-gray-50'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {showImageManager && (
        <ImageManagerModal
          product={product}
          isOpen={showImageManager}
          onClose={() => setShowImageManager(false)}
          onUpdated={() => {
            // parent can refresh if needed
            onClose();
          }}
        />
      )}
      {showDetailModal && (
        <ProductDetailModal
          productId={product.id}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            onClose();
          }}
        />
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        variant="danger"
        loading={loading}
      />
    </>
  );
};

export default ProductActions;