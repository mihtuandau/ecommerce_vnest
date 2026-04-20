import React, { useState, useEffect } from "react";
import { Card, Tabs, Checkbox, Button, Space, Divider, Row, Col, Alert, Spin, Tag } from "antd";
import { ShieldCheck, Save, RefreshCw } from "lucide-react";
import authService from "../../../services/authService";
import { notify } from "../../../utils/notification";
import { useAuth } from "../../../hooks/useAuth";

const RoleManagement = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [roleMappings, setRoleMappings] = useState([]);
  const [selectedRole, setSelectedRole] = useState("KHO");

  const roles = [
    { key: "KHO", label: "Thủ kho", color: "emerald" },
    { key: "BAN_HANG", label: "Nhân viên bán hàng", color: "orange" },
    { key: "ADMIN", label: "Quản trị viên (Full)", disabled: true },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allPerms, mappings] = await Promise.all([
        authService.getAllPermissions(),
        authService.getRolesWithPermissions(),
      ]);
      setPermissions(allPerms);
      setRoleMappings(mappings);
    } catch (error) {
      notify.error("Không thể tải dữ liệu quyền hạn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePermission = (role, permissionId) => {

    const isChecked = roleMappings.some(rm => rm.role === role && rm.permissionId === permissionId);
    
    if (isChecked) {
      setRoleMappings(prev => prev.filter(rm => !(rm.role === role && rm.permissionId === permissionId)));
    } else {
      setRoleMappings(prev => [...prev, { role, permissionId }]);
    }
  };

  const handleSave = async () => {
    if (selectedRole === "ADMIN") return;
    
    setSaving(true);
    try {
      const permissionIds = roleMappings
        .filter(rm => rm.role === selectedRole)
        .map(rm => rm.permissionId);
        
      await authService.updateRolePermissions({
        role: selectedRole,
        permissionIds
      });

      if (user?.role === selectedRole) {
        await refreshUser();
      }
      
      notify.success(`Cập nhật quyền cho vai trò ${selectedRole} thành công!`);
    } catch (error) {
      notify.error("Cập nhật quyền thất bại");
    } finally {
      setSaving(false);
    }
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    const group = perm.name.split('.')[0] || 'Khác';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {});

  if (loading) return <div className="flex h-64 items-center justify-center"><Spin size="large" /></div>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-blue-600" /> Quản lý quyền hạn vai trò
        </h1>
        <p className="text-sm text-gray-500">Cấu hình chi tiết các hành động được phép cho từng bộ phận nhân sự</p>
      </div>

      <Card className="shadow-sm rounded-2xl border-gray-100">
        <Tabs 
          activeKey={selectedRole} 
          onChange={setSelectedRole}
          items={roles.map(r => ({
            key: r.key,
            label: (
              <span className="flex items-center gap-2 px-2">
                {r.label}
                {r.key === "ADMIN" && <Tag color="red">Toàn quyền</Tag>}
              </span>
            )
          }))}
        />

        <div className="mt-6">
          {selectedRole === "ADMIN" ? (
            <Alert
              message="Lưu ý"
              description="Vai trò Quản trị viên luôn có toàn bộ quyền trong hệ thống và không thể thay đổi để đảm bảo tính an toàn."
              type="info"
              showIcon
            />
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bảng gán quyền hạn</h3>
                <Space>
                  <Button icon={<RefreshCw size={16} />} onClick={fetchData}>Làm mới</Button>
                  <Button 
                    type="primary" 
                    icon={<Save size={16} />} 
                    loading={saving}
                    onClick={handleSave}
                  >
                    Lưu cấu hình
                  </Button>
                </Space>
              </div>
              
              <Divider />

              {Object.keys(groupedPermissions).map(group => (
                <div key={group} className="mb-8 p-4 bg-gray-50/50 rounded-xl">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">{group}</h4>
                  <Row gutter={[16, 16]}>
                    {groupedPermissions[group].map(perm => {
                      const isChecked = roleMappings.some(rm => rm.role === selectedRole && rm.permissionId === perm.id);
                      return (
                        <Col xs={24} sm={12} md={8} lg={6} key={perm.id}>
                          <div 
                            className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2 ${
                              isChecked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                            onClick={() => handleTogglePermission(selectedRole, perm.id)}
                          >
                            <Checkbox checked={isChecked} className="mt-1" />
                            <div>
                              <div className="font-medium text-gray-900">{perm.name}</div>
                              <div className="text-xs text-gray-500">{perm.description}</div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              ))}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RoleManagement;






