import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Image, ShoppingCart, CreditCard, Users, MapPin, Percent, Zap, MessageSquare, BarChart2, Settings, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';
import { NavItem, SubNavItem, NavGroup, SectionLabel } from './SidebarComponents';

const AdminSidebar = ({ isOpen }) => {
  const { pathname } = useLocation();
  const { user, hasPermission } = useAuth();
  const unreadChatCount = useChatNotifications(user);
  const [openGroups, setOpenGroups] = useState({ catalogue: true, sales: true, customers: true, marketing: false });
  const toggleGroup = (key) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  const shared = { isOpen, pathname };

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden transition-all duration-300 bg-[#0f172a] border-r border-slate-800 shadow-2xl font-inter ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex h-16 items-center border-b border-slate-800 px-4">
        <Link to="/admin-dashboard" className="flex items-center gap-3 w-full" title={!isOpen ? 'Admin Panel' : undefined}>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white flex-shrink-0"><Package size={16} /></div>
          {isOpen && (
            <div className="min-w-0">
              <p className="m-0 text-slate-50 text-2xl font-bold leading-5">ShopAdmin</p>
              <p className="m-0 text-slate-400 text-xs leading-5">Quản trị hệ thống</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="dark-scrollbar flex-1 overflow-y-auto py-3">
        <NavItem to="/admin-dashboard" icon={LayoutDashboard} label="Dashboard" {...shared} />

        {(hasPermission('product.manage') || hasPermission('category.manage')) && (
          <>
            <SectionLabel label="Catalogue" isOpen={isOpen} />
            <NavGroup groupKey="catalogue" icon={Package} label="Catalogue" paths={['/admin-products', '/admin-categories', '/admin-banners']} expanded={openGroups.catalogue} onToggle={toggleGroup} {...shared}>
              {hasPermission('product.manage') && (
                <>
                  <SubNavItem to="/admin-products" icon={Package} label="Sản phẩm" pathname={pathname} />
                  <SubNavItem to="/admin-products/create" icon={PlusCircle} label="Thêm sản phẩm" pathname={pathname} />
                </>
              )}
              {hasPermission('category.manage') && <SubNavItem to="/admin-categories" icon={Tag} label="Danh mục" pathname={pathname} />}
              {hasPermission('banner.manage') && <SubNavItem to="/admin-banners" icon={Image} label="Banner" pathname={pathname} />}
            </NavGroup>
          </>
        )}

        {hasPermission('order.view') && (
          <>
            <SectionLabel label="Bán hàng" isOpen={isOpen} />
            <NavGroup groupKey="sales" icon={ShoppingCart} label="Đơn hàng" paths={['/admin-orders']} expanded={openGroups.sales} onToggle={toggleGroup} {...shared}>
              <SubNavItem to="/admin-orders" icon={ShoppingCart} label="Tất cả đơn hàng" pathname={pathname} />
            </NavGroup>
          </>
        )}

        {(hasPermission('user.view') || hasPermission('user.manage')) && (
          <NavGroup groupKey="customers" icon={Users} label="Khách hàng" paths={['/admin-users', '/admin-addresses']} expanded={openGroups.customers} onToggle={toggleGroup} {...shared}>
            <SubNavItem to="/admin-users" icon={Users} label="Khách hàng" pathname={pathname} />
            <SubNavItem to="/admin-addresses" icon={MapPin} label="Địa chỉ" pathname={pathname} />
          </NavGroup>
        )}
        
        {hasPermission('report.view') && <NavItem to="/admin-payments" icon={CreditCard} label="Thanh toán" {...shared} />}

        {hasPermission('discount.manage') && (
          <>
            <SectionLabel label="Marketing" isOpen={isOpen} />
            <NavGroup groupKey="marketing" icon={Percent} label="Khuyến mãi" paths={['/admin-discounts', '/admin-flash-sales']} expanded={openGroups.marketing} onToggle={toggleGroup} {...shared}>
              <SubNavItem to="/admin-discounts" icon={Percent} label="Mã giảm giá" pathname={pathname} />
              <SubNavItem to="/admin-flash-sales" icon={Zap} label="Flash Sale" pathname={pathname} />
            </NavGroup>
          </>
        )}

        {(hasPermission('report.view') || hasPermission('chat.support')) && (
          <>
            <SectionLabel label="Vận hành" isOpen={isOpen} />
            {hasPermission('report.view') && <NavItem to="/admin-reports" icon={BarChart2} label="Báo cáo" {...shared} />}
            {hasPermission('chat.support') && <NavItem to="/admin-chat" icon={MessageSquare} label="Chat hỗ trợ" badge={unreadChatCount} {...shared} />}
          </>
        )}

        <SectionLabel label="Hệ thống" isOpen={isOpen} />
        {hasPermission('user.manage') && <NavItem to="/admin-role-permissions" icon={ShieldCheck} label="Phân quyền" {...shared} />}
        <NavItem to="/admin/profile" icon={Settings} label="Tài khoản" {...shared} />
      </nav>

      {user && (
        <div className="border-t border-slate-800 p-3 italic">
          <Link to="/admin/profile" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            {isOpen && (
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-50 truncate m-0">{user.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-400 truncate m-0">{user.email}</p>
              </div>
            )}
          </Link>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
