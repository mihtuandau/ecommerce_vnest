// src/pages/Checkout/CheckoutPage.jsx (fix validateForm: default empty strings nếu shippingInfo undefined)
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/authContext';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import AddressManager from '../../../components/customer/AddressManager';
import ShippingForm from '../../../components/checkout/ShippingForm';
import PaymentMethodSelector from '../../../components/checkout/PaymentMethodSelector';
import OrderSummary from '../../../components/checkout/OrderSummary';
import orderService from '../../../services/orderService';
import userService from '../../../services/userService';
import { useCheckoutCalculations } from '../../../hooks/useCheckoutCalculations';
import { useDiscountCode } from '../../../hooks/useDiscountCode';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  
  const [submitting, setSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Shipping info state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  // Custom hooks
  const {
    discountCode,
    setDiscountCode,
    appliedDiscount,
    checkingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount
  } = useDiscountCode();

  const { subtotal, shipping, discount, total, itemCount } = useCheckoutCalculations(
    cartItems,
    appliedDiscount
  );

  // Authentication and cart validation
  useEffect(() => {
    // ProtectedRoute đã check authentication rồi, nhưng double check cho chắc
    if (!user) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!');
      navigate('/cart');
      return;
    }

    loadUserProfile();
  }, [user, cartItems.length, navigate]);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectAddress = (addressData) => {
    setShippingInfo(addressData);
    setShowAddressModal(false);
  };

  // ✅ Fix: Guard destructuring với default empty strings (tránh undefined.trim())
  const validateForm = () => {
    const { fullName = '', phone = '', address = '', city = '' } = shippingInfo || {};  // Default nếu undefined
    
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone)) {
      toast.error('Số điện thoại không hợp lệ (10 chữ số)');
      return false;
    }
    
    if (!address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    
    if (!city.trim()) {
      toast.error('Vui lòng chọn tỉnh/thành phố');
      return false;
    }

    if (!agreedToTerms) {
      toast.error('Vui lòng đồng ý điều khoản dịch vụ');
      return false;
    }
    
    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;  // ✅ Gọi validateForm OK, không undefined

    try {
      setSubmitting(true);

      const orderData = {
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
        shippingInfo: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          note: shippingInfo.note
        },
        paymentMethod
      };

      const response = await orderService.createOrder(orderData);
      
      toast.success('Đặt hàng thành công!');
      
      setTimeout(() => {
        navigate(`/orders/${response.data.id}`);
      }, 1000);

    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft /> Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingForm
              shippingInfo={shippingInfo}
              onInputChange={handleInputChange}
              onSelectAddressClick={() => setShowAddressModal(true)}
            />

            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          {/* Right Column - Order Summary */}
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
              onSubmitOrder={handleSubmitOrder}  
            />
          </div>
        </div>

        {/* Address Selection Modal */}
        <Modal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          title="Chọn địa chỉ giao hàng"
        >
          {currentUser && (
            <AddressManager
              userId={currentUser.id}
              onAddressSelect={handleSelectAddress}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;