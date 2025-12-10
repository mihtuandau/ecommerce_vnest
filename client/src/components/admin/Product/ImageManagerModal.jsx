import { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import ImageUploadSection from './ImageUploadSection';
import productService from '../../../services/productService';
import toast from 'react-hot-toast';
import Button from '../../common/Button';

const ImageManagerModal = ({ product, isOpen, onClose, onUpdated }) => {
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImages(product?.images || []);
  }, [product]);

  const refresh = async () => {
    try {
      const res = await productService.getOne(product.id);
      const p = res?.data || res;
      setImages(p?.images || []);
      if (onUpdated) onUpdated(p);
    } catch (err) {}
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f && f.size > 0);
    if (!files.length) return;
    setUploading(true);
    try {
      const resp = await productService.uploadImages(product.id, files);toast.success('Upload ảnh thành công');
      await refresh();
    } catch (err) {toast.error(err?.response?.data?.message || 'Không thể upload ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (img) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    try {
      await productService.deleteImage(img.id);
      toast.success('Đã xóa ảnh');
      await refresh();
    } catch (err) {toast.error('Không thể xóa ảnh');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quản lý ảnh - ${product?.name || ''}`}
      size="lg"
    >
      <div className="space-y-4">
        <ImageUploadSection
          product={product}
          images={images}
          uploading={uploading}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage}
        />
        
        <div className="flex justify-end pt-3 border-t">
          <Button variant="secondary" onClick={onClose} className="text-sm px-4 py-2">Đóng</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageManagerModal;
