import { useCallback, useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button as AntButton, Modal, Badge, Divider, Space } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
import Button from '../../../components/common/Button';
import CartEmpty from '../../../components/cart/CartEmpty';
import CartItemsList from '../../../components/cart/CartItemsList';
import CartSummary from '../../../components/cart/CartSummary';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../hooks/useCart';
import { notify } from '../../../utils/notification';
import { formatPrice } from '../../../utils/formatters';

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
    clearCart 
  } = useCart();
  
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  // Load cart when component mounts if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    }
  }, [isLoggedIn, loadCart]);
  
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
    if (skipConfirm) {
      return removeFromCart(variantId);
    }
    
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        return removeFromCart(variantId);
      },
    });
  }, [removeFromCart]);

  const handleClearCart = useCallback(() => {
    confirm({
      title: 'Xác nhận xóa tất cả',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa toàn bộ giỏ hàng?',
      okText: 'Xóa tất cả',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        clearCart();
      },
    });
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
      notify.error('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    
    if (cartItems.length === 0) {
      notify.error('Giỏ hàng trống');
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
        <div className="bg-white min-h-screen pt-21 pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />
            
            {/* Header */}
            <PageTitle
              subtitle="Mua sắm"
              title="GIỎ HÀNG CỦA BẠN"
              className="mt-6"
            />
            
            <CartEmpty />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          
          <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />

          {/* Header */}
          <PageTitle
            subtitle="Mua sắm"
            title="GIỎ HÀNG CỦA BẠN"
            count={cartCount}
            countLabel="sản phẩm trong giỏ hàng"
            className="mt-6"
          />
            
          {cartItems.length > 0 && (
            <div className="flex justify-end mb-6">
              <AntButton 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleClearCart}
              >
                Xóa tất cả
              </AntButton>
            </div>
          )}

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

              <Divider />

              <div className="mt-6">
                <Link to="/products">
                  <AntButton type="default" icon={<ArrowLeftOutlined />} size="large">
                    Tiếp tục mua sắm
                  </AntButton>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
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
      </div>
    </Layout>
  );
};

export default CartPage;
