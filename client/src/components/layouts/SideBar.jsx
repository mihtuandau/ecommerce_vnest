import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Folder,
  Tag,
  Percent,
  Settings,
  ChevronRight,
  TrendingUp,
  FileText,
  Truck,
  CreditCard,
  MessageSquare,
  Image,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { useChatNotifications } from '../../hooks/useChatNotifications';

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const unreadChatCount = useChatNotifications(user);

  const menuGroups = [
    {
      label: 'Main',
      items: [
        {
          path: '/admin-dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard',
          badge: null,
        },
        {
          path: '/admin-analytics',
          icon: TrendingUp,
          label: 'Analytics',
          badge: 'New',
        },
      ],
    },
    {
      label: 'Catalog',
      items: [
        {
          path: '/admin-products',
          icon: Package,
          label: 'Products',
          badge: null,
        },
        {
          path: '/admin-categories',
          icon: Folder,
          label: 'Categories',
          badge: null,
        },
        {
          path: '/admin-brands',
          icon: Tag,
          label: 'Brands',
          badge: null,
        },
        {
          path: '/admin-banners',
          icon: Image,
          label: 'Banners',
          badge: null,
        },
      ],
    },
    {
      label: 'Sales',
      items: [
        {
          path: '/admin-orders',
          icon: ShoppingCart,
          label: 'Orders',
          badge: '12',
        },
        {
          path: '/admin-discounts',
          icon: Percent,
          label: 'Discounts',
          badge: null,
        },
        {
          path: '/admin-shipping',
          icon: Truck,
          label: 'Shipping',
          badge: null,
        },
        {
          path : '/admin-payments',
          icon: CreditCard,
          label: 'Payments',
          badge: null,
        }
      ],
    },
    {
      label: 'Management',
      items: [
        {
          path: '/admin-users',
          icon: Users,
          label: 'Users',
          badge: null,
        },
        {
          path: '/admin-chat',
          icon: MessageSquare,
          label: 'Chat Support',
          badge: unreadChatCount > 0 ? unreadChatCount : null,
        },
        {
          path: '/admin-reports',
          icon: FileText,
          label: 'Reports',
          badge: null,
        },
      ],
    },
    {
      label: 'System',
      items: [
        {
          path: '/admin-settings',
          icon: Settings,
          label: 'Settings',
          badge: null,
        },
      ],
    },
  ];

  const isActive = (path) => {
    if (path === '/admin-dashboard') {
      return location.pathname === '/admin-dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200',
          'transition-all duration-300 z-20',
          isOpen ? 'w-64' : 'w-0 md:w-20'
        )}
      >
        <nav className="h-full overflow-y-auto py-4">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {/* Group Label */}
              {isOpen && (
                <div className="px-6 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
              )}

              {/* Menu Items */}
              <ul className="space-y-1 px-3">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
                          'hover:scale-[1.02]',
                          active
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        <Icon
                          size={20}
                          className={clsx(
                            'flex-shrink-0 transition-transform',
                            active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700',
                            'group-hover:scale-110'
                          )}
                        />

                        {isOpen && (
                          <>
                            <span className="font-medium flex-1">{item.label}</span>

                            {/* Badge */}
                            {item.badge && (
                              <span
                                className={clsx(
                                  'px-2 py-0.5 text-xs font-semibold rounded-full',
                                  item.badge === 'New'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}

                            {/* Active Indicator */}
                            {active && (
                              <ChevronRight size={16} className="text-blue-600" />
                            )}
                          </>
                        )}

                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {item.label}
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10 md:hidden"
          onClick={() => {}}
        />
      )}
    </>
  );
};

export default AdminSidebar;