import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Form } from "antd";
import productService from "../services/productService";
import { notify } from "../utils/notification";
import { useCategories, useBrands } from "./useProducts";

const generateSlug = (name) => {
  return (name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
};

export const useProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [productImages, setProductImages] = useState([]);
  const [productImagesToDelete, setProductImagesToDelete] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantsToDelete, setVariantsToDelete] = useState([]);
  const [nextVariantId, setNextVariantId] = useState(1);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoadingProduct(true);
    productService.getOne(id).then((res) => {
      const p = res?.data || res;
      form.setFieldsValue({
        name: p.name, slug: p.slug, description: p.description,
        categoryId: p.categoryId, brandId: p.brandId, basePrice: p.basePrice,
        isActive: p.isActive !== false, metaTitle: p.metaTitle, metaDesc: p.metaDesc,
      });
      setProductImages((p.images || []).filter(img => !img.variantId).map((img, idx) => ({
        id: img.id, url: img.url, isThumbnail: idx === 0, tempId: `existing-${img.id}`
      })));
      setVariants((p.variants || []).map((v, idx) => ({
        ...v, images: (v.images || []).map((im, i) => ({ ...im, tempId: im.id ? `existing-${im.id}` : `vi-${idx}-${i}` }))
      })));
    }).catch(() => notify.error("Lỗi tải sản phẩm")).finally(() => setLoadingProduct(false));
  }, [id, isEdit, form]);

  const handleProductImageSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []).filter(f => f?.size > 0);
    setProductImages(prev => [...prev, ...files.map((file, idx) => ({ file, tempId: `new-${Date.now()}-${idx}` }))].slice(0, 20));
    e.target.value = "";
  }, []);

  const uploadVariantImagesHelper = async (vId, images) => {
    const files = (images || []).filter(im => im.file).map(im => im.file);
    if (files.length) await productService.uploadVariantImages(vId, files, { isPrimary: false });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values, categoryId: Number(values.categoryId), brandId: values.brandId ? Number(values.brandId) : undefined };
      const pid = isEdit ? id : (await productService.create(payload))?.data?.id;
      if (isEdit) await productService.update(id, payload);

      // Handle Image Deletions
      if (isEdit) for (const imgId of productImagesToDelete) await productService.deleteImage(imgId);

      // Handle Main Image Uploads
      const newImgs = productImages.filter(img => img.file).map(img => img.file);
      if (newImgs.length) await productService.uploadImages(pid || id, newImgs, { isThumbnail: productImages[0]?.isThumbnail || false });

      // Handle Variants
      if (isEdit) for (const vid of variantsToDelete) await productService.deleteVariant(vid);
      for (const v of variants) {
        const vPayload = { ...v, price: Number(v.price) || payload.basePrice, stock: Number(v.stock) || 0 };
        if (typeof v.id !== "number") {
          const newV = await productService.addVariant(pid || id, vPayload);
          const newVId = (newV?.data || newV)?.id;
          if (newVId && v.images?.length) await uploadVariantImagesHelper(newVId, v.images);
        } else {
          await productService.updateVariant(v.id, vPayload);
          if (v.images?.length) await uploadVariantImagesHelper(v.id, v.images);
        }
      }

      notify.success("Thành công");
      navigate(`/admin-products/${pid || id}`);
    } catch (err) {
      notify.error("Lỗi: " + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return {
    form, isEdit, loading, loadingProduct, productImages, setProductImages, 
    removeProductImage: (tId) => setProductImages(prev => {
      const img = prev.find(i => i.tempId === tId);
      if (img?.id) setProductImagesToDelete(d => [...d, img.id]);
      return prev.filter(i => i.tempId !== tId);
    }),
    handleProductImageSelect, variants, 
    addVariant: () => setVariants(prev => [...prev, { id: `temp-${Date.now()}`, size: "", color: "", price: form.getFieldValue("basePrice"), stock: 0, isActive: true, images: [] }]),
    removeVariant: (vId) => setVariants(prev => {
      const v = prev.find(x => x.id === vId);
      if (typeof v?.id === "number") setVariantsToDelete(d => [...d, v.id]);
      return prev.filter(x => x.id !== vId);
    }),
    updateVariant: (vId, up) => setVariants(prev => prev.map(v => v.id === vId ? { ...v, ...up } : v)),
    handleVariantImageSelect: (vId, e) => {
      const files = Array.from(e.target.files || []);
      setVariants(prev => prev.map(v => v.id !== vId ? v : { ...v, images: [...(v.images || []), ...files.map(f => ({ file: f, tempId: Date.now() + Math.random() }))] }));
    },
    removeVariantImage: (vId, tId) => setVariants(prev => prev.map(v => v.id !== vId ? v : { ...v, images: (v.images || []).filter(img => img.tempId !== tId) })),
    categories, brands, handleNameChange: (e) => form.setFieldsValue({ slug: generateSlug(e.target.value) }), handleSubmit,
    handleCancel: () => navigate(isEdit ? `/admin-products/${id}` : "/admin-products")
  };
};
