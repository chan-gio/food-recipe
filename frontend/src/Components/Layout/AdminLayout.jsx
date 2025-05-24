import React from "react";
import AdminHeader from "../../Components/AdminHeader/AdminHeader"; // Reuse the AdminHeader we created
import AdminPage from "../../Pages/Admin/AdminPage"; // Adjust the path as needed

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminHeader />
      <AdminPage>{children}</AdminPage>
    </div>
  );
};

export default AdminLayout;
