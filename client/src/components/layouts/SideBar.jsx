import { Link, useLocation } from 'react-router-dom';
import { Menu, Badge, Layout } from 'antd';
import {
  DashboardOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  FolderOutlined,
  TagsOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  PercentageOutlined,
  CarOutlined,
  CreditCardOutlined,
  UserOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';

const { Sider } = Layout;

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const unreadChatCount = useChatNotifications(user);

  // Menu items configuration
  const menuItems = [
    {
      key: 'main',
      label: 'MAIN',
      type: 'group',
      children: [
        {
          key: '/admin-dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/admin-dashboard">Dashboard</Link>,
        },
        {
          key: '/admin-analytics',
          icon: <LineChartOutlined />,
          label: (
            <Link to="/admin-analytics">
              Analytics
              <Badge count="New" style={{ marginLeft: 8, fontSize: 10 }} />
            </Link>
          ),
        },
      ],
    },
    {
      key: 'catalog',
      label: 'CATALOG',
      type: 'group',
      children: [
        {
          key: '/admin-products',
          icon: <AppstoreOutlined />,
          label: <Link to="/admin-products">Products</Link>,
        },
        {
          key: '/admin-categories',
          icon: <FolderOutlined />,
          label: <Link to="/admin-categories">Categories</Link>,
        },
        {
          key: '/admin-brands',
          icon: <TagsOutlined />,
          label: <Link to="/admin-brands">Brands</Link>,
        },
        {
          key: '/admin-banners',
          icon: <PictureOutlined />,
          label: <Link to="/admin-banners">Banners</Link>,
        },
      ],
    },
    {
      key: 'sales',
      label: 'SALES',
      type: 'group',
      children: [
        {
          key: '/admin-orders',
          icon: <ShoppingCartOutlined />,
          label: (
            <Link to="/admin-orders">
              Orders
              <Badge count={12} style={{ marginLeft: 8 }} />
            </Link>
          ),
        },
        {
          key: '/admin-discounts',
          icon: <PercentageOutlined />,
          label: <Link to="/admin-discounts">Discounts</Link>,
        },
        {
          key: '/admin-shipping',
          icon: <CarOutlined />,
          label: <Link to="/admin-shipping">Shipping</Link>,
        },
        {
          key: '/admin-payments',
          icon: <CreditCardOutlined />,
          label: <Link to="/admin-payments">Payments</Link>,
        },
      ],
    },
    {
      key: 'management',
      label: 'MANAGEMENT',
      type: 'group',
      children: [
        {
          key: '/admin-users',
          icon: <UserOutlined />,
          label: <Link to="/admin-users">Users</Link>,
        },
        {
          key: '/admin-chat',
          icon: <MessageOutlined />,
          label: (
            <Link to="/admin-chat">
              Chat Support
              {unreadChatCount > 0 && (
                <Badge count={unreadChatCount} style={{ marginLeft: 8 }} />
              )}
            </Link>
          ),
        },
        {
          key: '/admin-reports',
          icon: <FileTextOutlined />,
          label: <Link to="/admin-reports">Reports</Link>,
        },
      ],
    },
    {
      key: 'system',
      label: 'SYSTEM',
      type: 'group',
      children: [
        {
          key: '/admin-settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin-settings">Settings</Link>,
        },
      ],
    },
  ];

  // Get selected key from current path
  const selectedKey = location.pathname;

  return (
    <Sider
      collapsed={!isOpen}
      collapsedWidth={80}
      width={256}
      breakpoint="md"
      style={{
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        zIndex: 20,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
      }}
      className="admin-sidebar"
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={['main', 'catalog', 'sales', 'management', 'system']}
        style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
        items={menuItems}
        inlineCollapsed={!isOpen}
      />
    </Sider>
  );
};

export default AdminSidebar;