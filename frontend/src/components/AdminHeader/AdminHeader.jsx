import React from "react";
import { Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../../assets/image/logo.svg";
import styles from "./AdminHeader.module.scss";
import useAuth from "../../utils/auth"; // Adjust path based on your project structure

const AdminHeader = () => {
  const { logout } = useAuth(); // Assuming useAuth provides a logout function

  const handleLogout = () => {
    logout(); // Call the logout function to clear auth state
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" className={styles.logoImage} />
      </div>

      <Menu theme="dark" mode="horizontal" className={styles.menu}>
        <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </header>
  );
};

export default AdminHeader;
