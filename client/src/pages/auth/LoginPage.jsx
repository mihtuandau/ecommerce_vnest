import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { notify } from "../../utils/notification";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { handleLogin, loading: isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleLogin(formData);
    } catch (err) {
      if (err.message === "Chưa xác thực.") {
        notify.info("Tài khoản của bạn chưa được xác thực. Đang chuyển hướng đến trang hoàn tất đăng ký...");
        setTimeout(() => {
          navigate("/register", { state: { email: formData.email } });
        }, 1500);
      } else {
        notify.error(err.message || "Đăng nhập thất bại");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?_t=${Date.now()}`;
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-900 hover:text-gray-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              variant="dark"
              size="lg"
              fullWidth
              icon={!isLoading && ArrowRight}
              className="cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline-gray"
              fullWidth
              size="lg"
              className="cursor-pointer bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-semibold normal-case tracking-normal"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gray-900 hover:text-gray-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
        <img
          src="/bannerlogin.png"
          alt="Login Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
