import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../utils/auth"; // Điều chỉnh đường dẫn nếu cần
import AdminHeader from "../AdminHeader/AdminHeader";
import AdminPage from "../../Pages/Admin/AdminPage";

const AdminLayout = ({ children }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Nếu đang tải, hiển thị loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Nếu không đăng nhập hoặc không phải admin, chuyển hướng về trang chính
  if (!isAuthenticated || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <AdminHeader />
      <AdminPage>{children}</AdminPage>
    </div>
  );
};

export default AdminLayout;
