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
  MapPin,
  Percent,
  Zap,
  MessageSquare,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';

// ── Helpers ───────────────────────────────────────────────────────────────────
const checkActive = (pathname, path) => pathname === path;
const checkGroupActive = (pathname, paths) => paths.some(p => pathname.startsWith(p));

// ── Atomic nav link ───────────────────────────────────────────────────────────
const NavItem = ({ to, icon: Icon, label, badge, isOpen, pathname }) => {
  const active = checkActive(pathname, to);
  const activeStyle = { backgroundColor: '#1d4ed8', color: '#eff6ff', fontWeight: 600 };
  const inactiveStyle = { color: '#cbd5e1' };

  return (
    <Link
      to={to}
      className="relative mx-2 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-800"
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
  const activeStyle = { color: '#bfdbfe', backgroundColor: '#1e3a8a', fontWeight: 600 };
  const inactiveStyle = { color: '#94a3b8' };

  return (
    <Link
      to={to}
      className="mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-slate-800"
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
    color: active ? '#bfdbfe' : '#cbd5e1',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: active ? 600 : 500,
  };

  return (
    <div>
      <button
        onClick={() => onToggle(groupKey)}
        className="mx-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-800"
        style={btnStyle}
        title={!isOpen ? label : undefined}
      >
        <Icon size={18} style={{ color: 'inherit', flexShrink: 0 }} />
        {isOpen && (
          <>
            <span style={{ fontSize: 13.5, fontWeight: 'inherit', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </span>
            {expanded ? <ChevronDown size={14} style={{ color: '#64748b' }} /> : <ChevronRight size={14} style={{ color: '#64748b' }} />}
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
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', padding: '16px 16px 6px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {label}
    </p>
  ) : null;

// ── Sidebar ───────────────────────────────────────────────────────────────────
const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const unreadChatCount = useChatNotifications(user);
  const pathname = location.pathname;

  const [openGroups, setOpenGroups] = useState({
    catalogue: true,
    sales: true,
    customers: true,
    marketing: false,
  });

  const toggleGroup = (key) =>
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const sharedProps = { isOpen, pathname };

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col overflow-hidden transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}`}
      style={{
        backgroundColor: '#0f172a',
        borderRight: '1px solid #1e293b',
        boxShadow: '8px 0 24px rgba(2,6,23,0.3)',
        color: '#cbd5e1',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <Link
          to="/admin-dashboard"
          className="flex items-center gap-3"
          style={{ color: 'inherit', textDecoration: 'none', width: '100%' }}
          title={!isOpen ? 'Admin Panel' : undefined}
        >
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white">
            <Package size={16} />
          </div>
          {isOpen && (
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, color: '#f8fafc', fontSize: 24, fontWeight: 700, lineHeight: '22px' }}>ShopAdmin</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 16, lineHeight: '18px' }}>Quản trị hệ thống</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="dark-scrollbar flex-1 overflow-y-auto py-3" style={{ color: 'inherit' }}>

        {/* Dashboard */}
        <div className="mb-1">
          <NavItem to="/admin-dashboard" icon={LayoutDashboard} label="Dashboard" {...sharedProps} />
        </div>

        {/* CATALOGUE */}
        {(hasPermission('product.manage') || hasPermission('category.manage')) && (
          <>
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
              {hasPermission('product.manage') && (
                <>
                  <SubNavItem to="/admin-products" icon={Package} label="Sản phẩm" pathname={pathname} />
                  <SubNavItem to="/admin-products/create" icon={PlusCircle} label="Thêm sản phẩm" pathname={pathname} />
                </>
              )}
              {hasPermission('category.manage') && (
                <SubNavItem to="/admin-categories" icon={Tag} label="Danh mục" pathname={pathname} />
              )}
              {hasPermission('banner.manage') && (
                <SubNavItem to="/admin-banners" icon={Image} label="Banner" pathname={pathname} />
              )}
            </NavGroup>
          </>
        )}

        {/* BÁN HÀNG */}
        {hasPermission('order.view') && (
          <>
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
          </>
        )}

        {(hasPermission('user.view') || hasPermission('user.manage')) && (
          <NavGroup
            groupKey="customers"
            icon={Users}
            label="Khách hàng"
            paths={['/admin-users', '/admin-addresses']}
            expanded={openGroups.customers}
            onToggle={toggleGroup}
            {...sharedProps}
          >
            <SubNavItem to="/admin-users" icon={Users} label="Danh sách khách hàng" pathname={pathname} />
            <SubNavItem to="/admin-addresses" icon={MapPin} label="Địa chỉ" pathname={pathname} />
          </NavGroup>
        )}
        
        {hasPermission('report.view') && (
          <NavItem to="/admin-payments" icon={CreditCard} label="Thanh toán" {...sharedProps} />
        )}

        {/* MARKETING */}
        {hasPermission('discount.manage') && (
          <>
            <SectionLabel label="Marketing" isOpen={isOpen} />
            <NavGroup
              groupKey="marketing"
              icon={Percent}
              label="Khuyến mãi"
              paths={['/admin-discounts', '/admin-discounts/new', '/admin-discounts/new-flash-sale', '/admin-flash-sales']}
              expanded={openGroups.marketing}
              onToggle={toggleGroup}
              {...sharedProps}
            >
              <SubNavItem to="/admin-discounts" icon={Percent} label="Mã giảm giá" pathname={pathname} />
              <SubNavItem to="/admin-flash-sales" icon={Zap} label="Flash Sale" pathname={pathname} />
            </NavGroup>
          </>
        )}

        {/* VẬN HÀNH */}
        {(hasPermission('report.view') || hasPermission('chat.support')) && (
          <>
            <SectionLabel label="Vận hành" isOpen={isOpen} />
            {hasPermission('report.view') && (
              <NavItem to="/admin-reports" icon={BarChart2} label="Báo cáo" {...sharedProps} />
            )}
            {hasPermission('chat.support') && (
              <NavItem to="/admin-chat" icon={MessageSquare} label="Chat hỗ trợ" badge={unreadChatCount} {...sharedProps} />
            )}
          </>
        )}

        {/* HỆ THỐNG */}
        <SectionLabel label="Hệ thống" isOpen={isOpen} />
        {hasPermission('user.manage') && (
          <NavItem to="/admin-role-permissions" icon={ShieldCheck} label="Phân quyền vai trò" {...sharedProps} />
        )}
        <NavItem to="/admin/profile" icon={Settings} label="Tài khoản" {...sharedProps} />

      </nav>

      {/* User footer */}
      {user && (
        <div style={{ borderTop: '1px solid #1e293b', padding: isOpen ? 16 : 12 }}>
          {isOpen ? (
            <Link to="/admin/profile" className="flex items-center gap-3" style={{ color: 'inherit', textDecoration: 'none' }}>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f8fafc', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'Admin'}
                </p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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