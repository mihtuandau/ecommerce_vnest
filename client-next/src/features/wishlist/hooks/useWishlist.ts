"use client";

import { useEffect, useMemo, useState } from "react";
import { useWishlistStore, type WishlistItem } from "@/store/useWishlistStore";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { productsApi } from "@/features/products/api/products.api";
import type { Product } from "@/types/models";
import type {
  CustomCollection,
  WishlistItemCollections,
  WishlistSortBy,
  WishlistViewMode,
} from "@/features/wishlist/types";
import {
  getDiscountedWishlistItems,
  getFilteredWishlistItems,
  loadWishlistAssignments,
  loadWishlistCollections,
  mapProductToCartItem,
  mapWishlistItemToCartItem,
  saveWishlistAssignments,
  saveWishlistCollections,
  shouldOpenQuickAdd,
} from "@/features/wishlist/services";

export function useWishlist() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const { success, error } = useToast();

  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<WishlistViewMode>("grid");
  const [sortBy, setSortBy] = useState<WishlistSortBy>("recent");
  const [currentColl, setCurrentColl] = useState("all");
  const [discountFilter, setDiscountFilter] = useState(false);
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([]);
  const [itemCollections, setItemCollections] = useState<WishlistItemCollections>({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewCollModalOpen, setIsNewCollModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCollectionMenuId, setActiveCollectionMenuId] = useState<string | null>(
    null
  );
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddingToCartMap, setIsAddingToCartMap] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setMounted(true);
    setCustomCollections(loadWishlistCollections());
    setItemCollections(loadWishlistAssignments());
  }, []);

  const handleAddToCart = async (item: WishlistItem) => {
    setIsAddingToCartMap((prev) => ({ ...prev, [item.id]: true }));

    try {
      const fullProduct = await productsApi.getProduct(item.slug, true);

      if (shouldOpenQuickAdd(fullProduct)) {
        setQuickAddProduct(fullProduct);
        setIsQuickAddOpen(true);
        return;
      }

      addItem(mapProductToCartItem(fullProduct, item));
      success(`Đã thêm ${fullProduct.name} vào giỏ hàng`);
    } catch (err) {
      console.error("Quick add fetch failed:", err);
      addItem(mapWishlistItemToCartItem(item));
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

    success("Đang xử lý và đồng bộ toàn bộ sản phẩm...");

    try {
      const itemsToAdd = await Promise.all(
        items.map(async (item) => {
          try {
            const fullProduct = await productsApi.getProduct(item.slug, true);
            return mapProductToCartItem(fullProduct, item);
          } catch {
            return mapWishlistItemToCartItem(item);
          }
        })
      );

      for (const itemToAdd of itemsToAdd) {
        await addItem(itemToAdd);
      }

      success(`Đã thêm toàn bộ ${items.length} sản phẩm vào giỏ hàng thành công!`);
    } catch (err) {
      console.error("Bulk add to cart failed:", err);
      error("Có lỗi xảy ra khi thêm tất cả vào giỏ hàng!");
    }
  };

  const handleSaveCollection = (name: string, iconName: string) => {
    if (customCollections.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      error("Bộ sưu tập này đã tồn tại!");
      return;
    }

    const updated = [...customCollections, { name, icon: iconName }];
    setCustomCollections(updated);
    saveWishlistCollections(updated);
    setIsNewCollModalOpen(false);
    success(`Đã tạo bộ sưu tập "${name}"`);
  };

  const handleAssignCollection = (itemId: string, collectionName: string) => {
    const updated = { ...itemCollections, [itemId]: collectionName };
    setItemCollections(updated);
    saveWishlistAssignments(updated);
    setActiveCollectionMenuId(null);
    success(`Đã chuyển sản phẩm vào bộ sưu tập "${collectionName}"`);
  };

  const handleRemoveFromCollection = (itemId: string) => {
    const updated = { ...itemCollections };
    delete updated[itemId];
    setItemCollections(updated);
    saveWishlistAssignments(updated);
    setActiveCollectionMenuId(null);
    success("Đã xóa sản phẩm khỏi bộ sưu tập");
  };

  const getShareLink = () => {
    if (typeof window === "undefined") return "";
    const ids = items.map((item) => item.id).join(",");
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

  const discountedItems = useMemo(() => getDiscountedWishlistItems(items), [items]);

  const filteredItems = useMemo(
    () =>
      getFilteredWishlistItems({
        items,
        discountFilter,
        currentCollection: currentColl,
        sortBy,
        itemCollections,
      }),
    [items, discountFilter, currentColl, sortBy, itemCollections]
  );

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
