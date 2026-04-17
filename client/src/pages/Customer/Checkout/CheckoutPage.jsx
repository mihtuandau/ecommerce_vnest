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
      <div className="min-h-screen bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <AntButton icon={<ArrowLeftOutlined />} onClick={() => navigate("/cart")} className="mb-4">Quay lại giỏ hàng</AntButton>
            <PageTitle subtitle="Hoàn tất đơn hàng" title="THANH TOÁN" className="mt-4 mb-8" />
            <Steps current={1} items={[{ title: "Giỏ hàng" }, { title: "Thanh toán", icon: <CreditCardOutlined /> }, { title: "Hoàn thành" }]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title={<div className="flex items-center gap-2"><EnvironmentOutlined /><span>Thông tin giao hàng</span></div>} variant="borderless">
                <ShippingForm shippingInfo={shippingInfo} onInputChange={handleInputChange} onSelectAddressClick={() => setShowAddressModal(true)} isGuest={!user} />
              </Card>
              <Card title={<div className="flex items-center gap-2"><CreditCardOutlined /><span>Phương thức thanh toán</span></div>} variant="borderless">
                <PaymentMethodSelector paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
              </Card>
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
    </Layout>
  );
};

export default CheckoutPage;
