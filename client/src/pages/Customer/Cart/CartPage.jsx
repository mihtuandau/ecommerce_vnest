import { useCallback, useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button as AntButton, Modal, Badge, Divider, Space } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Layout from "../../../components/layouts/Layout";
import Breadcrumb from "../../../components/common/Breadcrumb";
import PageTitle from "../../../components/common/PageTitle";
import Button from "../../../components/common/Button";
import CartEmpty from "../../../components/cart/CartEmpty";
import CartItemsList from "../../../components/cart/CartItemsList";
import CartSummary from "../../../components/cart/CartSummary";
import { useAuth } from "../../../hooks/useAuth";
import { useCart } from "../../../hooks/useCart";
import { useAutoApplyDiscounts } from "../../../hooks/useFlashSale";
import { notify } from "../../../utils/notification";
import { formatPrice, computeDiscountFromMap } from "../../../utils/formatters";

const { confirm } = Modal;

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items: cartItems,
    count: cartCount,
    total: cartTotal,
    isLoggedIn,
    loadCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const { discountMap } = useAutoApplyDiscounts();

  const [selectedItems, setSelectedItems] = useState(new Set());
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    }
  }, [isLoggedIn, loadCart]);

  useEffect(() => {

  }, [discountMap]);

  const originalSubtotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.has(item.variantId))
      .reduce((sum, item) => {
        const originalPrice = item.product?.variant?.price || 0;
        return sum + originalPrice * item.quantity;
      }, 0);
  }, [cartItems, selectedItems]);

  const selectedTotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.has(item.variantId))
      .reduce((sum, item) => {
        const originalPrice = item.product?.variant?.price || 0;
        const price = computeDiscountFromMap(
          item.product?.id,
          originalPrice,
          discountMap,
        );
        return sum + price * item.quantity;
      }, 0);
  }, [cartItems, selectedItems, discountMap]);

  const selectedDiscount = useMemo(() => {
    return originalSubtotal - selectedTotal;
  }, [originalSubtotal, selectedTotal]);

  const selectedCount = selectedItems.size;

  const handleUpdateQuantity = useCallback(
    (variantId, currentQuantity, delta) => {
      if (delta === 0) {
        updateCartItem(variantId, currentQuantity);
      } else {
        const newQuantity = currentQuantity + delta;
        if (newQuantity < 1) return;
        updateCartItem(variantId, newQuantity);
      }
    },
    [updateCartItem],
  );

  const handleRemoveItem = useCallback(
    (variantId, skipConfirm = false) => {
      if (skipConfirm) {
        return removeFromCart(variantId);
      }

      confirm({
        title: "Xác nhận xóa",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          return removeFromCart(variantId);
        },
      });
    },
    [removeFromCart],
  );

  const handleClearCart = useCallback(() => {
    confirm({
      title: "Xác nhận xóa tất cả",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc muốn xóa toàn bộ giỏ hàng?",
      okText: "Xóa tất cả",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        clearCart();
      },
    });
  }, [clearCart]);

  const handleToggleItem = useCallback((variantId) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
        newSet.add(variantId);
      }
      return newSet;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.variantId)));
    }
  }, [cartItems, selectedItems.size]);

  const handleCheckout = () => {
    if (selectedItems.size === 0 && cartItems.length > 0) {
      notify.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    if (cartItems.length === 0) {
      notify.error("Giỏ hàng trống");
      return;
    }

    navigate("/checkout", {
      state: {
        selectedItems: Array.from(selectedItems),
        items: cartItems.filter((item) => selectedItems.has(item.variantId)),
      },
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="bg-white min-h-screen pb-12 text-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="py-2">
              <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
            </div>
            <div className="mt-8">
              <CartEmpty />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-12 text-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2">
            <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2">
              <CartItemsList
                items={cartItems}
                count={cartCount}
                selectedItems={selectedItems}
                onToggleItem={handleToggleItem}
                onToggleAll={handleToggleAll}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onClearAll={handleClearCart}
                formatPrice={formatPrice}
                discountMap={discountMap}
              />

              <Divider />

              <div className="mt-6">
                <Link to="/products">
                  <AntButton
                    type="default"
                    icon={<ArrowLeftOutlined />}
                    size="large"
                  >
                    Tiếp tục mua sắm
                  </AntButton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <CartSummary
                  total={selectedTotal}
                  selectedCount={selectedCount}
                  totalCount={cartCount}
                  formatPrice={formatPrice}
                  onCheckout={handleCheckout}
                  discount={selectedDiscount}
                  promotionTitle="Flash Sale"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] pb-safe">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tighter">Tổng thanh toán</span>
              <span className="text-xl font-semibold text-black font-inter tracking-tighter">
                {selectedTotal === 0 ? "0 đ" : formatPrice(selectedTotal)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={selectedItems.size === 0}
              className="bg-black text-white px-8 py-3 font-semibold text-sm rounded-none h-11 flex-shrink-0 disabled:opacity-30"
            >
              Thanh toán ({selectedItems.size})
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;






