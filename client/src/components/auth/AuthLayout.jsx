import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-[#00a85a] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">E-Commerce</span>
          </Link>
          
          {title && (
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          )}
          
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Bằng cách tiếp tục, bạn đồng ý với các điều khoản của chúng tôi
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;