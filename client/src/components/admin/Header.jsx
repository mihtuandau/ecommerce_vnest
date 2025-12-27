import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useAuth } from "../../contexts/authContext";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [notificationOpen, setNotificationOpen] = useState(false);

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

  // User menu items
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

  // Notification dropdown content
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
        left: 0, 
        right: 0, 
        zIndex: 30, 
        height: 64,
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Left: Menu Toggle + Logo */}
      <Space size="middle">
        <Button
          type="text"
          icon={sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ fontSize: 18 }}
        />
        
        <Link to="/admin-dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
     
          <Text strong style={{ fontSize: 18, color: 'rgb(24, 144, 255)', display: window.innerWidth >= 640 ? 'block' : 'none' }}>
            ADMIN PANEL
          </Text>
        </Link>
      </Space>

      {/* Center: Search Bar */}
      <div style={{ flex: 1, maxWidth: 600, margin: '0 24px', display: window.innerWidth >= 768 ? 'block' : 'none' }}>
        <Search
          placeholder="Search products, orders, users..."
          prefix={<SearchOutlined />}
          size="large"
          allowClear
          style={{ width: '100%' }}
        />
      </div>

      {/* Right: Actions + User */}
      <Space size="middle">
        {/* Mobile Search Icon */}
        <Button 
          type="text" 
          icon={<SearchOutlined />}
          size="large"
          style={{ display: window.innerWidth >= 768 ? 'none' : 'inline-flex' }}
        />

        {/* Notifications */}
        <Dropdown
          dropdownRender={() => notificationContent}
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

        {/* Settings */}
        <Link to="/admin/settings" style={{ display: window.innerWidth >= 1024 ? 'inline-flex' : 'none' }}>
          <Button 
            type="text" 
            icon={<SettingOutlined />}
            size="large"
          />
        </Link>

        <Divider type="vertical" />

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              style={{ backgroundColor: '#1890ff' }}
              size="large"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </Avatar>
            <div style={{ display: window.innerWidth >= 1024 ? 'block' : 'none', textAlign: 'left' }}>
              <Text strong style={{ display: 'block', fontSize: 14, lineHeight: '20px' }}>
                {user?.name || "Admin"}
              </Text>
              <Text type="secondary" style={{ fontSize: 12, lineHeight: '16px' }}>
                {user?.role || "Administrator"}
              </Text>
            </div>
            <DownOutlined style={{ fontSize: 12, display: window.innerWidth >= 1024 ? 'block' : 'none' }} />
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;
