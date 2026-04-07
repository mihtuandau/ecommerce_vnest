import React, { useState } from "react";
import { Form, Input, Select, Button, Space, Alert } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useUserForm } from "../../../hooks/useUserForm";

const { Option } = Select;

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { formData, errors, validate, handleChange } = useUserForm(user);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setAlert(null);

    try {
      await onSubmit(formData);
      setAlert({
        type: "success",
        message: user
          ? "Cập nhật người dùng thành công!"
          : "Tạo người dùng mới thành công!",
      });
      setTimeout(() => onCancel(), 1500);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.message}
          closable
          onClose={() => setAlert(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          email: formData.email,
          name: formData.name,
          role: formData.role,
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email}
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="user@example.com"
            size="large"
            disabled={!!user}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={user ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}
          name="password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password}
          rules={
            !user ? [{ required: true, message: "Vui lòng nhập mật khẩu" }] : []
          }
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            size="large"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Tên" name="name">
          <Input
            prefix={<UserOutlined />}
            placeholder="Nguyễn Văn A"
            size="large"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select
            placeholder="Chọn vai trò"
            size="large"
            value={formData.role}
            onChange={(value) => handleChange("role", value)}
            getPopupContainer={(trigger) => trigger.parentElement}
            popupStyle={{ zIndex: 10001 }}
          >
            <Option value="CUSTOMER">Khách hàng</Option>
            <Option value="ADMIN">Quản trị viên</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} disabled={loading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {user ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm;
