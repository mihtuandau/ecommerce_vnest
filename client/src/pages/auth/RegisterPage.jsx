import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Lock, User, ArrowRight, Chrome, Eye, EyeOff } from "lucide-react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { notify } from "../../utils/notification";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleRegister, handleVerifyOtp, handleResendOtp } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [otp, setOtp] = useState("");

  // Update email if redirected from login
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

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
    else if (formData.password.length < 8)
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!formData.name) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await handleRegister(formData);
      setStep(2); 
    } catch (error) {
      // Error is handled in AuthContext, no need to notify again
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: "Mã OTP phải có 6 chữ số" });
      return;
    }

    setIsLoading(true);
    try {
      await handleVerifyOtp(formData.email, otp);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await handleResendOtp(formData.email);
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?_t=${Date.now()}`;
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInLeft">
        <img
          src="/register.png"
          alt="Register Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInRight lg:shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {step === 1 ? "Create Account" : "Verify Email"}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1
                ? "Đăng ký để bắt đầu mua sắm"
                : `Vui lòng nhập mã OTP đã được gửi tới ${formData.email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={User}
                placeholder="John Doe"
                required
              />

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

              <Button
                type="submit"
                disabled={isLoading}
                variant="dark"
                fullWidth
                size="lg"
                icon={!isLoading && ArrowRight}
                className="cursor-pointer"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-gray-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white transition-all outline-none"
                  placeholder="000000"
                  required
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="dark"
                fullWidth
                size="lg"
                className="cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center py-4">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-gray-900 font-bold hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-4 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  Back to Registration
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
