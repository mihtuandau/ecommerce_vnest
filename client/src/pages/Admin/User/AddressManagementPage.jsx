import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, House, Briefcase, Search } from 'lucide-react';
import { Pagination as AntdPagination } from 'antd';
import { useUsers } from '../../../hooks/useUsers';
import Loading from '../../../components/common/Loading';

const normalizeText = (value = '') => String(value || '').toLowerCase();

const getTypeMeta = (type) => {
  if (type === 'OFFICE') {
    return { label: 'Văn phòng', className: 'bg-purple-100 text-purple-700', icon: '🏢' };
  }
  if (type === 'OTHER') {
    return { label: 'Khác', className: 'bg-gray-100 text-gray-600', icon: '📍' };
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const paginatedAddresses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAddresses.slice(start, start + itemsPerPage);
  }, [filteredAddresses, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAddresses.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (isLoading) {
    return <Loading text="Đang tải danh sách địa chỉ..." variant="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600"><MapPin size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Tổng địa chỉ</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600"><House size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Địa chỉ mặc định</p>
              <p className="text-4xl font-bold text-gray-900">{stats.defaults}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600"><Briefcase size={20} /></div>
            <div>
              <p className="text-sm text-gray-500">Văn phòng</p>
              <p className="text-4xl font-bold text-gray-900">{stats.offices}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên khách, địa chỉ..."
              className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-gray-900"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-900"
          >
            <option value="">Tất cả loại</option>
            <option value="HOME">Nhà riêng</option>
            <option value="OFFICE">Văn phòng</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Loại</th>
                <th className="px-5 py-3">Địa chỉ</th>
                <th className="px-5 py-3">Số điện thoại</th>
                <th className="px-5 py-3">Mặc định</th>
                <th className="px-5 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAddresses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">Không có địa chỉ nào phù hợp</td>
                </tr>
              ) : (
                paginatedAddresses.map((address) => {
                  const type = getTypeMeta(address.addressType);
                  return (
                    <tr key={`${address.userId}-${address.id}`} className="hover:bg-gray-50">
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
                      <td className="px-5 py-4 text-gray-700">{buildAddressString(address)}</td>
                      <td className="px-5 py-4 text-gray-600">{address.phone || '--'}</td>
                      <td className="px-5 py-4">
                        {address.isDefault ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Mặc định</span>
                        ) : (
                          <span className="text-gray-300">—</span>
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

        {filteredAddresses.length > 0 && (
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 p-4">
            <div className="text-sm text-gray-500">
              {filteredAddresses.length === 1
                ? 'Hiển thị 1 địa chỉ'
                : `Hiển thị ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredAddresses.length)} / ${filteredAddresses.length} địa chỉ`}
            </div>
            <AntdPagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredAddresses.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AddressManagementPage;
