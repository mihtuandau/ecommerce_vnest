import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, House, Briefcase, Search } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import Loading from '../../../components/common/Loading';

const normalizeText = (value = '') => String(value || '').toLowerCase();

const getTypeMeta = (type) => {
  if (type === 'OFFICE') {
    return { label: 'Văn phòng', className: 'bg-purple-100 text-purple-700', icon: '🏢' };
  }
  if (type === 'OTHER') {
    return { label: 'Khác', className: 'bg-slate-100 text-slate-600', icon: '📍' };
  }
  return { label: 'Nhà riêng', className: 'bg-blue-100 text-blue-700', icon: '🏠' };
};

const buildAddressString = (address) => {
  return [address.street, address.ward, address.state, address.city].filter(Boolean).join(', ');
};

const AddressManagementPage = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useUsers({ page: 1, limit: 1000 });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const allAddresses = useMemo(() => {
    return users.flatMap((user) => {
      const addresses = Array.isArray(user.addresses) ? user.addresses : [];
      return addresses.map((address) => ({
        ...address,
        userId: user.id,
        userName: user.name || user.email,
      }));
    });
  }, [users]);

  const filteredAddresses = useMemo(() => {
    return allAddresses.filter((address) => {
      const query = normalizeText(search);
      const target = normalizeText(`${address.userName} ${buildAddressString(address)} ${address.phone || ''}`);
      const matchQuery = !query || target.includes(query);
      const matchType = !typeFilter || address.addressType === typeFilter;
      return matchQuery && matchType;
    });
  }, [allAddresses, search, typeFilter]);

  const stats = useMemo(() => {
    const total = allAddresses.length;
    const defaults = allAddresses.filter((a) => a.isDefault).length;
    const offices = allAddresses.filter((a) => a.addressType === 'OFFICE').length;
    return { total, defaults, offices };
  }, [allAddresses]);

  if (isLoading) {
    return <Loading text="Đang tải danh sách địa chỉ..." variant="admin" />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Dashboard</span>
        <span>/</span>
        <span className="font-semibold text-slate-800">Địa chỉ</span>
      </div>

      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Địa chỉ khách hàng</h1>
        <p className="mt-1 text-lg text-slate-500">{stats.total} địa chỉ đã lưu</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600"><MapPin size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Tổng địa chỉ</p>
              <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600"><House size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Địa chỉ mặc định</p>
              <p className="text-4xl font-bold text-slate-900">{stats.defaults}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600"><Briefcase size={20} /></div>
            <div>
              <p className="text-sm text-slate-500">Văn phòng</p>
              <p className="text-4xl font-bold text-slate-900">{stats.offices}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên khách, địa chỉ..."
              className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
          >
            <option value="">Tất cả loại</option>
            <option value="HOME">Nhà riêng</option>
            <option value="OFFICE">Văn phòng</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Loại</th>
                <th className="px-5 py-3">Địa chỉ</th>
                <th className="px-5 py-3">Số điện thoại</th>
                <th className="px-5 py-3">Mặc định</th>
                <th className="px-5 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAddresses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">Không có địa chỉ nào phù hợp</td>
                </tr>
              ) : (
                filteredAddresses.map((address) => {
                  const type = getTypeMeta(address.addressType);
                  return (
                    <tr key={`${address.userId}-${address.id}`} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin-users/${address.userId}`)}
                          className="font-semibold text-blue-600 hover:text-blue-500"
                        >
                          {address.userName}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${type.className}`}>
                          <span>{type.icon}</span>
                          {type.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">{buildAddressString(address)}</td>
                      <td className="px-5 py-4 text-slate-600">{address.phone || '--'}</td>
                      <td className="px-5 py-4">
                        {address.isDefault ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Mặc định</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link to={`/admin-users/${address.userId}`} className="font-semibold text-blue-600 hover:text-blue-500">Xem KH</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddressManagementPage;
