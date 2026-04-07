import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  Image,
  ShoppingCart,
  CreditCard,
  Users,
  Percent,
  MessageSquare,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';

// ── Helpers ───────────────────────────────────────────────────────────────────
const checkActive = (pathname, path) => pathname === path;
const checkGroupActive = (pathname, paths) => paths.some(p => pathname.startsWith(p));

// ── Atomic nav link ───────────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, badge, isOpen, pathname }) => {
  const active = checkActive(pathname, to);
  const activeStyle = { backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 600 };
  const inactiveStyle = { color: '#4b5563' };

  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mx-2 relative hover:bg-gray-100"
      style={active ? activeStyle : inactiveStyle}
      title={!isOpen ? label : undefined}
    >
      <Icon size={18} style={{ color: 'inherit', flexShrink: 0 }} />
      {isOpen && (
        <>
          <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </span>
          {badge > 0 && (
            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
        </>
      )}
      {!isOpen && badge > 0 && (
        <span style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {badge}
        </span>
      )}
    </Link>
  );
};

// ── Sub nav link ─────────────────────────────────────────────────────────────
const SubNavItem = ({ to, icon: Icon, label, badge, pathname }) => {
  const active = pathname === to || pathname.startsWith(to + '/');
  const activeStyle = { color: '#2563eb', backgroundColor: '#eff6ff', fontWeight: 600 };
  const inactiveStyle = { color: '#6b7280' };

  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 mx-2 hover:bg-gray-100"
      style={active ? activeStyle : inactiveStyle}
    >
      <Icon size={15} style={{ color: 'inherit', flexShrink: 0 }} />
      <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: active ? 600 : 400 }}>
        {label}
      </span>
      {badge > 0 && (
        <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
};

// ── Collapsible group ─────────────────────────────────────────────────────────
const NavGroup = ({ groupKey, icon: Icon, label, children, isOpen, expanded, onToggle, pathname, paths = [] }) => {
  const active = checkGroupActive(pathname, paths);
  const btnStyle = {
    color: active ? '#2563eb' : '#374151',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: active ? 600 : 500,
  };

  return (
    <div>
      <button
        onClick={() => onToggle(groupKey)}
        className="w-[calc(100%-16px)] flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mx-2 hover:bg-gray-100"
        style={btnStyle}
        title={!isOpen ? label : undefined}
      >
        <Icon size={18} style={{ color: 'inherit', flexShrink: 0 }} />
        {isOpen && (
          <>
            <span style={{ fontSize: 13.5, fontWeight: 'inherit', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </span>
            {expanded
              ? <ChevronDown size={14} style={{ color: '#9ca3af' }} />
              : <ChevronRight size={14} style={{ color: '#9ca3af' }} />
            }
          </>
        )}
      </button>
      {isOpen && expanded && (
        <div style={{ marginTop: 2, marginLeft: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ label, isOpen }) =>
  isOpen ? (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9ca3af', padding: '20px 16px 6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {label}
    </p>
  ) : null;

// ── Sidebar ───────────────────────────────────────────────────────────────────
const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const unreadChatCount = useChatNotifications(user);
  const pathname = location.pathname;

  const [openGroups, setOpenGroups] = useState({
    catalogue: true,
    sales: true,
    marketing: false,
  });

  const toggleGroup = (key) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const sharedProps = { isOpen, pathname };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-20 flex flex-col overflow-hidden transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}`}
      style={{
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '4px 0 12px rgba(0,0,0,0.05)',
        color: '#374151',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <nav className="flex-1 overflow-y-auto py-3" style={{ color: 'inherit' }}>

        {/* Dashboard */}
        <div className="mb-1">
          <NavItem to="/admin-dashboard" icon={LayoutDashboard} label="Dashboard" {...sharedProps} />
        </div>

        {/* CATALOGUE */}
        <SectionLabel label="Catalogue" isOpen={isOpen} />
        <NavGroup
          groupKey="catalogue"
          icon={Package}
          label="Catalogue"
          paths={['/admin-products', '/admin-categories', '/admin-banners']}
          expanded={openGroups.catalogue}
          onToggle={toggleGroup}
          {...sharedProps}
        >
          <SubNavItem to="/admin-products" icon={Package} label="Sản phẩm" pathname={pathname} />
          <SubNavItem to="/admin-products/create" icon={PlusCircle} label="Thêm sản phẩm" pathname={pathname} />
          <SubNavItem to="/admin-categories" icon={Tag} label="Danh mục" pathname={pathname} />
          <SubNavItem to="/admin-banners" icon={Image} label="Banner" pathname={pathname} />
        </NavGroup>

        {/* BÁN HÀNG */}
        <SectionLabel label="Bán hàng" isOpen={isOpen} />
        <NavGroup
          groupKey="sales"
          icon={ShoppingCart}
          label="Đơn hàng"
          paths={['/admin-orders']}
          expanded={openGroups.sales}
          onToggle={toggleGroup}
          {...sharedProps}
        >
          <SubNavItem to="/admin-orders" icon={ShoppingCart} label="Tất cả đơn hàng" pathname={pathname} />
        </NavGroup>

        <NavItem to="/admin-users" icon={Users} label="Khách hàng" {...sharedProps} />
        <NavItem to="/admin-payments" icon={CreditCard} label="Thanh toán" {...sharedProps} />

        {/* MARKETING */}
        <SectionLabel label="Marketing" isOpen={isOpen} />
        <NavGroup
          groupKey="marketing"
          icon={Percent}
          label="Khuyến mãi"
          paths={['/admin-discounts']}
          expanded={openGroups.marketing}
          onToggle={toggleGroup}
          {...sharedProps}
        >
          <SubNavItem to="/admin-discounts" icon={Percent} label="Mã giảm giá" pathname={pathname} />
          <SubNavItem to="/admin-discounts/new" icon={PlusCircle} label="Tạo mã mới" pathname={pathname} />
        </NavGroup>

        {/* VẬN HÀNH */}
        <SectionLabel label="Vận hành" isOpen={isOpen} />
        <NavItem to="/admin-reports" icon={BarChart2} label="Báo cáo" {...sharedProps} />
        <NavItem to="/admin-chat" icon={MessageSquare} label="Chat hỗ trợ" badge={unreadChatCount} {...sharedProps} />

        {/* HỆ THỐNG */}
        <SectionLabel label="Hệ thống" isOpen={isOpen} />
        <NavItem to="/admin/profile" icon={Settings} label="Tài khoản" {...sharedProps} />

      </nav>

      {/* User footer */}
      {user && (
        <div style={{ borderTop: '1px solid #f3f4f6', padding: isOpen ? 16 : 12 }}>
          {isOpen ? (
            <Link to="/admin/profile" className="flex items-center gap-3" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'Admin'}
                </p>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            </Link>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/admin/profile" title={user.name || 'Admin'} style={{ textDecoration: 'none' }}>
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;