import { User, Shield } from 'lucide-react';

const ProfileCard = ({ user, addressCount, formatDate }) => {
  const getRoleBadge = (role) => {
    return role === 'ADMIN' ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        <Shield className="w-3 h-3" />
        Quản trị viên
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
        <User className="w-3 h-3" />
        Khách hàng
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
        <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
        {getRoleBadge(user?.role)}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="text-gray-500">Tham gia</p>
            <p className="font-medium text-gray-900">
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div>
            <p className="text-gray-500">Địa chỉ</p>
            <p className="font-medium text-gray-900">{addressCount} địa chỉ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
