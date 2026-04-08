import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from 'antd';
import { Form } from 'antd';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import productService from '../../../services/productService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import ProductFormWizard from '../../../components/admin/Product/ProductFormWizard';

const generateSlug = (name) => {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const ProductCreatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [product, setProduct] = useState(null);

  // Product images: { file?, id?, url?, isThumbnail, displayOrder, altText, tempId } — new có file, existing có id+url
  const [productImages, setProductImages] = useState([]);
  const [productImagesToDelete, setProductImagesToDelete] = useState([]);

  const [variants, setVariants] = useState([]);
  const [variantsToDelete, setVariantsToDelete] = useState([]);
  const [nextVariantId, setNextVariantId] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  useEffect(() => {
    if (!isEdit || !id) return;
    let cancelled = false;
    setLoadingProduct(true);
    productService
      .getOne(id)
      .then((res) => {
        const p = res?.data || res;
        if (cancelled || !p?.id) return;
        setProduct(p);
        form.setFieldsValue({
          name: p.name || '',
          slug: p.slug || '',
          description: p.description || '',
          categoryId: p.categoryId || undefined,
          brandId: p.brandId || undefined,
          basePrice: p.basePrice ?? 0,
          isActive: p.isActive !== false,
          metaTitle: p.metaTitle || '',
          metaDesc: p.metaDesc || '',
        });
        const mainImages = (p.images || []).filter((img) => !img.variantId);
        setProductImages(
          mainImages.map((img, idx) => ({
            id: img.id,
            url: img.url,
            isThumbnail: idx === 0,
            displayOrder: idx,
            altText: img.altText || '',
            tempId: `existing-${img.id}`,
          }))
        );
        const vList = (p.variants || []).map((v, idx) => ({
          ...v,
          images: (v.images || []).map((im, i) => ({
            ...im,
            tempId: im.id ? `existing-${im.id}` : `vi-${idx}-${i}`,
          })),
        }));
        setVariants(vList);
        setNextVariantId(vList.length + 1);
      })
      .catch((err) => {
        if (!cancelled) {
          notify.error(err?.message || 'Không tải được sản phẩm');
          navigate('/admin-products');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingProduct(false);
      });
    return () => { cancelled = true; };
  }, [id, isEdit, form, navigate]);

  // Scroll to #variants when navigating from "Quản lý biến thể" / "Thêm biến thể"
  useEffect(() => {
    if (location.hash !== '#variants' || loadingProduct) return;
    // Delay để đợi DOM render xong
    const timer = setTimeout(() => {
      const el = document.getElementById('variants');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.hash, loadingProduct]);

  // Auto-generate slug when name changes
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    form.setFieldsValue({ slug });
  };

  // Product Images
  const handleProductImageSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []).filter((f) => f && f.size > 0);
    if (!files.length) return;
    const base = productImages.length;
    const newImages = files.map((file, idx) => ({
      file,
      isThumbnail: base === 0 && idx === 0,
      displayOrder: base + idx,
      altText: '',
      tempId: `new-${Date.now()}-${idx}`,
    }));
    setProductImages((prev) => [...prev, ...newImages].slice(0, 20));
    e.target.value = '';
  }, [productImages.length]);

  const removeProductImage = useCallback((tempId) => {
    setProductImages((prev) => {
      const img = prev.find((i) => i.tempId === tempId);
      if (img?.id) setProductImagesToDelete((d) => [...d, img.id]);
      const filtered = prev.filter((i) => i.tempId !== tempId);
      return filtered.map((i, idx) => ({ ...i, displayOrder: idx }));
    });
  }, []);

  const updateProductImage = useCallback((tempId, updates) => {
    setProductImages((prev) =>
      prev.map((img) => (img.tempId === tempId ? { ...img, ...updates } : img))
    );
  }, []);

  // Variants
  const addVariant = useCallback(() => {
    const newVariant = {
      id: `temp-${nextVariantId}`,
      size: '',
      color: '',
      price: form.getFieldValue('basePrice') || 0,
      stock: 0,
      sku: '',
      lowStockThreshold: 5,
      isActive: true,
      images: [],
    };
    setVariants((prev) => [...prev, newVariant]);
    setNextVariantId((prev) => prev + 1);
  }, [nextVariantId, form]);

  const removeVariant = useCallback((variantId) => {
    setVariants((prev) => {
      const v = prev.find((x) => x.id === variantId);
      if (v && typeof v.id === 'number') setVariantsToDelete((d) => [...d, v.id]);
      return prev.filter((x) => x.id !== variantId);
    });
  }, []);

  const updateVariant = useCallback((id, updates) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  // Variant Images
  const handleVariantImageSelect = useCallback((variantId, e) => {
    const files = Array.from(e.target.files || []).filter((f) => f && f.size > 0);
    if (!files.length) return;
    
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const currentImages = v.images || [];
        const newImages = files.map((file, idx) => ({
          file,
          isPrimary: currentImages.length === 0 && idx === 0,
          displayOrder: currentImages.length + idx,
          altText: '',
          tempId: Date.now() + idx,
        }));
        return {
          ...v,
          images: [...currentImages, ...newImages].slice(0, 10),
        };
      })
    );
    e.target.value = '';
  }, []);

  const removeVariantImage = useCallback((variantId, tempId) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        const filtered = (v.images || []).filter((img) => img.tempId !== tempId);
        return {
          ...v,
          images: filtered.map((img, idx) => ({ ...img, displayOrder: idx })),
        };
      })
    );
  }, []);

  const updateVariantImage = useCallback((variantId, tempId, updates) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;
        return {
          ...v,
          images: (v.images || []).map((img) =>
            img.tempId === tempId ? { ...img, ...updates } : img
          ),
        };
      })
    );
  }, []);

  const buildProductPayload = (values) => {
    const basePriceRaw = values.basePrice;
    const basePrice =
      (basePriceRaw === '' || basePriceRaw === undefined || basePriceRaw === null)
        ? undefined
        : Number(basePriceRaw);

    const payload = {
      name: (values.name || '').trim(),
      description: (values.description || '').trim() || undefined,
      // Chỉ gửi basePrice khi có giá trị hợp lệ (tránh gửi 0 làm backend 400)
      basePrice: Number.isFinite(basePrice) ? basePrice : undefined,
      categoryId: values.categoryId ? Number(values.categoryId) : undefined,
      brandId: values.brandId ? Number(values.brandId) : undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    return payload;
  };

  // Helper function: Upload variant images
  const uploadVariantImagesHelper = async (variantId, images) => {
    const withFile = (images || []).filter((im) => im.file);
    if (withFile.length === 0) return;
    
    try {
      const files = withFile.map((im) => im.file);
      const prim = withFile.find((im) => im.isPrimary) || withFile[0];
      await productService.uploadVariantImages(variantId, files, { isPrimary: prim?.isPrimary || false });
    } catch (e) {
      throw new Error(`Không thể upload ảnh variant: ${e.message}`);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const productPayload = buildProductPayload(values);

    try {
      if (isEdit) {
        await productService.update(id, productPayload);
        for (const imageId of productImagesToDelete) {
          try { await productService.deleteImage(imageId); } catch (e) { /* ignore */ }
        }
        const newProductImages = productImages.filter((img) => img.file);
        if (newProductImages.length > 0) {
          try {
            const files = newProductImages.map((img) => img.file);
            const first = newProductImages.find((img) => img.isThumbnail) || newProductImages[0];
            await productService.uploadImages(id, files, { isThumbnail: first?.isThumbnail || false });
          } catch (e) {
            notify.warning('Cập nhật sản phẩm thành công nhưng upload ảnh mới lỗi.');
          }
        }
        for (const vid of variantsToDelete) {
          try { await productService.deleteVariant(vid); } catch (e) { /* ignore */ }
        }
        for (const variant of variants) {
          const isNew = typeof variant.id !== 'number';
          const payload = {
            size: variant.size || undefined,
            color: variant.color || undefined,
            price: Number(variant.price) || productPayload.basePrice,
            stock: Number(variant.stock) || 0,
            sku: variant.sku?.trim() || undefined,
            lowStockThreshold: Number(variant.lowStockThreshold) || 5,
            isActive: variant.isActive !== false,
          };
          if (isNew) {
            try {
              const vr = await productService.addVariant(id, payload);
              const vId = (vr?.data || vr)?.id;
              if (vId && variant.images?.length) {
                try {
                  await uploadVariantImagesHelper(vId, variant.images);
                } catch (e) {
                  notify.warning(`Tạo biến thể ${variant.size || ''} - ${variant.color || ''} thành công nhưng upload ảnh lỗi.`);
                }
              }
            } catch (e) {
              notify.warning(`Không tạo được biến thể ${variant.size || ''} - ${variant.color || ''}.`);
            }
          } else {
            try {
              await productService.updateVariant(variant.id, payload);
              // Upload thêm ảnh mới cho variant đã tồn tại
              if (variant.images?.length) {
                try {
                  await uploadVariantImagesHelper(variant.id, variant.images);
                } catch (e) {
                  notify.warning(`Cập nhật biến thể ${variant.size || ''} - ${variant.color || ''} thành công nhưng upload ảnh lỗi.`);
                }
              }
            } catch (e) {
              notify.warning(`Không cập nhật được biến thể ${variant.size || ''} - ${variant.color || ''}.`);
            }
          }
        }
        notify.success('Đã cập nhật sản phẩm');
        navigate(`/admin-products/${id}`);
        return;
      }

      const res = await productService.create(productPayload);
      const created = res?.data || res;
      const pid = created?.id;
      if (!pid) throw new Error('Không nhận được ID sản phẩm sau khi tạo');

      const withFile = productImages.filter((img) => img.file);
      if (withFile.length > 0) {
        try {
          const files = withFile.map((img) => img.file);
          const first = withFile.find((img) => img.isThumbnail) || withFile[0];
          await productService.uploadImages(pid, files, { isThumbnail: first?.isThumbnail || false });
        } catch (e) {
          notify.warning('Đã tạo sản phẩm nhưng upload ảnh lỗi. Thêm ảnh tại trang chi tiết.');
        }
      }

      for (const variant of variants) {
        try {
          const vPayload = {
            size: variant.size || undefined,
            color: variant.color || undefined,
            price: Number(variant.price) || productPayload.basePrice,
            stock: Number(variant.stock) || 0,
            sku: variant.sku?.trim() || undefined,
            lowStockThreshold: Number(variant.lowStockThreshold) || 5,
            isActive: variant.isActive !== false,
          };
          const vr = await productService.addVariant(pid, vPayload);
          const vId = (vr?.data || vr)?.id;
          if (vId && variant.images?.length) {
            try {
              await uploadVariantImagesHelper(vId, variant.images);
            } catch (e) {
              notify.warning(`Tạo biến thể ${variant.size || ''} - ${variant.color || ''} thành công nhưng upload ảnh lỗi.`);
            }
          }
        } catch (e) {
          notify.warning(`Không tạo được biến thể ${variant.size || ''} - ${variant.color || ''}.`);
        }
      }

      notify.success('Đã tạo sản phẩm thành công');
      navigate(`/admin-products/${pid}`);
    } catch (err) {
      notify.error(err?.response?.data?.message || err?.message || (isEdit ? 'Cập nhật thất bại' : 'Tạo sản phẩm thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit && id) navigate(`/admin-products/${id}`);
    else navigate('/admin-products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Quay lại"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
                <Link to="/admin-products" className="hover:text-gray-700 transition-colors">Sản phẩm</Link>
                <span>›</span>
                <span className="text-gray-700 font-medium">{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}</span>
              </nav>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-lg font-semibold text-emerald-700">
              <Eye size={18} /> Đang hiển thị
            </span>
            <Button
              onClick={handleCancel}
              className="h-12 rounded-xl border-gray-200 px-5 text-lg font-semibold text-gray-700 shadow-none"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
              className="h-12 rounded-xl bg-blue-600 px-6 text-lg font-semibold shadow-md shadow-blue-200 hover:bg-blue-700"
            >
              {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
            </Button>
          </div>
        </div>
      </div>

      {loadingProduct ? (
        <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />
      ) : (
        <ProductFormWizard
          form={form}
          productImages={productImages}
          setProductImages={setProductImages}
          removeProductImage={removeProductImage}
          updateProductImage={updateProductImage}
          handleProductImageSelect={handleProductImageSelect}
          variants={variants}
          addVariant={addVariant}
          removeVariant={removeVariant}
          updateVariant={updateVariant}
          handleVariantImageSelect={handleVariantImageSelect}
          removeVariantImage={removeVariantImage}
          updateVariantImage={updateVariantImage}
          categories={categories}
          brands={brands}
          loading={loading}
          isEdit={isEdit}
          submitLabel={isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
          onCancel={handleCancel}
          onNameChange={handleNameChange}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ProductCreatePage;
