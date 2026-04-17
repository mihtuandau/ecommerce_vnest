import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Layout, 
  Input, 
  Badge, 
  Dropdown, 
  Avatar, 
  Space, 
  Button,
  List,
  Typography,
  Divider
} from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

const getAdminPageTitle = (pathname) => {
  const routeMap = [
    [/^\/admin-dashboard$/, 'Dashboard'],
    [/^\/admin-products$/, 'Sản phẩm'],
    [/^\/admin-products\/create$/, 'Thêm sản phẩm'],
    [/^\/admin-products\/\d+\/edit$/, 'Chỉnh sửa sản phẩm'],
    [/^\/admin-products\/\d+$/, 'Chi tiết sản phẩm'],
    [/^\/admin-categories$/, 'Danh mục'],
    [/^\/admin-users$/, 'Khách hàng'],
    [/^\/admin-users\/\d+$/, 'Chi tiết khách hàng'],
    [/^\/admin-addresses$/, 'Địa chỉ khách hàng'],
    [/^\/admin-orders$/, 'Đơn hàng'],
    [/^\/admin-orders\/\d+$/, 'Chi tiết đơn hàng'],
    [/^\/admin-payments$/, 'Thanh toán'],
    [/^\/admin-discounts$/, 'Mã giảm giá'],
    [/^\/admin-flash-sales$/, 'Flash Sale'],
    [/^\/admin-discounts\/new$/, 'Tạo mã giảm giá'],
    [/^\/admin-discounts\/new-flash-sale$/, 'Tạo Flash Sale'],
    [/^\/admin-discounts\/edit\/\d+$/, 'Chỉnh sửa mã giảm giá'],
    [/^\/admin-banners$/, 'Banner'],
    [/^\/admin-chat$/, 'Chat hỗ trợ'],
    [/^\/admin-reports$/, 'Báo cáo'],
    [/^\/admin\/profile$/, 'Tài khoản'],
  ];

  const match = routeMap.find(([pattern]) => pattern.test(pathname));
  return match ? match[1] : 'Dashboard';
};

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMdUp = viewportWidth >= 768;
  const isLgUp = viewportWidth >= 1024;
  const sidebarWidth = sidebarOpen ? 256 : 80;
  const pageTitle = getAdminPageTitle(location.pathname);

  const notifications = [
    {
      id: 1,
      text: "New order #1234 received",
      time: "2 mins ago",
      unread: true,
    },
    {
      id: 2,
      text: "Low stock alert: Áo thun nam",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      text: "User John Doe registered",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/admin/profile">My Profile</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: logout,
    },
  ];

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Text strong>Notifications</Text>
        <Button type="link" size="small" style={{ padding: 0 }}>
          Mark all as read
        </Button>
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ 
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: item.unread ? '#e6f7ff' : 'transparent',
            }}
            className="notification-item"
          >
            <List.Item.Meta
              title={<Text style={{ fontSize: 13 }}>{item.text}</Text>}
              description={<Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Text>}
            />
          </List.Item>
        )}
      />
      <div style={{ 
        padding: '12px 16px', 
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <Button type="link" size="small">
          View all notifications
        </Button>
      </div>
      <style>{`
        .notification-item:hover {
          background-color: #fafafa !important;
        }
      `}</style>
    </div>
  );

  return (
    <Header 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: isMdUp ? sidebarWidth : 0,
        right: 0,
        width: isMdUp ? `calc(100% - ${sidebarWidth}px)` : '100%',
        zIndex: 30, 
        height: 64,
        padding: isMdUp ? '0 18px' : '0 12px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'left 0.3s ease, width 0.3s ease, padding 0.3s ease',
      }}
    >
      <Space size="middle">
        <Button
          type="text"
          icon={sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ fontSize: 18 }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong style={{ fontSize: 24, color: '#0f172a', display: viewportWidth >= 640 ? 'block' : 'none', lineHeight: '24px' }}>
            {pageTitle}
          </Text>
        </div>
      </Space>

      <div style={{ flex: 1, maxWidth: 520, margin: '0 16px', display: isMdUp ? 'block' : 'none' }}>
        <Search
          placeholder="Search products, orders, users..."
          prefix={<SearchOutlined />}
          size="middle"
          allowClear
          style={{ width: '100%' }}
        />
      </div>

      <Space size="middle">
        <Button 
          type="text" 
          icon={<SearchOutlined />}
          size="middle"
          style={{ display: isMdUp ? 'none' : 'inline-flex' }}
        />

        <Dropdown
          popupRender={() => notificationContent}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={unreadCount} size="small">
            <Button 
              type="text" 
              icon={<BellOutlined />}
              size="large"
            />
          </Badge>
        </Dropdown>

        <Link to="/admin/settings" style={{ display: isLgUp ? 'inline-flex' : 'none' }}>
          <Button 
            type="text" 
            icon={<SettingOutlined />}
            size="middle"
          />
        </Link>

        <Divider orientation="vertical" />

        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              style={{ backgroundColor: '#1890ff' }}
              size={36}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
            <div style={{ display: isLgUp ? 'block' : 'none', textAlign: 'left' }}>
              <Text strong style={{ display: 'block', fontSize: 14, lineHeight: '20px' }}>
                {user?.name || "Admin"}
              </Text>
              <Text type="secondary" style={{ fontSize: 12, lineHeight: '16px' }}>
                {user?.role || "Administrator"}
              </Text>
            </div>
            <DownOutlined style={{ fontSize: 12, display: isLgUp ? 'block' : 'none' }} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;






