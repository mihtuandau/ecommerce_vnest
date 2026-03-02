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
  startDate: '',
  endDate: '',
  isFlashSale: false,
  applicableToProducts: [],
};

const toLocalInput = (iso) =>
  iso ? new Date(iso).toISOString().slice(0, 16) : '';

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
      startDate: toLocalInput(discount.startDate),
      endDate: toLocalInput(discount.endDate),
      isFlashSale: discount.isFlashSale || false,
      applicableToProducts: discount.applicableToProducts || [],
    });

    setImagePreview(discount.image || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount]);

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

    if (!formData.code.trim()) { notify.error('Vui lòng nhập mã giảm giá'); return; }
    if (!formData.startDate)   { notify.error('Vui lòng chọn ngày bắt đầu'); return; }

    if (formData.discountType === 'percentage') {
      const pct = parseFloat(formData.percentage);
      if (!pct || pct <= 0 || pct > 100) { notify.error('Phần trăm phải từ 1–100'); return; }
    } else {
      const amt = parseFloat(formData.fixedAmount);
      if (!amt || amt <= 0) { notify.error('Số tiền giảm phải > 0'); return; }
    }

    const submitData = {
      code:        formData.code.toUpperCase().trim(),
      description: formData.description.trim() || undefined,
      image:       formData.image || undefined,
      percentage:   formData.discountType === 'percentage'  ? parseFloat(formData.percentage)  : null,
      fixedAmount:  formData.discountType === 'fixedAmount' ? parseFloat(formData.fixedAmount) : null,
      startDate:   new Date(formData.startDate).toISOString(),
      endDate:     formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
      isFlashSale: formData.isFlashSale,
      applicableToProducts: formData.applicableToProducts || [],
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: Number(id), data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      navigate('/admin-discounts');
    } catch (error) {
      notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // ── Field onChange helper ─────────────────────────────────────────────────
  const handleFieldChange = useCallback((field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  }, []);

  // ── Return ─────────────────────────────────────────────────────────────────
  return {
    // Routing info
    isEdit,
    discount,
    fetchLoading,

    // Form
    formData,
    loading,
    handleFieldChange,
    handleSubmit,

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
  };
};

export default useDiscountForm;
