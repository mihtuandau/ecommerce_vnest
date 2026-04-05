import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginForm({ toggleForm }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, message, loading, setMessage } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
        <p className="text-gray-600">Chào mừng bạn trở lại</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${message.includes("thành công") ? "bg-green-50 border-green-200 text-green-600" : "bg-red-50 border-red-200 text-red-600"}`}
        >
          <p className="text-sm text-center">{message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              lang="en"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className={`block w-full pl-10 pr-11 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition backdrop-blur-sm text-gray-900 placeholder-gray-700 ${
                fieldErrors.password
                  ? "border-red-400/55 bg-red-50/18"
                  : "border-white/26 bg-white/16 hover:bg-white/24"
              }`}
              placeholder="••••••••"
            />  
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          {loading ? (
            "Đang đăng nhập..."
          ) : (
            <>
              Đăng nhập
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm">
        <button
          onClick={() => toggleForm("forgotPassword")}
          className="text-[#00a85a] hover:text-[#008f4d]"
        >
          Quên mật khẩu?
        </button>
      </p>

      <p className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <button
          onClick={() => toggleForm("register")}
          className="font-medium text-[#00a85a] hover:text-[#008f4d]"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}
