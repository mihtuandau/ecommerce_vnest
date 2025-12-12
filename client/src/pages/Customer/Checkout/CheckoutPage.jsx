import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/authContext";
import Loading from "../../../components/common/Loading";
import Modal from "../../../components/common/Modal";
import AddressSelector from "../../../components/customer/AddressSelector";
import ShippingForm from "../../../components/checkout/ShippingForm";
import PaymentMethodSelector from "../../../components/checkout/PaymentMethodSelector";
import OrderSummary from "../../../components/checkout/OrderSummary";
import userService from "../../../services/userService";
import { useCheckoutCalculations } from "../../../hooks/useCheckoutCalculations";
import { useDiscountCode } from "../../../hooks/useDiscountCode";
import { useCheckoutForm } from "../../../hooks/useCheckoutForm";
import { useCheckoutSubmit } from "../../../hooks/useCheckoutSubmit";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const allCartItems = useSelector((state) => state.cart.items);
  const cartItems = location.state?.items || allCartItems;

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
    discountCode,
    setDiscountCode,
    appliedDiscount,
    checkingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
  } = useDiscountCode();

  const { subtotal, shipping, discount, total, itemCount } =
    useCheckoutCalculations(cartItems, appliedDiscount);

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
    notify.success("Đã chọn địa chỉ");
  };

  const onSubmitOrder = () => {
    console.log('🛒 CheckoutPage - submitting with discount:', appliedDiscount);
    submitOrder(cartItems, shippingInfo, paymentMethod, agreedToTerms, appliedDiscount);
  };

  if (cartItems.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ShippingForm
              shippingInfo={shippingInfo}
              onInputChange={handleInputChange}
              onSelectAddressClick={() => setShowAddressModal(true)}
              isGuest={!user}
            />

            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
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

        <Modal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title="Chọn địa chỉ giao hàng"
          size="md"
        >
          <AddressSelector
            onAddressSelect={onSelectAddress}
            selectedAddressId={null}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;
