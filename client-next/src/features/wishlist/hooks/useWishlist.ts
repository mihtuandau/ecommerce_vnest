"use client";

import { useState, useEffect, useMemo } from "react";
import { useWishlistStore, WishlistItem } from "@/store/useWishlistStore";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { productsApi } from "@/features/products/api";
import type { Product } from "@/types/models";

export interface CustomCollection {
  name: string;
  icon: string;
}

export function useWishlist() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const { success, error } = useToast();
  const [mounted, setMounted] = useState(false);

  // Layout & Sorting states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc" | "discount">("recent");
  const [currentColl, setCurrentColl] = useState<string>("all");
  const [discountFilter, setDiscountFilter] = useState(false);

  // Custom Collections & Item Assignments
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([]);
  const [itemCollections, setItemCollections] = useState<Record<string, string>>({});

  // Modals visibility states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewCollModalOpen, setIsNewCollModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCollectionMenuId, setActiveCollectionMenuId] = useState<string | null>(null);

  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddingToCartMap, setIsAddingToCartMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);

    const savedCollections = localStorage.getItem("luxe-wishlist-collections-v2");
    if (savedCollections) {
      try {
        setCustomCollections(JSON.parse(savedCollections));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults = [
        { name: "Thời trang", icon: "Shirt" },
        { name: "Giày & Túi", icon: "ShoppingBag" },
        { name: "Mỹ phẩm", icon: "Sparkles" },
      ];
      setCustomCollections(defaults);
      localStorage.setItem("luxe-wishlist-collections-v2", JSON.stringify(defaults));
    }

    const savedAssignments = localStorage.getItem("luxe-wishlist-assignments-v2");
    if (savedAssignments) {
      try {
        setItemCollections(JSON.parse(savedAssignments));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Add to cart operations
  const handleAddToCart = async (item: WishlistItem) => {
    setIsAddingToCartMap((prev) => ({ ...prev, [item.id]: true }));
    try {
      const fullProduct = await productsApi.getProduct(item.slug, true);
      const variants = fullProduct.variants || [];
      const hasMultipleVariants = variants.length > 1;
      const hasOptions = variants.some((v: any) => v.size || v.color);

      if (hasMultipleVariants || hasOptions) {
        setQuickAddProduct(fullProduct);
        setIsQuickAddOpen(true);
        return;
      }

      const variantId = variants?.[0]?.id || fullProduct.id;
      addItem({
        productId: String(fullProduct.id),
        variantId: String(variantId),
        name: fullProduct.name,
        price: Number(fullProduct.price || fullProduct.basePrice || 0),
        originalPrice: fullProduct.originalPrice ? Number(fullProduct.originalPrice) : undefined,
        imageUrl: item.imageUrl,
        slug: fullProduct.slug,
        quantity: 1,
      });
      success(`Đã thêm ${fullProduct.name} vào giỏ hàng`);
    } catch (err) {
      console.error("Quick add fetch failed:", err);
      addItem({
        productId: String(item.id),
        variantId: String(item.variantId || item.id),
        name: item.name,
        price: Number(item.price),
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        imageUrl: item.imageUrl,
        slug: item.slug,
        quantity: 1,
      });
      success(`Đã thêm ${item.name} vào giỏ hàng`);
    } finally {
      setIsAddingToCartMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleAddAllToCart = async () => {
    if (items.length === 0) {
      error("Danh sách yêu thích trống!");
      return;
    }
    
    // Show a loading feedback to the user
    const loadingToast = success("🔄 Đang xử lý và đồng bộ toàn bộ sản phẩm...");
    
    try {
      const promises = items.map(async (item) => {
        try {
          const fullProduct = await productsApi.getProduct(item.slug, true);
          const variants = fullProduct.variants || [];
          const variantId = variants?.[0]?.id || fullProduct.id;
          return {
            productId: String(fullProduct.id),
            variantId: String(variantId),
            name: fullProduct.name,
            price: Number(fullProduct.price || fullProduct.basePrice || 0),
            originalPrice: fullProduct.originalPrice ? Number(fullProduct.originalPrice) : undefined,
            imageUrl: item.imageUrl,
            slug: fullProduct.slug,
            quantity: 1,
          };
        } catch (e) {
          return {
            productId: String(item.id),
            variantId: String(item.variantId || item.id),
            name: item.name,
            price: Number(item.price),
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            imageUrl: item.imageUrl,
            slug: item.slug,
            quantity: 1,
          };
        }
      });

      const itemsToAdd = await Promise.all(promises);
      
      // Sequentially add items to the cart
      for (const itemToAdd of itemsToAdd) {
        await addItem(itemToAdd);
      }
      
      success(`🎉 Đã thêm toàn bộ ${items.length} sản phẩm vào giỏ hàng thành công!`);
    } catch (err) {
      console.error("Bulk add to cart failed:", err);
      error("Có lỗi xảy ra khi thêm tất cả vào giỏ hàng!");
    }
  };

  // Custom collection operations
  const handleSaveCollection = (name: string, iconName: string) => {
    if (customCollections.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      error("Bộ sưu tập này đã tồn tại!");
      return;
    }
    const updated = [...customCollections, { name, icon: iconName }];
    setCustomCollections(updated);
    localStorage.setItem("luxe-wishlist-collections-v2", JSON.stringify(updated));
    setIsNewCollModalOpen(false);
    success(`Đã tạo bộ sưu tập "${name}"`);
  };

  const handleAssignCollection = (itemId: string, collectionName: string) => {
    const updated = { ...itemCollections, [itemId]: collectionName };
    setItemCollections(updated);
    localStorage.setItem("luxe-wishlist-assignments-v2", JSON.stringify(updated));
    setActiveCollectionMenuId(null);
    success(`Đã chuyển sản phẩm vào bộ sưu tập "${collectionName}"`);
  };

  const handleRemoveFromCollection = (itemId: string) => {
    const updated = { ...itemCollections };
    delete updated[itemId];
    setItemCollections(updated);
    localStorage.setItem("luxe-wishlist-assignments-v2", JSON.stringify(updated));
    setActiveCollectionMenuId(null);
    success("Đã xóa sản phẩm khỏi bộ sưu tập");
  };

  // Sharing link helpers
  const getShareLink = () => {
    if (typeof window === "undefined") return "";
    const ids = items.map((i) => i.id).join(",");
    return `${window.location.origin}/wishlist?share=${ids}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareLink());
    setCopied(true);
    success("Đã sao chép link chia sẻ!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    success(`Đang mở liên kết chia sẻ qua ${platform}...`);
  };

  // Filtering & Sorting Logic
  const discountedItems = useMemo(() => {
    return items.filter((i) => i.originalPrice && i.originalPrice > i.price);
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = [...items];

    if (discountFilter) {
      list = list.filter((i) => i.originalPrice && i.originalPrice > i.price);
    } else if (currentColl !== "all") {
      list = list.filter((item) => itemCollections[item.id] === currentColl);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      list.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      });
    }

    return list;
  }, [items, discountFilter, currentColl, sortBy, itemCollections]);

  return {
    items,
    mounted,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    currentColl,
    setCurrentColl,
    discountFilter,
    setDiscountFilter,
    customCollections,
    itemCollections,
    isShareModalOpen,
    setIsShareModalOpen,
    isNewCollModalOpen,
    setIsNewCollModalOpen,
    copied,
    activeCollectionMenuId,
    setActiveCollectionMenuId,
    quickAddProduct,
    setQuickAddProduct,
    isQuickAddOpen,
    setIsQuickAddOpen,
    isAddingToCartMap,
    discountedItems,
    filteredItems,
    handleAddToCart,
    handleAddAllToCart,
    handleSaveCollection,
    handleAssignCollection,
    handleRemoveFromCollection,
    getShareLink,
    handleCopyLink,
    handleSocialShare,
    removeFromWishlist,
    success,
  };
}
