"use client";

import React from "react";
import { useWishlist } from "../hooks/useWishlist";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  EmptyState,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";

// Highly modular child components
import { WishlistHeader } from "./WishlistHeader";
import { PriceAlertBanner } from "./PriceAlertBanner";
import { CollectionBar } from "./CollectionBar";
import { WishlistToolbar } from "./WishlistToolbar";
import { WishlistItemCard } from "./WishlistItemCard";
import { ShareModal } from "./ShareModal";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { QuickAddModal } from "@/features/products/components/customer/cards/QuickAddModal";

export function WishlistView() {
  const router = useRouter();
  const {
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
  } = useWishlist();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-6xl  mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-10">
            <Skeleton className="h-6 w-40 animate-pulse bg-brand-sand/50" />
            <div className="border-b border-brand-sand/50 pb-8 space-y-4">
              <Skeleton className="h-10 w-64 animate-pulse bg-brand-sand/50" />
              <Skeleton className="h-4 w-96 animate-pulse bg-brand-sand/50" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-2xl animate-pulse bg-brand-sand/50" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream font-sans-brand pb-24">
      {/* BREADCRUMB BAR */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb>
          <BreadcrumbList className="text-xs font-semibold">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1.5 hover:text-brand-espresso transition-all">
                  <Home className="h-3.5 w-3.5" />
                  <span>Trang chủ</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand-espresso font-bold">Yêu thích</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 space-y-8 animate-in fade-in duration-500">
        {/* HEADER ROW */}
        <WishlistHeader
          onShareClick={() => setIsShareModalOpen(true)}
          onAddAllToCart={handleAddAllToCart}
        />

        {/* PRICE ALERTS BANNER */}
        {discountedItems.length > 0 && (
          <PriceAlertBanner
            discountedCount={discountedItems.length}
            discountedNames={discountedItems.slice(0, 3).map((i) => i.name).join(" · ")}
            onViewDiscountClick={() => setDiscountFilter(true)}
            onNotifyClick={() => success("🔔 Đã đăng ký nhận thông báo giảm giá thành công!")}
          />
        )}

        {/* COLLECTIONS SELECTOR BAR */}
        <CollectionBar
          itemsCount={items.length}
          currentColl={currentColl}
          discountFilter={discountFilter}
          customCollections={customCollections}
          itemCollections={itemCollections}
          items={items}
          onSelectColl={(name) => {
            setCurrentColl(name);
            setDiscountFilter(false);
          }}
          onCreateCollClick={() => setIsNewCollModalOpen(true)}
        />

        {/* TOOLBAR (DISPLAY COUNT, SORTING, GRID/LIST SWAP) */}
        <WishlistToolbar
          filteredCount={filteredItems.length}
          discountFilter={discountFilter}
          currentColl={currentColl}
          sortBy={sortBy}
          viewMode={viewMode}
          onResetDiscountFilter={() => setDiscountFilter(false)}
          onResetCollFilter={() => setCurrentColl("all")}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
        />

        {/* PRODUCTS GRID/LIST CONTAINER */}
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={Home}
            title={discountFilter ? "Không có sản phẩm giảm giá" : "Danh sách trống"}
            description={
              discountFilter
                ? "Không có sản phẩm nào trong danh sách yêu thích đang được giảm giá."
                : "Hãy lưu lại những món đồ bạn yêu thích để dễ dàng mua sắm sau này nhé."
            }
            actionText="Khám phá ngay"
            onAction={() => router.push("/shop")}
          />
        ) : (
          <div
            className={viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300"
              : "flex flex-col gap-5 transition-all duration-300"
            }
          >
            {filteredItems.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                customCollections={customCollections}
                itemCollName={itemCollections[item.id]}
                activeCollectionMenuId={activeCollectionMenuId}
                onToggleCollectionMenu={setActiveCollectionMenuId}
                onAssignCollection={handleAssignCollection}
                onRemoveFromCollection={handleRemoveFromCollection}
                onRemoveFromWishlist={(id) => {
                  removeFromWishlist(id);
                  success(`Đã xóa khỏi danh sách yêu thích`);
                }}
                onAddToCart={handleAddToCart}
                isAddingToCart={isAddingToCartMap[item.id] || false}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareLink={getShareLink()}
        copied={copied}
        onCopy={handleCopyLink}
        onSocialShare={handleSocialShare}
      />

      <CreateCollectionModal
        isOpen={isNewCollModalOpen}
        onClose={() => setIsNewCollModalOpen(false)}
        onSave={handleSaveCollection}
      />

      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          isOpen={isQuickAddOpen}
          onClose={() => {
            setIsQuickAddOpen(false);
            setQuickAddProduct(null);
          }}
          price={quickAddProduct.price || quickAddProduct.basePrice || 0}
          originalPrice={quickAddProduct.originalPrice}
        />
      )}
    </div>
  );
}
