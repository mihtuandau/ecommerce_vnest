// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import Loading from "../components/common/Loading";
import AdminRoute from "./AdminRoute";
// import ProtectedRoute from './ProtectedRoute';

// Layouts
import AdminLayout from "../components/layouts/AdminLayout";

// Auth Pages (eager load for quick access)
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";

// Eager load HomePage to avoid double loading after login
import HomePage from "../pages/Customer/Home/HomePage";

// Lazy load other pages for better performance
const ProductsPage = lazy(() => import("../pages/Customer/Product/ProductsPage"));
const ProductDetailPage = lazy(() => import("../pages/Customer/Product/ProductDetailPage"));
const CategoryPage = lazy(() => import("../pages/Customer/Product/CategoryPage"));
const CartPage = lazy(() => import("../pages/Customer/Cart/CartPage"));
const CheckoutPage = lazy(() =>
  import("../pages/Customer/Checkout/CheckoutPage")
);
const OrdersPage = lazy(() => import("../pages/Customer/Order/OrdersPage"));
const OrderDetailPage = lazy(() =>
  import("../pages/Customer/Order/OrderDetailPage")
);
const AdminDashboardPage = lazy(() =>
  import("../pages/Admin/Dashboard/AdminDashboardPage")
);
const AdminProductsPage = lazy(() =>
  import("../pages/Admin/Product/ProductsPage")
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
const AdminProfilePage = lazy(() =>
  import("../pages/Admin/Profile/ProfilePage")
);
const CustomerProfilePage = lazy(() =>
  import("../pages/Customer/Profile/ProfilePage")
);

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<Loading fullScreen text="Loading page..." />}>
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

          {/* Product Routes */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/category/:id" element={<CategoryPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />

          {/* Cart Route */}
          <Route path="/cart" element={<CartPage />} />

          {/* Checkout & Orders Routes */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

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
    </AuthProvider>
  );
};

export default AppRoutes;
