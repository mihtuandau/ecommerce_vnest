import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Steps, Card, Divider, Button as AntButton, Modal as AntModal, Spin } from "antd";
import { ArrowLeftOutlined, ShoppingOutlined, EnvironmentOutlined, CreditCardOutlined } from "@ant-design/icons";
import { notify } from "../../../utils/notification";
import { computeDiscountFromMap } from "../../../utils/formatters";
import { useAuth } from "../../../contexts/AuthContext";
import { useCart } from "../../../hooks/useCart";
import { useAutoApplyDiscounts } from "../../../hooks/useFlashSale";
import Loading from "../../../components/common/Loading";
import Modal from "../../../components/common/Modal";
import PageTitle from "../../../components/common/PageTitle";
import AddressSelector from "../../../components/profile/AddressSelector";
import ShippingForm from "../../../components/checkout/ShippingForm";
import PaymentMethodSelector from "../../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../../components/checkout/OrderSummary";
import userService from "../../../services/userService";
import { useCheckoutCalculations } from "../../../hooks/useCheckoutCalculations";
import { useDiscountCode } from "../../../hooks/useDiscounts";
import { useCheckoutForm } from "../../../hooks/useCheckoutForm";
import { useCheckoutSubmit } from "../../../hooks/useCheckoutSubmit";
// import Breadcrumb from "../../../components/common/Breadcrumb";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { discountMap } = useAutoApplyDiscounts();

  const allCartItems = useSelector((state) => state.cart.items);

  let cartItems = location.state?.items || [];
  
  if (location.state?.product && !location.state?.items) {
    const { product, quantity } = location.state;
    const cartItem = {
      id: product.variant.id,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.variant.price,
      quantity: quantity,
      size: product.variant.size,
      color: product.variant.color,
      stock: product.variant.stock,
    };
    cartItems = [cartItem];
  } else {
    cartItems = location.state?.items || allCartItems;
  }

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    shippingInfo,
    paymentMethod,
    setPaymentMethod,
    agreedToTerms,
    setAgreedToTerms,
    handleInputChange,
    handleSelectAddress,
  } = useCheckoutForm();

  const {
    code: discountCode,
    setCode: setDiscountCode,
    applied: appliedDiscount,
    isChecking: checkingDiscount,
    apply: handleApplyDiscount,
    remove: handleRemoveDiscount,
  } = useDiscountCode();

  // Áp dụng auto-apply discount vào giá từng item trước khi tính toán
  const adjustedCartItems = useMemo(() => {
    if (!discountMap || Object.keys(discountMap).length === 0) return cartItems;
    return cartItems.map(item => {
      const productId = item.product?.id || item.productId;
      const originalPrice = item.product?.variant?.price || item.price || 0;
      const flashPrice = computeDiscountFromMap(productId, originalPrice, discountMap);
      if (flashPrice === originalPrice) return item;
      return {
        ...item,
        product: {
          ...item.product,
          variant: {
            ...(item.product?.variant || {}),
            price: flashPrice,
            originalPrice,
          },
        },
      };
    });
  }, [cartItems, discountMap]);

  // Tiết kiệm từ auto-apply discount
  const flashSaleDiscount = useMemo(() => {
    if (!discountMap || Object.keys(discountMap).length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const productId = item.product?.id || item.productId;
      const originalPrice = item.product?.variant?.price || item.price || 0;
      const flashPrice = computeDiscountFromMap(productId, originalPrice, discountMap);
      return sum + ((originalPrice - flashPrice) * item.quantity);
    }, 0);
  }, [cartItems, discountMap]);

  const { subtotal, shipping, discount, total, itemCount } =
    useCheckoutCalculations(adjustedCartItems, appliedDiscount);

  const { submitting, handleSubmitOrder: submitOrder } = useCheckoutSubmit(user);

  useEffect(() => {
    if (cartItems.length === 0) {
      notify.error("Giỏ hàng trống!");
      navigate("/cart");
      return;
    }

    if (user && !currentUser) {
      loadUserProfile();
    }
  }, [user, cartItems.length, navigate, currentUser]);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setCurrentUser(response.user);
    } catch (error) {}
  };

  const onSelectAddress = (addressData) => {
    handleSelectAddress(addressData, shippingInfo.email);
    setShowAddressModal(false);
  };

  const onSubmitOrder = () => {
    submitOrder(cartItems, shippingInfo, paymentMethod, agreedToTerms, appliedDiscount, shipping);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-10 pb-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <AntButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/cart")}
            className="mb-4"
          >
            Quay lại giỏ hàng
          </AntButton>
          
          <PageTitle
            subtitle="Hoàn tất đơn hàng"
            title="THANH TOÁN"
            className="mt-4 mb-8"
          />
          
          <Steps
            current={1}
            items={[
              {
                title: 'Giỏ hàng',
              },
              {
                title: 'Thanh toán',
                icon: <CreditCardOutlined />,
              },
              {
                title: 'Hoàn thành',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card 
              title={
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined />
                  <span>Thông tin giao hàng</span>
                </div>
              }
              variant="borderless"
            >
              <ShippingForm
                shippingInfo={shippingInfo}
                onInputChange={handleInputChange}
                onSelectAddressClick={() => setShowAddressModal(true)}
                isGuest={!user}
              />
            </Card>

            <Card 
              title={
                <div className="flex items-center gap-2">
                  <CreditCardOutlined />
                  <span>Phương thức thanh toán</span>
                </div>
              }
              variant="borderless"
            >
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OrderSummary
                cartItems={adjustedCartItems}
                originalCartItems={cartItems}
                flashSaleDiscount={flashSaleDiscount}
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                itemCount={itemCount}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                appliedDiscount={appliedDiscount}
                checkingDiscount={checkingDiscount}
                onApplyDiscount={handleApplyDiscount}
                onRemoveDiscount={handleRemoveDiscount}
                agreedToTerms={agreedToTerms}
                setAgreedToTerms={setAgreedToTerms}
                submitting={submitting}
                onSubmitOrder={onSubmitOrder}
              />
            </div>
          </div>
        </div>

        <AntModal
          title="Chọn địa chỉ giao hàng"
          open={showAddressModal}
          onCancel={() => setShowAddressModal(false)}
          footer={null}
          width={600}
        >
          <AddressSelector
            onAddressSelect={onSelectAddress}
            selectedAddressId={null}
          />
        </AntModal>
      </div>
    </div>
  );
};

export default CheckoutPage;
