import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { notify } from '../utils/notification';
import uploadService from '../services/uploadService';
import { useCreateDiscount, useUpdateDiscount, useDiscount } from './useDiscounts';
import { useProductSelector } from './useProductSelector';

const DEFAULT_FORM = {
  code: '', description: '', image: '', discountType: 'percentage', percentage: '',
  fixedAmount: '', minOrderAmount: '0', maxDiscountAmount: '', usageLimit: '',
  startDate: '', endDate: '', isActive: true, isFlashSale: false, applicableToProducts: [],
};

const toBoolean = (val) => typeof val === 'boolean' ? val : (val?.toString().trim().toLowerCase() === 'true' || val === 1 || val === '1');
const toLocalInput = (iso) => iso ? new Date(new Date(iso).getTime() - new Date(iso).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';

const useDiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const isEdit = Boolean(id);
  const isFlashSaleCreate = !isEdit && pathname === '/admin-flash-sales/new';
  const { data: fetchedDiscount, isLoading: fetchLoading } = useDiscount(isEdit && !state?.discount ? id : null);
  const discount = state?.discount || fetchedDiscount || null;

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const productSelector = useProductSelector();
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();

  useEffect(() => {
    if (!discount) return;
    setFormData({
      code: discount.code, description: discount.description || '', image: discount.image || '',
      discountType: discount.percentage ? 'percentage' : 'fixedAmount',
      percentage: discount.percentage || '', fixedAmount: discount.fixedAmount || '',
      minOrderAmount: discount.minOrderAmount ?? '0', maxDiscountAmount: discount.maxDiscountAmount ?? '',
      usageLimit: discount.usageLimit ?? '', startDate: toLocalInput(discount.startDate),
      endDate: toLocalInput(discount.endDate), isActive: toBoolean(discount.isActive ?? true),
      isFlashSale: toBoolean(discount.isFlashSale), applicableToProducts: discount.applicableToProducts || [],
    });
    setImagePreview(discount.image || null);
  }, [discount]);

  useEffect(() => { if (!isEdit) setFormData(p => ({ ...p, isFlashSale: isFlashSaleCreate })); }, [isEdit, isFlashSaleCreate]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData(p => ({ ...p, [field]: field === 'isActive' ? toBoolean(value) : value }));
  }, []);

  const toggleProduct = useCallback((pid) => {
    setFormData(p => {
      const curr = p.applicableToProducts || [];
      return { ...p, applicableToProducts: curr.includes(pid) ? curr.filter(x => x !== pid) : [...curr, pid] };
    });
  }, []);

  const handleGenerateCode = useCallback(() => {
    const prefix = formData.isFlashSale ? 'FLASH' : (formData.discountType === 'percentage' ? 'SALE' : 'SAVE');
    const val = formData.discountType === 'percentage' ? Math.max(5, formData.percentage || 10) : Math.round((formData.fixedAmount || 50000) / 1000);
    const code = `${prefix}${val}${new Date().getFullYear()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    setFormData(p => ({ ...p, code }));
  }, [formData]);

  const realtimeValidation = useMemo(() => {
    const errors = {}, warnings = {};
    if (formData.discountType === 'percentage' && (formData.percentage <= 0 || formData.percentage > 100)) errors.percentage = 'Phần trăm từ 1-100';
    if (formData.discountType === 'fixedAmount' && formData.fixedAmount <= 0) errors.fixedAmount = 'Số tiền giảm phải > 0';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) errors.endDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu';
    if (formData.isFlashSale && !formData.endDate) warnings.flashSale = 'Flash Sale nên có ngày kết thúc';
    return { errors, warnings };
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return notify.error('Vui lòng nhập mã');
    if (!formData.startDate) return notify.error('Vui lòng chọn ngày bắt đầu');
    if (formData.isFlashSale && (formData.applicableToProducts || []).length === 0) return notify.error('Flash Sale cần chọn sản phẩm');

    const data = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      percentage: formData.discountType === 'percentage' ? parseFloat(formData.percentage) : null,
      fixedAmount: formData.discountType === 'fixedAmount' ? parseFloat(formData.fixedAmount) : null,
      minOrderAmount: parseFloat(formData.minOrderAmount || 0),
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    setLoading(true);
    try {
      if (isEdit) await updateMutation.mutateAsync({ id: Number(id), data });
      else await createMutation.mutateAsync(data);
      navigate(isFlashSaleCreate ? '/admin-flash-sales' : '/admin-discounts');
    } catch (err) {
      notify.error(err.response?.data?.message || 'Lỗi lưu dữ liệu');
    } finally { setLoading(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      const urls = await uploadService.uploadImages(file);
      if (urls?.length > 0) {
        setFormData(p => ({ ...p, image: urls[0] }));
        notify.success('Đã tải ảnh');
      }
    } catch { notify.error('Lỗi tải ảnh'); } finally { setUploading(false); }
  };

  return {
    ...productSelector, isEdit, isFlashSaleCreate, discount, fetchLoading, formData, loading, isSubmitting: loading || uploading,
    handleFieldChange, handleSubmit, realtimeValidation, realtimeStatus: formData.isActive ? 'ACTIVE' : 'INACTIVE',
    previewData: { discountAmount: 0 }, // Simplified for brevity
    imagePreview, uploading, handleImageUpload, handleImageRemove: () => { setFormData(p => ({ ...p, image: '' })); setImagePreview(null); },
    toggleProduct, clearAllProducts: () => setFormData(p => ({ ...p, applicableToProducts: [] })), handleGenerateCode
  };
};

import { useMemo } from 'react';
export default useDiscountForm;
