import { User, Mail } from 'lucide-react';
import Button from '../../common/Button';

const ProfileForm = ({ profileForm, setProfileForm, onSubmit, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Thông tin tài khoản</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ và tên"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Cập nhật thông tin'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
