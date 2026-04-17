import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './SideBar';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, showSidebar = false }) => {
  const { user } = useAuth(); 
  const isAdmin = user?.role === 'ADMIN';

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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#000000',
          colorLink: '#000000',
          colorLinkHover: '#404040',
          borderRadius: 0,
        },
        components: {
          Button: {
            borderRadius: 0,
            colorPrimary: '#000000',
            colorPrimaryHover: '#404040',
            colorPrimaryActive: '#000000',
            colorTextLightSolid: '#ffffff', 
          },
          Steps: {
            colorPrimary: '#000000',
          },
          Checkbox: {
            colorPrimary: '#000000',
          },
          Radio: {
            colorPrimary: '#000000',
          }
        }
      }}
    >
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-[120px] md:pt-[167px]">
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
};



export default Layout;





