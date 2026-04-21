import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Key, ArrowRight } from "lucide-react";
import authService from "../../services/authService";
import { notify } from "../../utils/notification";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSendEmail = async (e) => {
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
      notify.success("Mã OTP đã được gửi đến email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số");
      return;
    }
    // Chuyển hướng sang trang reset với params
    navigate(`/reset-password?token=${otp}&email=${email}`);
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {step === 1 ? "Quên mật khẩu" : "Xác thực OTP"}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? "Nhập email để nhận mã khôi phục" 
                : `Vui lòng nhập mã 6 số đã gửi đến ${email}`}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendEmail} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="bg-gray-50 border-l-4 border-black p-4 text-sm text-gray-600 rounded-r-lg">
                <p>Chúng tôi sẽ gửi một mã OTP gồm 6 chữ số vào email của bạn để xác nhận danh tính.</p>
              </div>

              <Input
                label="Email của bạn"
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

              <Button
                type="submit"
                disabled={loading}
                variant="dark"
                fullWidth
                size="lg"
                icon={!loading && ArrowRight}
              >
                {loading ? 'Đang xử lý...' : 'Gửi mã xác thực'}
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-gray-500 hover:text-black text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Input
                label="Nhập mã OTP"
                type="text"
                name="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                  setError("");
                }}
                icon={Key}
                placeholder="000 000"
                className="text-center text-2xl tracking-[0.5em] font-bold"
                required
              />

              <Button
                type="submit"
                variant="dark"
                fullWidth
                size="lg"
                icon={ArrowRight}
              >
                Xác thực & Đặt mật khẩu
              </Button>

              <div className="flex flex-col items-center space-y-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Dùng email khác
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  {loading ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
        <img 
          src="/bannerlogin.png" 
          alt="Password Recovery" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;






