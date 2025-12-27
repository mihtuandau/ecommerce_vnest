// src/pages/AdminUserManagement.jsx
import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { useUsers } from '../../../hooks/useUsers';
import userService from '../../../services/userService';

// Components
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import Loading from '../../../components/common/Loading';
import Pagination from '../../../components/common/Pagination';
import UserTable from '../../../components/admin/UserManagement/UserTable';
import UserForm from '../../../components/admin/UserManagement/UserForm';
import AddressList from '../../../components/admin/UserManagement/AddressList';

const AdminUserManagement = () => {
  const { users, loading, error, pagination, setPagination, refetch } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalState, setModalState] = useState({ type: null, data: null });

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = !roleFilter || user.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Modal handlers
  const openModal = (type, data = null) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  // User CRUD handlers
  const handleCreateUser = async (formData) => {
    await userService.createUser(formData);
    refetch();
    closeModal();
  };

  const handleUpdateUser = async (formData) => {
    const updateData = { name: formData.name };
    if (formData.password) {
      updateData.password = formData.password;
    }
    await userService.updateUser(modalState.data.id, updateData);
    refetch();
    closeModal();
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Xác nhận xóa người dùng "${user.email}"?`)) {
      try {
        await userService.deleteUser(user.id);
        refetch();
      } catch (err) {
        alert('Có lỗi xảy ra khi xóa người dùng: ' + err.message);
      }
    }
  };

  // Address handlers
  const handleSetDefaultAddress = async (userId, addressId) => {
    try {
      await userService.updateAddress(userId, addressId, { isDefault: true });
      // Refresh user data
      const updatedUser = await userService.getUser(userId);
      setModalState({ ...modalState, data: updatedUser });
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Calculate total pages (estimate based on current data)
  const totalPages = Math.max(1, Math.ceil(users.length / pagination.limit));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Quản lý tài khoản và thông tin người dùng trong hệ thống
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: '', label: 'Tất cả vai trò' },
                  { value: 'CUSTOMER', label: 'Khách hàng' },
                  { value: 'ADMIN', label: 'Quản trị viên' },
                ]}
              />
            </div>
            <Button icon={Plus} onClick={() => openModal('create')}>
              Thêm người dùng
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <Loading text="Đang tải dữ liệu..." variant="admin" />
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">Lỗi: {error}</p>
              <Button onClick={() => refetch()} variant="secondary" className="mt-4">
                Thử lại
              </Button>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={(user) => openModal('edit', user)}
              onDelete={handleDeleteUser}
              onViewAddresses={(user) => openModal('addresses', user)}
            />
          )}

          {/* Pagination */}
          {!loading && !error && filteredUsers.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalState.type === 'create'}
        onClose={closeModal}
        title="Tạo người dùng mới"
      >
        <UserForm onSubmit={handleCreateUser} onCancel={closeModal} />
      </Modal>

      <Modal
        isOpen={modalState.type === 'edit'}
        onClose={closeModal}
        title="Chỉnh sửa người dùng"
      >
        <UserForm
          user={modalState.data}
          onSubmit={handleUpdateUser}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={modalState.type === 'addresses'}
        onClose={closeModal}
        title={`Địa chỉ của ${modalState.data?.email || ''}`}
      >
        <AddressList
          addresses={modalState.data?.addresses || []}
          userId={modalState.data?.id}
          onSetDefault={handleSetDefaultAddress}
        />
      </Modal>
    </div>
  );
};

export default AdminUserManagement;