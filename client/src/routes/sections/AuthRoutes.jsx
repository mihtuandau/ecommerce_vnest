import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import ForgotPasswordPage from "../../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";

export const authRoutes = [
  <Route key="auth-login" path="/login" element={<LoginPage />} />,
  <Route key="auth-reg" path="/register" element={<RegisterPage />} />,
  <Route key="auth-forgot" path="/forgot-password" element={<ForgotPasswordPage />} />,
  <Route key="auth-reset" path="/reset-password" element={<ResetPasswordPage />} />,
];
