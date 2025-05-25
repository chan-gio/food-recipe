import React, { useState } from "react";
import { Menu, Form } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logo from "../../assets/image/logo.svg";
import AdminProfileModal from "../Modal/AdminProfileModal"; // Adjust the import path as needed
import styles from "./AdminHeader.module.scss";

const AdminHeader = () => {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Simulated admin user data (replace with actual user data from auth context or API)
  const adminUser = {
    user_id: 1,
    signin_account: "admin_user",
    email: "admin@example.com",
    full_name: "Admin User",
    profile_picture: null,
    role: "admin",
  };

  const handleProfileClick = () => {
    // Set form values when opening the modal
    form.setFieldsValue({
      signin_account: adminUser.signin_account,
      email: adminUser.email,
      full_name: adminUser.full_name,
      role: adminUser.role,
    });
    setIsProfileModalVisible(true);
  };

  const handleProfileModalClose = () => {
    setIsProfileModalVisible(false);
    form.resetFields();
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logoImage} />
      </div>

      <Menu theme="dark" mode="horizontal" className={styles.menu}>
        <Menu.Item key="2" icon={<UserOutlined />} onClick={handleProfileClick}>
          Profile
        </Menu.Item>
      </Menu>

      <AdminProfileModal
        visible={isProfileModalVisible}
        onClose={handleProfileModalClose}
        user={adminUser}
        form={form}
      />
    </header>
  );
};

export default AdminHeader;
