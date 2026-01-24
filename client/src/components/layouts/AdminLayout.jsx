import { useState, useEffect, memo } from 'react';
import AdminHeader from '../admin/Header';
import AdminSidebar from '../../components/layouts/SideBar';

const AdminLayout = memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  

  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <AdminSidebar isOpen={sidebarOpen} />

      <main
        className={`
          pt-16 transition-all duration-300 min-h-screen
          ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}
        `}
      >
        <div className="p-4 md:p-6 lg:p-8 animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;