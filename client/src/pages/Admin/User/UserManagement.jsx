// src/pages/AdminUserManagement.jsx
import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../../hooks/useUsers";
import userService from "../../../services/userService";

// Components
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Loading from "../../../components/common/Loading";
import UserTable from "../../../components/admin/UserManagement/UserTable";
import UserForm from "../../../components/admin/UserManagement/UserForm";
import AddressList from "../../../components/admin/UserManagement/AddressList";

const AdminUserManagement = () => {
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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
    try {
      await createMutation.mutateAsync(formData);
      closeModal();
    } catch (err) {
      // Error already handled by mutation
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      const updateData = { name: formData.name };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await updateMutation.mutateAsync({
        id: modalState.data.id,
        data: updateData,
      });
      closeModal();
    } catch (err) {
      // Error already handled by mutation
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Xác nhận xóa người dùng "${user.email}"?`)) {
      try {
        await deleteMutation.mutateAsync(user.id);
      } catch (err) {
        // Error already handled by mutation
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
      alert("Có lỗi xảy ra: " + err.message);
    }
  };

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
                  { value: "", label: "Tất cả vai trò" },
                  { value: "CUSTOMER", label: "Khách hàng" },
                  { value: "ADMIN", label: "Quản trị viên" },
                ]}
              />
            </div>
            <Button icon={Plus} onClick={() => openModal("create")}>
              Thêm người dùng
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <Loading text="Đang tải dữ liệu..." variant="admin" />
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">Lỗi: {error}</p>
              <Button
                onClick={() => refetch()}
                variant="secondary"
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={(user) => openModal("edit", user)}
              onDelete={handleDeleteUser}
              onViewAddresses={(user) => openModal("addresses", user)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalState.type === "create"}
        onClose={closeModal}
        title="Tạo người dùng mới"
      >
        <UserForm onSubmit={handleCreateUser} onCancel={closeModal} />
      </Modal>

      <Modal
        isOpen={modalState.type === "edit"}
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
        isOpen={modalState.type === "addresses"}
        onClose={closeModal}
        title={`Địa chỉ của ${modalState.data?.email || ""}`}
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
