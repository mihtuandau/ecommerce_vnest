import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loading from "../components/common/Loading";
import { getRouteTitle } from "./config/routeConfig";
import { authRoutes } from "./sections/AuthRoutes";
import { customerRoutes } from "./sections/CustomerRoutes";
import { adminRoutes } from "./sections/AdminRoutes";

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    document.title = getRouteTitle(pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <Suspense fallback={<Loading fullScreen text="Đang tải..." variant={isAdmin ? "admin" : "user"} />}>
      <Routes>
        {authRoutes}
        {customerRoutes}
        {adminRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
