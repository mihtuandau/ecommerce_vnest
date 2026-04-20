import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Steps, Card, Button as AntButton, Modal as AntModal, Spin } from "antd";
import { ArrowLeftOutlined, EnvironmentOutlined, CreditCardOutlined } from "@ant-design/icons";
import { notify } from "../../../utils/notification";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../hooks/useCart";
import { useAutoApplyDiscounts } from "../../../hooks/useFlashSale";
import PageTitle from "../../../components/common/PageTitle";
import AddressSelector from "../../../components/profile/AddressSelector";
import ShippingForm from "../../../components/checkout/ShippingForm";
import PaymentMethodSelector from "../../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../../components/checkout/OrderSummary";
import Layout from "../../../components/layouts/Layout";
import userService from "../../../services/userService";
import { useDiscountCode } from "../../../hooks/useDiscounts";
import { useCheckoutForm } from "../../../hooks/useCheckoutForm";
import { useCheckoutSubmit } from "../../../hooks/useCheckoutSubmit";
import { useCheckoutPricing } from "../../../hooks/useCheckoutPricing";
import { formatPrice } from "../../../utils/formatters";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  useCart(); 
  const { discountMap } = useAutoApplyDiscounts();
  const allCartItems = useSelector((state) => state.cart.items);

  const cartItems = useMemo(() => {
    let items = location.state?.items || [];
    if (location.state?.product && !location.state?.items) {
      const { product, quantity } = location.state;
      return [{ id: product.variant.id, productId: product.id, name: product.name, image: product.image, price: product.variant.price, quantity, size: product.variant.size, color: product.variant.color, stock: product.variant.stock }];
    }
    return items.length > 0 ? items : allCartItems;
  }, [location.state, allCartItems]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { shippingInfo, paymentMethod, setPaymentMethod, agreedToTerms, setAgreedToTerms, handleInputChange, handleSelectAddress } = useCheckoutForm();
  const { code: discountCode, setCode: setDiscountCode, applied: appliedDiscount, isChecking: checkingDiscount, apply: handleApplyDiscount, remove: handleRemoveDiscount } = useDiscountCode();

  const { subtotal, shipping, discount, total, itemCount, effectiveCartItems, effectiveDiscount } = useCheckoutPricing(cartItems, discountMap, appliedDiscount);
  const { submitting, handleSubmitOrder: submitOrder } = useCheckoutSubmit(user);

  const loadUserProfile = useCallback(async () => {
    try {
      const response = await userService.getProfile();
      setCurrentUser(response.user);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) { notify.error("Giỏ hàng trống!"); navigate("/cart"); return; }
    if (user && !currentUser) loadUserProfile();
  }, [user, cartItems.length, navigate, currentUser, loadUserProfile]);

  if (cartItems.length === 0) return <div className="flex items-center justify-center min-h-screen"><Spin size="large" tip="Đang tải..." /></div>;

  return (
    <Layout>
      <div className="min-h-screen bg-[#f9f9f9] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-6">
            <AntButton 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate("/cart")} 
              className="h-10 border-none shadow-none hover:text-slate-800 bg-white flex items-center text-xs font-semibold px-4"
            >
              Quay lại giỏ hàng
            </AntButton>

            <div className="mt-8 mb-10 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-2">Thanh toán</h1>
              <p className="text-sm text-gray-400">Hoàn tất các bước để nhận hàng sớm nhất</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 sm:p-8 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-sm">
                  <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-4">
                    <EnvironmentOutlined className="text-gray-400" />
                    <span className="font-semibold text-[13px] uppercase tracking-wider text-slate-800">Thông tin giao hàng</span>
                  </div>
                  <ShippingForm shippingInfo={shippingInfo} onInputChange={handleInputChange} onSelectAddressClick={() => setShowAddressModal(true)} isGuest={!user} />
                </div>

                <div className="bg-white p-4 sm:p-8 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-sm">
                  <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-4">
                    <CreditCardOutlined className="text-gray-400" />
                    <span className="font-semibold text-[13px] uppercase tracking-wider text-slate-800">Phương thức thanh toán</span>
                  </div>
                  <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <OrderSummary
                    cartItems={effectiveCartItems} originalCartItems={cartItems} flashSaleDiscount={0} subtotal={subtotal} shipping={shipping} discount={discount} total={total} itemCount={itemCount}
                    discountCode={discountCode} setDiscountCode={setDiscountCode} appliedDiscount={appliedDiscount} checkingDiscount={checkingDiscount} onApplyDiscount={handleApplyDiscount} onRemoveDiscount={handleRemoveDiscount}
                    agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms} submitting={submitting} onSubmitOrder={() => submitOrder(cartItems, shippingInfo, paymentMethod, agreedToTerms, effectiveDiscount, shipping)}
                  />
                </div>
              </div>
            </div>

            <AntModal title="Chọn địa chỉ giao hàng" open={showAddressModal} onCancel={() => setShowAddressModal(false)} footer={null} width={600}>
              <AddressSelector onAddressSelect={(data) => { handleSelectAddress(data, shippingInfo.email); setShowAddressModal(false); }} selectedAddressId={null} />
            </AntModal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
