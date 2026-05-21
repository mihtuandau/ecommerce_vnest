"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/Form";
import { ordersApi } from "@/features/orders/api/orders.api";
import { productsApi } from "@/features/products/api";
import { toast } from "sonner";
import { useOrderCart, OrderFormValues } from "@/features/orders/hooks/useOrderCart";
import { ProductBrowser } from "./ProductBrowser";
import { OrderCart } from "./OrderCart";
import { VariantSelector } from "./VariantSelector";
import { Category, Product, ProductVariant } from "@/types/models";
import { SubmitHandler } from "react-hook-form";

export function AdminOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const {
    form,
    items,
    subtotal,
    discountAmount,
    total,
    appliedDiscount,
    isValidatingDiscount,
    addVariantToCart,
    updateQuantity,
    removeListItem,
    validateDiscount,
  } = useOrderCart();

  useEffect(() => {
    setOrderId(Math.floor(1000 + Math.random() * 9000));
    const init = async () => {
      try {
        const catRes = await productsApi.getCategories();
        setCategories(catRes.data || catRes || []);
        fetchProducts("", null);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  const fetchProducts = useCallback(async (q: string, catId: number | null) => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { search: q, limit: 40 };
      if (catId) params.categoryId = catId.toString();
      const res = await productsApi.getProducts(params);
      setProducts(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search, selectedCat);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, selectedCat, fetchProducts]);

  const handleProductClick = async (product: Product) => {
    let targetProduct = product;

    // Fallback: If variants are missing, fetch full product details
    if (!product.variants || product.variants.length === 0) {
      try {
        const fullProduct = await productsApi.getProduct(product.id.toString());
        if (fullProduct) targetProduct = fullProduct;
      } catch (e) {
        console.error("Failed to fetch full product variants", e);
      }
    }

    const activeVariants =
      targetProduct.variants?.filter((v: ProductVariant) => v.isActive !== false) || [];

    if (activeVariants.length === 0) {
      toast.error("Sản phẩm hiện không có biến thể nào khả dụng");
      return;
    }

    if (activeVariants.length === 1) {
      addVariantToCart(targetProduct, activeVariants[0]);
    } else {
      setActiveProduct(targetProduct);
    }
  };

  const onSubmit: SubmitHandler<OrderFormValues> = async (values) => {
    try {
      setIsSubmitting(true);
      const cleanItems = (values.items || []).map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = { ...values, items: cleanItems };
      const res = await ordersApi.createAdminOrder(payload as any);
      toast.success("Tạo đơn hàng thành công");
      router.push(`/admin/orders/${res.id || res.orderCode}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo đơn hàng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm font-sans">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="flex w-full"
        >
          <ProductBrowser
            categories={categories}
            products={products}
            selectedCat={selectedCat}
            onSelectCat={setSelectedCat}
            search={search}
            onSearchChange={setSearch}
            isLoading={isLoading}
            onProductClick={handleProductClick}
          />

          <OrderCart
            orderId={orderId}
            items={items}
            onRemoveAll={() => {
              form.setValue("items", []);
            }}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeListItem}
            form={form}
            subtotal={subtotal}
            discountAmount={discountAmount}
            total={total}
            appliedDiscount={appliedDiscount}
            isValidatingDiscount={isValidatingDiscount}
            onValidateDiscount={validateDiscount}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>

      <VariantSelector
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onSelectVariant={(p, v) => {
          addVariantToCart(p, v);
          setActiveProduct(null);
        }}
      />
    </div>
  );
}
