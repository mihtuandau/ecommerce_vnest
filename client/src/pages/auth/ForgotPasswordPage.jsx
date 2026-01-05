// src/pages/Auth/ForgotPasswordPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import authService from "../../services/authService";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setSent(true);
      notify.success("Email khôi phục đã được gửi!");
    } catch (err) {setError(
        err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex overflow-hidden bg-white">
        {/* Left Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
          <div className="w-full max-w-md">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto">
                <Mail className="text-gray-900" size={40} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kiểm tra email</h1>
                <p className="text-gray-600">
                  Chúng tôi đã gửi email khôi phục mật khẩu đến
                </p>
              </div>

              <p className="font-semibold text-gray-900 text-lg">{email}</p>

              <p className="text-sm text-gray-500">
                Vui lòng kiểm tra hộp thư và làm theo hướng dẫn. Link sẽ hết hạn sau 1 giờ.
              </p>

              <div className="pt-4 space-y-4">
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  fullWidth
                  size="lg"
                >
                  Không nhận được email? Gửi lại
                </Button>

                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700"
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
          <img 
            src="/bannerlogin.png" 
            alt="Forgot Password" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Quên mật khẩu
            </h1>
            <p className="text-gray-600 mt-2">Nhập email để khôi phục mật khẩu</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div className="bg-gray-50 border border-blue-500 text-blue-500 px-4 py-3 text-sm rounded-xl" >
              <p>
                Nhập email đã đăng ký. Chúng tôi sẽ gửi link để đặt lại mật khẩu.
              </p>
            </div>

            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              icon={Mail}
              placeholder="your@email.com"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              variant="dark"
              fullWidth
              size="lg"
            >
              {loading ? 'Đang gửi...' : 'Gửi link khôi phục'}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-gray-900 hover:text-gray-700 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                <span>Quay lại đăng nhập</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
        <img 
          src="/bannerlogin.png" 
          alt="Forgot Password" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
