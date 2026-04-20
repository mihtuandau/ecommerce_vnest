import React, { useState, useEffect } from "react";
import { Empty, Spin, Modal } from "antd";
import {
  HeartOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { notify } from "../../utils/notification";
import wishlistService from "../../services/wishlistService";
import Breadcrumb from "../../components/common/Breadcrumb";
import Layout from "../../components/layouts/Layout";
import PageTitle from "../../components/common/PageTitle";
import StarRating from "../../components/common/StarRating";
import { useAutoApplyDiscounts } from "../../hooks/useFlashSale";
import { formatPrice, computeDiscountFromMap } from "../../utils/formatters";

const { confirm } = Modal;

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { discountMap } = useAutoApplyDiscounts();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlistItems(data || []);
    } catch (error) {
      notify.error("Không thể tải danh sách yêu thích");
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (variantId) => {
    try {
      await wishlistService.removeFromWishlist(variantId);
      setWishlistItems(
        wishlistItems.filter((item) => item.variantId !== variantId),
      );
      notify.success("Đã xóa khỏi danh sách yêu thích");
      window.dispatchEvent(new CustomEvent("wishlistUpdated"));
    } catch (error) {
      notify.error("Không thể xóa sản phẩm");
    }
  };

  const handleClearAll = async () => {
    confirm({
      title: "Xác nhận xóa tất cả",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?",
      okText: "Xóa tất cả",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await wishlistService.clearWishlist();
          setWishlistItems([]);
          notify.success("Đã xóa tất cả sản phẩm yêu thích");
          window.dispatchEvent(new CustomEvent("wishlistUpdated"));
        } catch (error) {
          notify.error("Không thể xóa danh sách");
        }
      },
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-12 text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2">
            <Breadcrumb items={[{ label: "Sản phẩm yêu thích" }]} />
          </div>

          <div className="mt-8">
            {wishlistItems.length > 0 && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 hover:bg-red-50 transition-colors"
              >
                <DeleteOutlined />
                Xóa tất cả
              </button>
            </div>
          )}

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[400px]">
              <HeartOutlined className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-6">
                Chưa có sản phẩm yêu thích
              </p>
              <Link to="/products">
               <button className="px-8 py-3 bg-black !text-white text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                  Khám Phá Sản Phẩm
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {wishlistItems.map((item) => {
                const product = item.variant?.product;
                const variant = item.variant;

                if (!product || !variant) return null;

                const productId = product.id;
                const thumbnail = variant?.images?.find(
                  (img) => img.isThumbnail,
                ) ||
                  variant?.images?.[0] || { url: product?.category?.image };

                const originalPrice = variant.price || 0;
                const finalPrice = computeDiscountFromMap(
                  productId,
                  originalPrice,
                  discountMap,
                );
                const isDiscounted = finalPrice < originalPrice;
                const discountInfo = discountMap[productId];

                return (
                  <div
                    key={item.id}
                    className="group relative bg-white rounded-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-300 hover:-translate-y-1"
                  >
                    {isDiscounted && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold text-white rounded ${discountInfo?.isFlashSale ? "bg-red-600" : "bg-black"}`}
                        >
                          <Zap size={8} className="fill-white" />-
                          {discountInfo?.percentage}%
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.variantId);
                        }}
                        className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white transition-all"
                        title="Xóa khỏi yêu thích"
                      >
                        <DeleteOutlined className="text-[10px]" />
                      </button>
                    </div>

                    <div
                      className="block relative overflow-hidden w-full aspect-square bg-gray-50 cursor-pointer border-b border-gray-50"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      <img
                        src={thumbnail?.url || "/placeholder.png"}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                      />
                      {(variant.color || variant.size) && (
                        <div className="absolute bottom-2 left-2 flex gap-1 opacity-80">
                          {variant.color && (
                            <span className="px-1.5 py-0.5 text-[8px] uppercase font-black bg-white/80 text-gray-900 rounded-sm">
                              {variant.color}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-grow p-3">
                      <div className="flex-grow">
                        <span className="text-[10px] font-semibold text-black mb-1 block">
                          {product.category?.name || "Danh mục"}
                        </span>
                        <h3
                          className="text-[13px] font-semibold text-black leading-tight group-hover:text-neutral-800 transition-colors line-clamp-2 min-h-[2rem] mb-1.5"
                          title={product.name}
                        >
                          {product.name || "Sản phẩm"}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <StarRating
                            rating={product.averageRating || 0}
                            size={9}
                            showNumber={false}
                          />
                          <span className="text-[10px] text-gray-400">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-2 border-t border-gray-50">
                        <div className="flex items-baseline gap-1.5 mb-1.5 font-inter">
                          <span
                            className={`text-[16px] font-semibold ${isDiscounted ? "text-red-600" : "text-black"}`}
                          >
                            {formatPrice(finalPrice)}
                          </span>
                          {isDiscounted && (
                            <span className="text-[11px] text-gray-300 line-through font-medium opacity-80">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-gray-400">
                            Đã bán {product.soldCount || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-300 font-medium">
                            <FaEye size={10} /> {product.viewCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default WishlistPage;






