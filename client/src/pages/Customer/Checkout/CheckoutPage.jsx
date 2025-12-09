// src/pages/Checkout/CheckoutPage.jsx (fix validateForm: default empty strings nếu shippingInfo undefined)
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/authContext';
import Loading from '../../../components/common/Loading';
import Modal from '../../../components/common/Modal';
import AddressSelector from '../../../components/customer/AddressSelector';
import ShippingForm from '../../../components/checkout/ShippingForm';
import PaymentMethodSelector from '../../../components/checkout/PaymentMethodSelector';
import OrderSummary from '../../../components/checkout/OrderSummary';
import orderService from '../../../services/orderService';
import userService from '../../../services/userService';
import { useCheckoutCalculations } from '../../../hooks/useCheckoutCalculations';
import { useDiscountCode } from '../../../hooks/useDiscountCode';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get selected items from location state, fallback to all cart items
  const allCartItems = useSelector((state) => state.cart.items);
  const cartItems = location.state?.items || allCartItems;
  
  const [submitting, setSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Shipping info state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cityCode: '',
    district: '',
    districtCode: '',
    ward: '',
    wardCode: '',
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

  // Cart validation
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!');
      navigate('/cart');
      return;
    }

    // Load user profile if logged in
    if (user) {
      loadUserProfile();
    }
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
    // Map address fields to shipping info format
    setShippingInfo({
      fullName: addressData.fullName || '',
      phone: addressData.phone || '',
      address: addressData.street || '',
      city: addressData.city || '',
      district: addressData.state || '',
      ward: addressData.ward || '',
      note: shippingInfo.note || ''
    });
    setShowAddressModal(false);
    toast.success('Đã chọn địa chỉ');
  };

  // ✅ Fix: Guard destructuring với default empty strings (tránh undefined.trim())
  const validateForm = () => {
    const { fullName = '', email = '', phone = '', address = '', city = '' } = shippingInfo || {};  // Default nếu undefined
    
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }

    // Email required for guest checkout
    if (!user && !email.trim()) {
      toast.error('Vui lòng nhập email để nhận thông tin đơn hàng');
      return false;
    }

    if (!user && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email không hợp lệ');
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
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const orderData = {
        items: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.ward || ''}, ${shippingInfo.district || ''}, ${shippingInfo.city}`,
        shippingInfo: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          note: shippingInfo.note || ''
        },
        paymentMethod
      };

      // Add guest fields only if guest checkout
      if (!user) {
        orderData.guestEmail = shippingInfo.email;
        orderData.guestPhone = shippingInfo.phone;
      }

      console.log('📦 Order Data:', JSON.stringify(orderData, null, 2));
      console.log('👤 User:', user ? 'Logged in' : 'Guest');
      console.log('📧 Guest Email:', shippingInfo.email);

      // Use different endpoint for guest vs logged-in
      const response = user 
        ? await orderService.createOrder(orderData)
        : await orderService.createGuestOrder(orderData);
      
      console.log('✅ Order created:', response);
      
      // Save address to user profile if not already saved
      if (user?.id && shippingInfo.fullName && shippingInfo.phone && shippingInfo.address) {
        try {
          const addressData = {
            fullName: shippingInfo.fullName,
            phone: shippingInfo.phone,
            street: shippingInfo.address,
            city: shippingInfo.city,
            state: shippingInfo.district || '',
            zipCode: shippingInfo.ward || '',
            isDefault: false,
            addressType: 'home'
          };
          
          // Check if address already exists
          const existingAddresses = await userService.getAddresses(user.id);
          const addressExists = existingAddresses?.addresses?.some(
            addr => addr.street === addressData.street && addr.city === addressData.city
          );
          
          if (!addressExists) {
            await userService.createAddress(user.id, addressData);
          }
        } catch (addressError) {
          console.error('Failed to save address:', addressError);
          // Don't show error to user, address saving is optional
        }
      }
      
      // Clear guest cart after successful order
      if (!user) {
        localStorage.removeItem('guest_cart');
        
        // Save guest order to localStorage for future reference
        const guestOrders = JSON.parse(localStorage.getItem('guest_orders') || '[]');
        guestOrders.push({
          orderCode: response.data.orderCode,
          contact: shippingInfo.email,
          date: new Date().toISOString()
        });
        // Keep only last 10 orders
        if (guestOrders.length > 10) {
          guestOrders.shift();
        }
        localStorage.setItem('guest_orders', JSON.stringify(guestOrders));
        
        // Show success message with order code for guest
        toast.success(
          `Đặt hàng thành công! Mã đơn hàng: ${response.data.orderCode}`,
          { duration: 5000 }
        );
        
        // Redirect to order lookup page with order info immediately
        navigate('/order-lookup', { 
          state: { 
            orderCode: response.data.orderCode,
            contact: shippingInfo.email 
          } 
        });
      } else {
        toast.success('Đặt hàng thành công!');
        setTimeout(() => {
          navigate(`/orders/${response.data.id}`);
        }, 1000);
      }

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
              isGuest={!user}
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
          size="md"
        >
          {currentUser && (
            <AddressSelector
              userId={currentUser.id}
              onAddressSelect={handleSelectAddress}
              selectedAddressId={null}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default CheckoutPage;