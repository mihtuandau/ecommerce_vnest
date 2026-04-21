import React, { lazy } from "react";
import { Route } from "react-router-dom";

const Home = lazy(() => import("../../pages/Customer/Home/HomePage"));
const Products = lazy(() => import("../../pages/Customer/Product/ProductsPage"));
const ProductDetail = lazy(() => import("../../pages/Customer/Product/ProductDetailPage"));
const Category = lazy(() => import("../../pages/Customer/Product/CategoryPage"));
const Cart = lazy(() => import("../../pages/Customer/Cart/CartPage"));
const Wishlist = lazy(() => import("../../pages/Customer/WishlistPage"));
const Checkout = lazy(() => import("../../pages/Customer/Checkout/CheckoutPage"));
const Orders = lazy(() => import("../../pages/Customer/Order/OrdersPage"));
const OrderDetail = lazy(() => import("../../pages/Customer/Order/OrderDetailPage"));
const OrderLookup = lazy(() => import("../../pages/Customer/Order/OrderLookupPage"));
const GuestOrder = lazy(() => import("../../pages/Customer/Order/GuestOrderDetailPage"));
const FlashSale = lazy(() => import("../../pages/Customer/FlashSale/FlashSalePage"));
const Profile = lazy(() => import("../../pages/Customer/Profile/ProfilePage"));
const About = lazy(() => import("../../pages/Customer/About/AboutPage"));
const Support = lazy(() => import("../../pages/Customer/Support/SupportChatPage"));
const Promotions = lazy(() => import("../../pages/Customer/Promotions/PromotionsPage"));
const PaymentReturn = lazy(() => import("../../pages/Customer/Payment/PaymentReturn.jsx"));
const PaymentCancel = lazy(() => import("../../pages/Customer/Payment/PaymentCancel.jsx"));
// const GHNTest = lazy(() => import("../../pages/Customer/GHN/GHNTestPage.jsx"));

export const customerRoutes = [
  // <Route key="ghn-test" path="/ghn-test" element={<GHNTest />} />,
  <Route key="c-home" path="/" element={<Home />} />,
  <Route key="c-fs" path="/flash-sale" element={<FlashSale />} />,
  <Route key="c-p" path="/products" element={<Products />} />,
  <Route key="c-p-d" path="/products/:id" element={<ProductDetail />} />,
  <Route key="c-cat" path="/category/:id" element={<Category />} />,
  <Route key="c-cart" path="/cart" element={<Cart />} />,
  <Route key="c-wish" path="/wishlist" element={<Wishlist />} />,
  <Route key="c-check" path="/checkout" element={<Checkout />} />,
  <Route key="c-orders" path="/orders" element={<Orders />} />,
  <Route key="c-o-d" path="/orders/:id" element={<OrderDetail />} />,
  <Route key="c-o-l" path="/order-lookup" element={<OrderLookup />} />,
  <Route key="c-o-g" path="/guest-order/:orderCode" element={<GuestOrder />} />,
  <Route key="c-prof" path="/profile" element={<Profile />} />,
  <Route key="c-acc" path="/account" element={<Profile />} />,
  <Route key="c-about" path="/about" element={<About />} />,
  <Route key="c-sup" path="/support" element={<Support />} />,
  <Route key="c-prom" path="/promotions" element={<Promotions />} />,
  <Route key="c-deals" path="/deals" element={<Promotions />} />,
  <Route key="pay-ret" path="/payment/return" element={<PaymentReturn />} />,
  <Route key="pay-vnp" path="/payment/vnpay-return" element={<PaymentReturn />} />,
  <Route key="pay-can" path="/payment/cancel" element={<PaymentCancel />} />,
];
