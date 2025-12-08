// src/pages/Auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.name) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.access_token) {
        login(response.access_token, response.user);
        toast.success('Đăng ký thành công!');
        navigate('/');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Add timestamp to prevent caching
    window.location.href = `http://localhost:5000/api/auth/google?_t=${Date.now()}`;
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-100">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden animate-slideInLeft">
        <img 
          src="/register.png" 
          alt="Register Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white relative animate-slideInRight lg:shadow-[-8px_0_24px_-8px_rgba(0,0,0,0.12)] z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Đăng ký để bắt đầu mua sắm</p>
          </div>

          {/* Form */}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              variant="dark"
              fullWidth
              size="lg"
              icon={!isLoading && ArrowRight}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              fullWidth
              size="lg"
              icon={Chrome}
            >
              Sign up with Google
            </Button>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 hover:text-gray-700 font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;