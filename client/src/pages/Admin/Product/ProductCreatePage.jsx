import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Form } from 'antd';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import productService from '../../../services/productService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import ProductFormUnified from '../../../components/admin/Product/ProductFormUnified';

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
    const el = document.getElementById('variants');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      basePriceRaw === '' || basePriceRaw === undefined || basePriceRaw === null
        ? undefined
        : Number(basePriceRaw);

    return {
      name: (values.name || '').trim(),
      slug: (values.slug || '').trim() || generateSlug(values.name || ''),
      description: (values.description || '').trim() || undefined,
      // Chỉ gửi basePrice khi có giá trị hợp lệ (tránh gửi 0 làm backend 400)
      basePrice: Number.isFinite(basePrice) ? basePrice : undefined,
      categoryId: values.categoryId ? Number(values.categoryId) : undefined,
      brandId: values.brandId ? Number(values.brandId) : undefined,
      // Backend update dùng status (active/draft/inactive) thay vì isActive
      status: values.isActive === false ? 'inactive' : 'active',
      metaTitle: values.metaTitle?.trim() || undefined,
      metaDesc: values.metaDesc?.trim() || undefined,
    };
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
            notify.warning('Cập nhật sản phẩm xong nhưng upload ảnh mới lỗi.');
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
                const withFile = variant.images.filter((im) => im.file);
                if (withFile.length) {
                  const files = withFile.map((im) => im.file);
                  const prim = withFile.find((im) => im.isPrimary) || withFile[0];
                  await productService.uploadVariantImages(vId, files, { isPrimary: prim?.isPrimary || false });
                }
              }
            } catch (e) {
              notify.warning(`Không tạo được biến thể ${variant.size || ''} - ${variant.color || ''}.`);
            }
          } else {
            try {
              await productService.updateVariant(variant.id, payload);
              // Upload thêm ảnh mới cho variant đã tồn tại (trước đây bị thiếu)
              const withFile = (variant.images || []).filter((im) => im.file);
              if (withFile.length) {
                try {
                  const files = withFile.map((im) => im.file);
                  const prim = withFile.find((im) => im.isPrimary) || withFile[0];
                  await productService.uploadVariantImages(variant.id, files, { isPrimary: prim?.isPrimary || false });
                } catch (e) {
                  notify.warning(`Đã cập nhật biến thể nhưng upload ảnh lỗi: ${variant.size || ''} - ${variant.color || ''}.`);
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
            const vWithFile = variant.images.filter((im) => im.file);
            if (vWithFile.length) {
              const files = vWithFile.map((im) => im.file);
              const prim = vWithFile.find((im) => im.isPrimary) || vWithFile[0];
              await productService.uploadVariantImages(vId, files, { isPrimary: prim?.isPrimary || false });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Header: breadcrumb + title (giống reference) */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/admin-products"
              className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
              aria-label="Quay lại"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                <Link to="/admin-products" className="hover:text-gray-700">Sản phẩm</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">
                  {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </span>
              </nav>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Nhập thông tin chi tiết về sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      {loadingProduct ? (
        <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />
      ) : (
        <ProductFormUnified
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
