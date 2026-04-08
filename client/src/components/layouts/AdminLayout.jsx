import { useState, useEffect, memo } from 'react';
import AdminHeader from '../admin/Header';
import AdminSidebar from '../../components/layouts/SideBar';

const AdminLayout = memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const onToggleSidebar = () => {
      setSidebarOpen((prev) => !prev);
    };

    window.addEventListener('admin:toggle-sidebar', onToggleSidebar);
    return () => {
      window.removeEventListener('admin:toggle-sidebar', onToggleSidebar);
    };
  }, []);

  

  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <AdminSidebar isOpen={sidebarOpen} />

      <main
        className={`
          min-h-screen pt-16 transition-all duration-300
          ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}
        `}
      >
        <div className="mx-auto w-full max-w-[1440px] animate-fadeIn px-2 py-2.5 md:px-3 md:py-3.5 lg:px-4 lg:py-4.5">
          {children}
        </div>
      </main>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;