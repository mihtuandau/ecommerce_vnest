import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './SideBar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, showSidebar = false }) => {
  const { user } = useAuth(); 
  const isAdmin = user?.role === 'ADMIN';

  // Admin Layout
  if (showSidebar && isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 px-3 py-4 md:px-4 md:py-5">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    );
  }

  // Customer Layout
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-[60px]">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;