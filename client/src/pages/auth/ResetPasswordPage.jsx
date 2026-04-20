import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import authService from '../../services/authService';
import { notify } from '../../utils/notification';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!token || !email) {
      setErrors({ submit: 'Link không hợp lệ' });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, email, formData.password);
      setSuccess(true);
      notify.success('Đặt lại mật khẩu thành công!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Link không hợp lệ hoặc đã hết hạn' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex overflow-hidden bg-white">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
          <div className="w-full max-w-md">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-gray-900" size={40} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thành công!</h1>
                <p className="text-gray-600">
                  Mật khẩu của bạn đã được đặt lại thành công!
                </p>
              </div>

              <p className="text-sm text-gray-500">
                Đang chuyển đến trang đăng nhập...
              </p>

              <Button
                onClick={() => navigate('/login')}
                variant="dark"
                size="lg"
              >
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
          <img 
            src="/bannerlogin.png" 
            alt="Reset Password" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInLeft lg:shadow-[8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600 mt-2">Nhập mật khẩu mới của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {email && (
              <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm">
                <p>Đặt lại mật khẩu cho: <span className="font-semibold">{email}</span></p>
              </div>
            )}

            <Input
              label="Mật khẩu mới"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            <Input
              label="Xác nhận mật khẩu mới"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg text-sm text-gray-600">
              <p className="font-medium mb-2">Mật khẩu phải:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Có ít nhất 6 ký tự</li>
                <li>Không trùng với mật khẩu cũ</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              variant="dark"
              fullWidth
              size="lg"
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Nhớ mật khẩu?{' '}
              <Link to="/login" className="text-gray-900 hover:text-gray-700 font-semibold">
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInRight">
        <img 
          src="/bannerlogin.png" 
          alt="Reset Password" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;






