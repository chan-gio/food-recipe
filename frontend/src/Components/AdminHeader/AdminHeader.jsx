import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import logo from "../../assets/image/logo.svg";
import styles from "./AdminHeader.module.scss";

const AdminHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </Link>
      </div>

      <Menu theme="dark" mode="horizontal" className={styles.menu}>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      </Menu>
    </header>
  );
};

export default AdminHeader;
