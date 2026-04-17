import React, { lazy } from "react";
import { Route } from "react-router-dom";
import AdminRoute from "../AdminRoute";
import AdminLayout from "../../components/layouts/AdminLayout";

const Dashboard = lazy(() => import("../../pages/Admin/Dashboard/AdminDashboardPage"));
const Products = lazy(() => import("../../pages/Admin/Product/ProductsPage"));
const ProductDetail = lazy(() => import("../../pages/Admin/Product/ProductDetailPage"));
const ProductCreate = lazy(() => import("../../pages/Admin/Product/ProductCreatePage"));
const Categories = lazy(() => import("../../pages/Admin/Category/CategoriesPage"));
const Users = lazy(() => import("../../pages/Admin/User/UserManagement"));
const UserDetail = lazy(() => import("../../pages/Admin/User/UserDetailPage"));
const Addresses = lazy(() => import("../../pages/Admin/User/AddressManagementPage"));
const Roles = lazy(() => import("../../pages/Admin/User/RoleManagement"));
const Orders = lazy(() => import("../../pages/Admin/Order/OrderManagement"));
const OrderDetail = lazy(() => import("../../pages/Admin/Order/OrderDetailPage"));
const Discounts = lazy(() => import("../../pages/Admin/Discount/DiscountManagement"));
const DiscountForm = lazy(() => import("../../pages/Admin/Discount/DiscountFormPage"));
const Banners = lazy(() => import("../../pages/Admin/Banner/BannerManagement"));
const Chat = lazy(() => import("../../pages/Admin/Chat/AdminChatManagement"));
const Report = lazy(() => import("../../pages/Admin/Report/ReportPage"));
const Payment = lazy(() => import("../../pages/Admin/Payment/PaymentManagement"));
const Profile = lazy(() => import("../../pages/Admin/Profile/ProfilePage"));

const wrap = (Comp) => <AdminRoute><AdminLayout><Comp /></AdminLayout></AdminRoute>;

export const adminRoutes = [
  <Route key="admin-db" path="/admin-dashboard" element={wrap(Dashboard)} />,
  <Route key="admin-p" path="/admin-products" element={wrap(Products)} />,
  <Route key="admin-p-c" path="/admin-products/create" element={wrap(ProductCreate)} />,
  <Route key="admin-p-e" path="/admin-products/:id/edit" element={wrap(ProductCreate)} />,
  <Route key="admin-p-d" path="/admin-products/:id" element={wrap(ProductDetail)} />,
  <Route key="admin-cat" path="/admin-categories" element={wrap(Categories)} />,
  <Route key="admin-u" path="/admin-users" element={wrap(Users)} />,
  <Route key="admin-u-d" path="/admin-users/:id" element={wrap(UserDetail)} />,
  <Route key="admin-addr" path="/admin-addresses" element={wrap(Addresses)} />,
  <Route key="admin-role" path="/admin-role-permissions" element={wrap(Roles)} />,
  <Route key="admin-o" path="/admin-orders" element={wrap(Orders)} />,
  <Route key="admin-o-d" path="/admin-orders/:id" element={wrap(OrderDetail)} />,
  <Route key="admin-d" path="/admin-discounts" element={wrap(Discounts)} />,
  <Route key="admin-fs" path="/admin-flash-sales" element={wrap(Discounts)} />,
  <Route key="admin-d-n" path="/admin-discounts/new" element={wrap(DiscountForm)} />,
  <Route key="admin-fs-n" path="/admin-flash-sales/new" element={wrap(DiscountForm)} />,
  <Route key="admin-d-e" path="/admin-discounts/edit/:id" element={wrap(DiscountForm)} />,
  <Route key="admin-fs-e" path="/admin-flash-sales/edit/:id" element={wrap(DiscountForm)} />,
  <Route key="admin-b" path="/admin-banners" element={wrap(Banners)} />,
  <Route key="admin-chat" path="/admin-chat" element={wrap(Chat)} />,
  <Route key="admin-r" path="/admin-reports" element={wrap(Report)} />,
  <Route key="admin-pay" path="/admin-payments" element={wrap(Payment)} />,
  <Route key="admin-prof" path="/admin/profile" element={wrap(Profile)} />,
];
