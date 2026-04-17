// src/pages/AdminUserManagement.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Modal as AntModal } from "antd";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../../hooks/useUsers";
import Modal from "../../../components/common/Modal";
import Loading from "../../../components/common/Loading";
import UserTable from "../../../components/admin/UserManagement/UserTable";
import UserForm from "../../../components/admin/UserManagement/UserForm";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import { useAuth } from "../../../contexts/AuthContext";

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser, hasPermission } = useAuth();
  const { data: users = [], isLoading, error, refetch } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = !roleFilter || user.role === roleFilter;
      const matchStatus = !statusFilter || user.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  const handleCreateUser = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      closeModal();
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      const updateData = {};

      if (typeof formData.name === "string" && formData.name.trim() !== "") {
        updateData.name = formData.name.trim();
      }

      if (
        typeof formData.password === "string" &&
        formData.password.trim() !== ""
      ) {
        updateData.password = formData.password.trim();
      }

      if (formData.role) {
        updateData.role = formData.role;
      }

      await updateMutation.mutateAsync({
        id: modalState.data.id,
        data: updateData,
      });
      closeModal();
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleDeleteUser = (user) => {
    AntModal.confirm({
      title: "Vô hiệu hóa / Xóa mềm tài khoản?",
      content: `Nếu tài khoản "${user.email}" đã có đơn hàng thì hệ thống sẽ vô hiệu hóa thay vì xóa.`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(user.id);
        } catch (err) {
          // Error handled by mutation
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý tài khoản và thông tin người dùng trong hệ thống
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
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
                  { value: "BAN_HANG", label: "Nhân viên bán hàng" },
                  { value: "KHO", label: "Thủ kho" },
                  { value: "ADMIN", label: "Quản trị viên" },
                ]}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "", label: "Tất cả trạng thái" },
                  { value: "ACTIVE", label: "Đang hoạt động" },
                  { value: "PENDING", label: "Chờ xác thực" },
                  { value: "SUSPENDED", label: "Tạm khóa" },
                ]}
              />
            </div>
            {hasPermission('user.manage') && (
              <Button icon={Plus} onClick={() => openModal("create")}>
                Thêm người dùng
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {isLoading ? (
            <Loading text="Đang tải dữ liệu..." variant="admin" />
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">Lỗi: {String(error)}</p>
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
              users={paginatedUsers}
              currentUserId={currentUser?.id}
              hasPermission={hasPermission}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              total={filteredUsers.length}
              onPageChange={(page) => setCurrentPage(page)}
              onEdit={(user) => openModal("edit", user)}
              onDelete={handleDeleteUser}
              onViewAddresses={(user) => navigate(`/admin-users/${user.id}`)}
            />
          )}
        </div>
      </div>

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
    </div>
  );
};

export default AdminUserManagement;
