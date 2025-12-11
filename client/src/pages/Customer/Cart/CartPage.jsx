import { useCallback, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Button from '../../../components/common/Button';
import CartEmpty from '../../../components/cart/CartEmpty';
import CartItemsList from '../../../components/cart/CartItemsList';
import CartSummary from '../../../components/cart/CartSummary';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import toast from 'react-hot-toast';
import { formatPrice } from '../../../utils/formatters';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    items: cartItems, 
    count: cartCount, 
    total: cartTotal,
    updateCartItem,
    removeFromCart,
    clearCart 
  } = useCart();
  
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  const selectedTotal = useMemo(() => {
    return cartItems
      .filter(item => selectedItems.has(item.variantId))
      .reduce((sum, item) => {
        const price = item.product?.variant?.price || 0;
        return sum + (price * item.quantity);
      }, 0);
  }, [cartItems, selectedItems]);
  
  const selectedCount = selectedItems.size;

  const handleUpdateQuantity = useCallback((variantId, currentQuantity, delta) => {
    if (delta === 0) {
      updateCartItem(variantId, currentQuantity);
    } else {
      const newQuantity = currentQuantity + delta;
      if (newQuantity < 1) return;
      updateCartItem(variantId, newQuantity);
    }
  }, [updateCartItem]);

  const handleRemoveItem = useCallback((variantId, skipConfirm = false) => {
    if (skipConfirm || window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return removeFromCart(variantId);
    }
    return Promise.resolve();
  }, [removeFromCart]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      clearCart();
    }
  }, [clearCart]);

  const handleToggleItem = useCallback((variantId) => {
    setSelectedItems(prev => {
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
      setSelectedItems(new Set(cartItems.map(item => item.variantId)));
    }
  }, [cartItems, selectedItems.size]);

  const handleCheckout = () => {
    if (selectedItems.size === 0 && cartItems.length > 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    
    navigate('/checkout', { 
      state: { 
        selectedItems: Array.from(selectedItems),
        items: cartItems.filter(item => selectedItems.has(item.variantId))
      } 
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen py-16">
          <div className="container mx-auto px-4">
            <CartEmpty />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Giỏ hàng</span>
            </nav>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600">
              Bạn có {cartCount} sản phẩm trong giỏ hàng
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              />

              <div className="mt-6">
                <Link to="/products">
                  <Button variant="outline" icon={FaArrowLeft}>
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                total={selectedTotal}
                selectedCount={selectedCount}
                totalCount={cartCount}
                formatPrice={formatPrice}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
