import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { notify } from '../utils/notification';
import uploadService from '../services/uploadService';
import apiService from '../services/apiService';
import { useCreateDiscount, useUpdateDiscount, useDiscount } from './useDiscounts';

// ─── Hằng số ──────────────────────────────────────────────────────────────────
const DEFAULT_FORM = {
  code: '',
  description: '',
  image: '',
  discountType: 'percentage',
  percentage: '',
  fixedAmount: '',
  minOrderAmount: '0',
  maxDiscountAmount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
  isActive: true,
  isFlashSale: false,
  applicableToProducts: [],
};

const PREVIEW_ORDER_TOTAL = 1000000;

const toBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1';
  }
  return false;
};

const toLocalInput = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

// ─── Hook chính ───────────────────────────────────────────────────────────────
/**
 * Chứa toàn bộ state & logic cho trang tạo / chỉnh sửa discount.
 * DiscountFormPage chỉ cần render UI.
 */
const useDiscountForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const isFlashSaleCreate = !isEdit && location.pathname === '/admin-flash-sales/new';

  // Dữ liệu truyền qua navigate state (từ danh sách)
  const stateDiscount = location.state?.discount ?? null;

  // Fetch từ API nếu edit mà không có state
  const { data: fetchedDiscount, isLoading: fetchLoading } = useDiscount(
    isEdit && !stateDiscount ? id : null,
  );

  const discount = stateDiscount || fetchedDiscount || null;

  // ── Form ──────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  // ── Image ─────────────────────────────────────────────────────────────────
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const isSubmitting = loading || uploading;

  // ── Product picker ────────────────────────────────────────────────────────
  const [productOptions, setProductOptions] = useState([]);
  const [productSearching, setProductSearching] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFilters, setProductFilters] = useState({
    categoryId: '',
    sortBy: 'sold',
    inStock: false,
  });
  const [categories, setCategories] = useState([]);
  const searchTimerRef = useRef(null);
  const productsFetchedRef = useRef(false);

  // ── Load products & categories khi mount ────────────────────────────────
  useEffect(() => {
    fetchProducts({});
    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fill form khi có discount data ────────────────────────────────────────
  useEffect(() => {
    if (!discount) return;

    setFormData({
      code: discount.code,
      description: discount.description || '',
      image: discount.image || '',
      discountType: discount.percentage ? 'percentage' : 'fixedAmount',
      percentage: discount.percentage || '',
      fixedAmount: discount.fixedAmount || '',
      minOrderAmount: discount.minOrderAmount ?? '0',
      maxDiscountAmount: discount.maxDiscountAmount ?? '',
      usageLimit: discount.usageLimit ?? '',
      startDate: toLocalInput(discount.startDate),
      endDate: toLocalInput(discount.endDate),
      isActive: toBoolean(discount.isActive ?? true),
      isFlashSale: toBoolean(discount.isFlashSale),
      applicableToProducts: discount.applicableToProducts || [],
    });

    setImagePreview(discount.image || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount]);

  useEffect(() => {
    if (isEdit) return;
    setFormData({
      ...DEFAULT_FORM,
      isFlashSale: isFlashSaleCreate,
    });
  }, [isEdit, isFlashSaleCreate]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useCreateDiscount();
  const updateMutation = useUpdateDiscount();

  // ── Helpers: categories & products ───────────────────────────────────────
  const loadCategories = useCallback(async () => {
    try {
      const res = await apiService.get('/categories');
      const list = res?.data || (Array.isArray(res) ? res : []);
      setCategories(
        list.filter((c) => !c.parentId).map((c) => ({ id: c.id, name: c.name })),
      );
    } catch { /* ignore */ }
  }, []);

  const fetchProducts = useCallback(async (overrides = {}) => {
    setProductSearching(true);
    try {
      const merged = { ...productFilters, ...overrides };
      const params = {
        limit: 60,
        sortBy: merged.sortBy || 'sold',
        status: 'active',
        ...(merged.search     ? { search: merged.search }         : {}),
        ...(merged.categoryId ? { categoryId: merged.categoryId } : {}),
        ...(merged.inStock    ? { inStock: true }                  : {}),
      };
      const res = await apiService.get('/products', params);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setProductOptions(
        list.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.basePrice || p.price || 0,
          image: p.images?.[0]?.url || p.image || null,
          categoryId: p.categoryId,
        })),
      );
    } catch (e) {
      console.error('fetch products error', e);
    } finally {
      setProductSearching(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilters]);

  // ── Handlers: Flash Sale & Product picker ─────────────────────────────────
  const handleFlashSaleToggle = useCallback(() => {
    setFormData((prev) => ({ ...prev, isFlashSale: !prev.isFlashSale }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    const next = { ...productFilters, [key]: value };
    setProductFilters(next);
    fetchProducts({ ...next, search: productSearch });
  }, [productFilters, productSearch, fetchProducts]);

  const handleProductSearchChange = useCallback((e) => {
    const val = e.target.value;
    setProductSearch(val);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(
      () => fetchProducts({ search: val.trim() }),
      350,
    );
  }, [fetchProducts]);

  const handleClearSearch = useCallback(() => {
    setProductSearch('');
    fetchProducts({});
  }, [fetchProducts]);

  const handleResetFilters = useCallback(() => {
    const reset = { categoryId: '', sortBy: 'sold', inStock: false };
    setProductFilters(reset);
    fetchProducts(reset);
  }, [fetchProducts]);

  const toggleProduct = useCallback((pid) => {
    setFormData((prev) => {
      const curr = prev.applicableToProducts || [];
      return {
        ...prev,
        applicableToProducts: curr.includes(pid)
          ? curr.filter((x) => x !== pid)
          : [...curr, pid],
      };
    });
  }, []);

  const clearAllProducts = useCallback(() => {
    setFormData((p) => ({ ...p, applicableToProducts: [] }));
  }, []);

  const handleGenerateCode = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const smartPrefixes = [];
    if (formData.isFlashSale) smartPrefixes.push('FLASH');
    if (formData.discountType === 'percentage') smartPrefixes.push('SALE');
    if (formData.discountType === 'fixedAmount') smartPrefixes.push('SAVE');

    const prefix = smartPrefixes[0] || 'DEAL';
    const valuePart = formData.discountType === 'percentage'
      ? `${Math.min(99, Math.max(5, Number(formData.percentage) || 10))}`
      : `${Math.max(10, Math.round((Number(formData.fixedAmount) || 50000) / 10000))}K`;
    const randomPart = Math.random().toString(36).slice(2, 5).toUpperCase();
    setFormData((prev) => ({
      ...prev,
      code: `${prefix}${valuePart}${year}${randomPart}`.slice(0, 24),
    }));
  }, [formData.discountType, formData.fixedAmount, formData.isFlashSale, formData.percentage]);

  const getRealtimeValidation = useCallback(() => {
    const errors = {};
    const warnings = {};

    const percentage = Number(formData.percentage || 0);
    const fixedAmount = Number(formData.fixedAmount || 0);
    const minOrderAmount = Number(formData.minOrderAmount || 0);
    const maxDiscountAmount = Number(formData.maxDiscountAmount || 0);

    if (formData.discountType === 'percentage' && formData.percentage !== '') {
      if (percentage <= 0 || percentage > 100) {
        errors.percentage = 'Phần trăm phải từ 1 đến 100.';
      }
    }

    if (formData.discountType === 'fixedAmount' && formData.fixedAmount !== '') {
      if (fixedAmount <= 0) {
        errors.fixedAmount = 'Số tiền giảm phải lớn hơn 0.';
      }
    }

    if (formData.maxDiscountAmount !== '' && maxDiscountAmount <= 0) {
      errors.maxDiscountAmount = 'Giảm tối đa phải lớn hơn 0.';
    }

    if (formData.usageLimit !== '' && Number(formData.usageLimit) <= 0) {
      errors.usageLimit = 'Giới hạn sử dụng phải lớn hơn 0.';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        errors.endDate = 'Ngày kết thúc phải lớn hơn ngày bắt đầu.';
      }
    }

    if (
      formData.maxDiscountAmount !== '' &&
      formData.minOrderAmount !== '' &&
      minOrderAmount > 0 &&
      maxDiscountAmount > 0 &&
      minOrderAmount > maxDiscountAmount
    ) {
      warnings.minOrderAmount = 'Đơn tối thiểu đang lớn hơn mức giảm tối đa, nên kiểm tra lại logic ưu đãi.';
    }

    if (formData.isFlashSale) {
      if (!formData.endDate) {
        warnings.flashSale = 'Flash Sale nên có thời gian kết thúc rõ ràng.';
      }
      if ((formData.applicableToProducts || []).length === 0) {
        warnings.flashSaleProducts = 'Flash Sale nên chọn sản phẩm cụ thể để tránh áp dụng toàn bộ.';
      }
    }

    return { errors, warnings };
  }, [formData]);

  const realtimeValidation = getRealtimeValidation();

  const getRealtimeStatus = useCallback(() => {
    const now = new Date();
    if (!formData.isActive) return 'INACTIVE';
    if (!formData.startDate) return 'DRAFT';

    const start = new Date(formData.startDate);
    const end = formData.endDate ? new Date(formData.endDate) : null;

    if (start > now) return 'UPCOMING';
    if (end && end < now) return 'EXPIRED';
    return 'ACTIVE';
  }, [formData.endDate, formData.isActive, formData.startDate]);

  const discountPreview = useCallback(() => {
    const subtotal = PREVIEW_ORDER_TOTAL;
    const percentage = Number(formData.percentage || 0);
    const fixedAmount = Number(formData.fixedAmount || 0);
    const maxDiscountAmount = Number(formData.maxDiscountAmount || 0);

    let discountAmount = 0;
    if (formData.discountType === 'percentage' && percentage > 0) {
      discountAmount = Math.round((subtotal * percentage) / 100);
    }
    if (formData.discountType === 'fixedAmount' && fixedAmount > 0) {
      discountAmount = fixedAmount;
    }

    if (maxDiscountAmount > 0) {
      discountAmount = Math.min(discountAmount, maxDiscountAmount);
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return {
      sampleSubtotal: subtotal,
      discountAmount,
      finalAmount: subtotal - discountAmount,
    };
  }, [formData.discountType, formData.fixedAmount, formData.maxDiscountAmount, formData.percentage]);

  // ── Handlers: Image ───────────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { notify.error('Vui lòng chọn file ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { notify.error('Kích thước ảnh tối đa 5MB'); return; }

    try {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      const urls = await uploadService.uploadImages(file);
      if (urls?.length > 0) {
        setFormData((prev) => ({ ...prev, image: urls[0] }));
        notify.success('Tải ảnh lên thành công');
      }
    } catch {
      notify.error('Không thể tải ảnh lên');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = useCallback(() => {
    setFormData((p) => ({ ...p, image: '' }));
    setImagePreview(null);
  }, []);

  // ── Handler: Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors } = realtimeValidation;
    if (Object.keys(errors).length > 0) {
      notify.error(Object.values(errors)[0]);
      return;
    }

    if (!formData.code.trim()) { notify.error('Vui lòng nhập mã giảm giá'); return; }
    if (!formData.startDate)   { notify.error('Vui lòng chọn ngày bắt đầu'); return; }

    if (formData.discountType === 'percentage') {
      const pct = parseFloat(formData.percentage);
      if (!pct || pct <= 0 || pct > 100) { notify.error('Phần trăm phải từ 1–100'); return; }
    } else {
      const amt = parseFloat(formData.fixedAmount);
      if (!amt || amt <= 0) { notify.error('Số tiền giảm phải > 0'); return; }
    }

    if (formData.minOrderAmount !== '' && Number(formData.minOrderAmount) < 0) {
      notify.error('Đơn hàng tối thiểu phải >= 0');
      return;
    }

    if (formData.maxDiscountAmount !== '' && Number(formData.maxDiscountAmount) <= 0) {
      notify.error('Giảm tối đa phải > 0');
      return;
    }

    if (formData.usageLimit !== '' && Number(formData.usageLimit) <= 0) {
      notify.error('Giới hạn sử dụng phải > 0');
      return;
    }

    if (formData.isFlashSale && !formData.endDate) {
      notify.error('Flash Sale cần có ngày kết thúc để tránh chạy vô thời hạn');
      return;
    }

    const applicableProducts = (formData.applicableToProducts || []).filter(
      (id) => typeof id === 'number' && Number.isFinite(id),
    );

    if (formData.isFlashSale && applicableProducts.length === 0) {
      notify.error('Flash Sale cần chọn ít nhất 1 sản phẩm cụ thể');
      return;
    }

    const baseSubmitData = {
      code:        formData.code.toUpperCase().trim(),
      description: formData.description.trim() || undefined,
      image:       formData.image || undefined,
      percentage:   formData.discountType === 'percentage'  ? parseFloat(formData.percentage)  : null,
      fixedAmount:  formData.discountType === 'fixedAmount' ? parseFloat(formData.fixedAmount) : null,
      startDate:   new Date(formData.startDate).toISOString(),
      endDate:     formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      isFlashSale: formData.isFlashSale,
      ...(applicableProducts.length > 0 ? { applicableToProducts: applicableProducts } : {}),
    };

    const extendedSubmitData = {
      ...baseSubmitData,
      minOrderAmount: formData.minOrderAmount !== '' ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount !== '' ? parseFloat(formData.maxDiscountAmount) : null,
      usageLimit: formData.usageLimit !== '' ? Number(formData.usageLimit) : null,
      isActive: formData.isActive,
    };

    const isUnsupportedFieldError = (error) => {
      const messages = error?.response?.data?.message || error?.message || [];
      const list = Array.isArray(messages) ? messages : [messages];
      const text = list.join(' | ').toLowerCase();
      return (
        text.includes('minorderamount should not exist') ||
        text.includes('maxdiscountamount should not exist') ||
        text.includes('usagelimit should not exist') ||
        text.includes('isactive should not exist')
      );
    };

    setLoading(true);
    try {
      try {
        if (isEdit) {
          await updateMutation.mutateAsync({ id: Number(id), data: extendedSubmitData });
        } else {
          await createMutation.mutateAsync(extendedSubmitData);
        }
      } catch (error) {
        // Backward compatibility cho backend cũ chưa cập nhật DTO mới.
        if (!isUnsupportedFieldError(error)) {
          throw error;
        }

        if (isEdit) {
          await updateMutation.mutateAsync({ id: Number(id), data: baseSubmitData });
        } else {
          await createMutation.mutateAsync(baseSubmitData);
        }
      }
      navigate(isFlashSaleCreate ? '/admin-flash-sales' : '/admin-discounts');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // ── Field onChange helper ─────────────────────────────────────────────────
  const handleFieldChange = useCallback((field, value) => {
    setFormData((p) => ({
      ...p,
      [field]: field === 'isFlashSale'
        ? (isFlashSaleCreate ? true : toBoolean(value))
        : (field === 'isActive' ? toBoolean(value) : value),
    }));
  }, [isFlashSaleCreate]);

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    // Routing info
    isEdit,
    isFlashSaleCreate,
    discount,
    fetchLoading,

    // Form
    formData,
    loading,
    isSubmitting,
    handleFieldChange,
    handleSubmit,
    realtimeValidation,
    realtimeStatus: getRealtimeStatus(),
    previewData: discountPreview(),

    // Image
    imagePreview,
    uploading,
    handleImageUpload,
    handleImageRemove,

    // Product picker
    productOptions,
    productSearching,
    productSearch,
    productFilters,
    categories,
    handleFlashSaleToggle,
    handleFilterChange,
    handleProductSearchChange,
    handleClearSearch,
    handleResetFilters,
    toggleProduct,
    clearAllProducts,
    handleGenerateCode,
  };
};

export default useDiscountForm;
