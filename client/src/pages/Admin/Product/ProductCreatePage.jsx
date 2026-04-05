import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Form } from 'antd';
import { useCategories, useBrands } from '../../../hooks/useProducts';
import productService from '../../../services/productService';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import ProductForm from '../../../components/admin/Product/ProductForm';

const normalizeOption = (value) => String(value || '').trim().toLowerCase();

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
  const [variantImagesToDelete, setVariantImagesToDelete] = useState([]);
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
        setVariantImagesToDelete([]);
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

  const addVariantsBulk = useCallback((sizesInput, colorsInput, options = {}) => {
    const parseList = (text) =>
      String(text || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);

    const sanitizeForSku = (v) =>
      String(v || '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toUpperCase();

    const buildSku = (prefix, size, color) => {
      const p = sanitizeForSku(prefix);
      if (!p) return '';
      const s = sanitizeForSku(size);
      const c = sanitizeForSku(color);
      return [p, s, c].filter(Boolean).join('-');
    };

    const sizes = parseList(sizesInput);
    const colors = parseList(colorsInput);

    const normalizedSizes = sizes.length ? sizes : [''];
    const normalizedColors = colors.length ? colors : [''];

    const existingKeys = new Set(
      variants.map((v) => `${(v.size || '').trim().toLowerCase()}|${(v.color || '').trim().toLowerCase()}`),
    );

    const basePrice = Number(form.getFieldValue('basePrice') || 0);
    const inputPrice = Number(options.defaultPrice);
    const inputStock = Number(options.defaultStock);
    const priceToUse = Number.isFinite(inputPrice) && inputPrice >= 0 ? inputPrice : basePrice;
    const stockToUse = Number.isFinite(inputStock) && inputStock >= 0 ? inputStock : 0;
    const skuPrefix = options.skuPrefix || '';

    const toAdd = [];
    let localId = nextVariantId;

    for (const size of normalizedSizes) {
      for (const color of normalizedColors) {
        const key = `${String(size).trim().toLowerCase()}|${String(color).trim().toLowerCase()}`;
        if (existingKeys.has(key)) continue;

        existingKeys.add(key);
        toAdd.push({
          id: `temp-${localId++}`,
          size: size || '',
          color: color || '',
          price: priceToUse,
          stock: stockToUse,
          sku: buildSku(skuPrefix, size, color),
          lowStockThreshold: 5,
          isActive: true,
          images: [],
        });
      }
    }

    if (!toAdd.length) {
      notify.warning('Không có biến thể mới để thêm (có thể đã tồn tại).');
      return;
    }

    setVariants((prev) => [...prev, ...toAdd]);
    setNextVariantId(localId);
    notify.success(`Đã thêm nhanh ${toAdd.length} biến thể.`);
  }, [form, nextVariantId, variants]);

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
        const imgToRemove = (v.images || []).find((img) => img.tempId === tempId);
        if (imgToRemove?.id) {
          setVariantImagesToDelete((ids) => [...new Set([...ids, imgToRemove.id])]);
        }
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

  const clearVariantImages = useCallback((variantId) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id !== variantId) return v;

        const existingImageIds = (v.images || [])
          .filter((img) => img?.id)
          .map((img) => img.id);

        if (existingImageIds.length) {
          setVariantImagesToDelete((ids) => [...new Set([...ids, ...existingImageIds])]);
        }

        return {
          ...v,
          images: [],
        };
      }),
    );
  }, []);

  const setColorImageSource = useCallback((sourceVariantId) => {
    setVariants((prev) => {
      const sourceVariant = prev.find((v) => v.id === sourceVariantId);
      const sourceColor = sourceVariant?.color;
      const sourceColorKey = normalizeOption(sourceColor);

      if (!sourceColorKey || !Array.isArray(sourceVariant?.images) || sourceVariant.images.length === 0) {
        notify.warning('Biến thể nguồn cần có màu và ít nhất 1 ảnh.');
        return prev;
      }

      const imageIdsToDelete = [];

      const nextVariants = prev.map((v) => {
        const sameColor = normalizeOption(v.color) === sourceColorKey;
        if (!sameColor || v.id === sourceVariantId) return v;

        const existingIds = (v.images || [])
          .filter((img) => img?.id)
          .map((img) => img.id);

        if (existingIds.length) imageIdsToDelete.push(...existingIds);

        return {
          ...v,
          images: [],
        };
      });

      if (imageIdsToDelete.length) {
        setVariantImagesToDelete((ids) => [...new Set([...ids, ...imageIdsToDelete])]);
      }

      notify.success(`Đã đặt ảnh theo màu "${sourceColor}". Các size cùng màu sẽ kế thừa ảnh này.`);
      return nextVariants;
    });
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
        for (const imageId of variantImagesToDelete) {
          try { await productService.deleteVariantImage(imageId); } catch (e) { /* ignore */ }
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
      {/* Header */}
      <div className="w-full max-w-[1600px] mx-auto px-3 lg:px-4 pt-4 lg:pt-6 pb-2 lg:pb-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/admin-products"
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-1">
              <Link to="/admin-products" className="hover:text-gray-700 transition-colors">Sản phẩm</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">
                {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h1>
          </div>
        </div>
      </div>

      {loadingProduct ? (
        <Loading fullScreen text="Đang tải sản phẩm..." variant="admin" />
      ) : (
        <div className="w-full max-w-[1600px] mx-auto px-3 lg:px-4 pb-12">
          <ProductForm
            form={form}
            productImages={productImages}
            setProductImages={setProductImages}
            removeProductImage={removeProductImage}
            updateProductImage={updateProductImage}
            handleProductImageSelect={handleProductImageSelect}
            variants={variants}
            addVariant={addVariant}
            addVariantsBulk={addVariantsBulk}
            removeVariant={removeVariant}
            updateVariant={updateVariant}
            handleVariantImageSelect={handleVariantImageSelect}
            removeVariantImage={removeVariantImage}
            updateVariantImage={updateVariantImage}
            clearVariantImages={clearVariantImages}
            setColorImageSource={setColorImageSource}
            categories={categories}
            brands={brands}
            loading={loading}
            isEdit={isEdit}
            submitLabel={isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            onCancel={handleCancel}
            onNameChange={handleNameChange}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCreatePage;
