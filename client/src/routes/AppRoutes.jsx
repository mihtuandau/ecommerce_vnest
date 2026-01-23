// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loading from "../components/common/Loading";
import AdminRoute from "./AdminRoute";
// import ProtectedRoute from './ProtectedRoute';

// Layouts
import AdminLayout from "../components/layouts/AdminLayout";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import HomePage from "../pages/Customer/Home/HomePage";

const ProductsPage = lazy(() =>
  import("../pages/Customer/Product/ProductsPage")
);
const ProductDetailPage = lazy(() =>
  import("../pages/Customer/Product/ProductDetailPage")
);
const CategoryPage = lazy(() =>
  import("../pages/Customer/Product/CategoryPage")
);
const FeaturedProductsPage = lazy(() =>
  import("../pages/Customer/Product/FeaturedProductsPage")
);
const BestSellingProductsPage = lazy(() =>
  import("../pages/Customer/Product/BestSellingProductsPage")
);
const CartPage = lazy(() => import("../pages/Customer/Cart/CartPage"));
const WishlistPage = lazy(() => import("../pages/Customer/WishlistPage"));
const CheckoutPage = lazy(() =>
  import("../pages/Customer/Checkout/CheckoutPage")
);
const OrdersPage = lazy(() => import("../pages/Customer/Order/OrdersPage"));
const OrderDetailPage = lazy(() =>
  import("../pages/Customer/Order/OrderDetailPage")
);
const OrderLookupPage = lazy(() =>
  import("../pages/Customer/Order/OrderLookupPage")
);
const GuestOrderDetailPage = lazy(() =>
  import("../pages/Customer/Order/GuestOrderDetailPage")
);

const PaymentReturn = lazy(() =>
  import("../pages/Customer/Payment/PaymentReturn")
);
const PaymentCancel = lazy(() =>
  import("../pages/Customer/Payment/PaymentCancel")
);
const AdminDashboardPage = lazy(() =>
  import("../pages/Admin/Dashboard/AdminDashboardPage")
);
const AdminProductsPage = lazy(() =>
  import("../pages/Admin/Product/ProductsPage")
);
const AdminProductDetailPage = lazy(() =>
  import("../pages/Admin/Product/ProductDetailPage")
);
const AdminProductCreatePage = lazy(() =>
  import("../pages/Admin/Product/ProductCreatePage")
);
const AdminCategoriesPage = lazy(() =>
  import("../pages/Admin/Category/CategoriesPage")
);
const AdminUsersPage = lazy(() => import("../pages/Admin/User/UserManagement"));
const AdminOrdersPage = lazy(() =>
  import("../pages/Admin/Order/OrderManagement")
);
const AdminPaymentsPage = lazy(() =>
  import("../pages/Admin/Payment/PaymentManagement")
);
const AdminDiscountsPage = lazy(() =>
  import("../pages/Admin/Discount/DiscountManagement")
);
const AdminBannersPage = lazy(() =>
  import("../pages/Admin/Banner/BannerManagement")
);
const AdminChatPage = lazy(() =>
  import("../pages/Admin/Chat/AdminChatManagement")
);
const AdminReportPage = lazy(() => import("../pages/Admin/Report/ReportPage"));
const AdminProfilePage = lazy(() =>
  import("../pages/Admin/Profile/ProfilePage")
);
const CustomerProfilePage = lazy(() =>
  import("../pages/Customer/Profile/ProfilePage")
);
const AboutPage = lazy(() => import("../pages/Customer/About/AboutPage"));
const ContactPage = lazy(() => import("../pages/Customer/Contact/ContactPage"));
const SupportChatPage = lazy(() =>
  import("../pages/Customer/Support/SupportChatPage")
);
const PromotionsPage = lazy(() =>
  import("../pages/Customer/Promotions/PromotionsPage")
);

const AppRoutes = () => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <Suspense
      fallback={
        <Loading
          fullScreen
          text="Đang tải..."
          variant={isAdminRoute ? "admin" : "user"}
        />
      }
    >
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Customer Routes */}
        <Route path="/profile" element={<CustomerProfilePage />} />
        <Route path="/account" element={<CustomerProfilePage />} />
        <Route path="/" element={<HomePage />} />

        {/* About & Contact Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support" element={<SupportChatPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/deals" element={<PromotionsPage />} />

        {/* Product Routes */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/featured" element={<FeaturedProductsPage />} />
        <Route
          path="/products/bestselling"
          element={<BestSellingProductsPage />}
        />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/category/:id" element={<CategoryPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />

        {/* Cart & Wishlist Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Checkout & Orders Routes */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/order-lookup" element={<OrderLookupPage />} />
        <Route
          path="/guest-order/:orderCode"
          element={<GuestOrderDetailPage />}
        />

        {/* Payment Routes */}
        <Route path="/payment/return" element={<PaymentReturn />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Admin Routes - WITH AdminLayout */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-products"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-products/create"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductCreatePage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-products/:id/edit"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductCreatePage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-products/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductDetailPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-categories"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminCategoriesPage />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-orders"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-payments"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminPaymentsPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-discounts"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDiscountsPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-banners"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminBannersPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-chat"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminChatPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin-reports"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminReportPage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProfilePage />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
