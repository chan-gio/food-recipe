import React from "react";
import { Layout, Menu, Input } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.svg";
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./Header.module.scss";

const { Header } = Layout;
const { Search } = Input;

const CustomHeader = () => {
  const onSearch = (value) => {
    console.log("Search:", value);
  };

  return (
    <Header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </Link>
      </div>

      <Menu theme="dark" mode="horizontal" className={styles.menu}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
        <Menu.Item
          key="search"
          disabled
          style={{ display: "flex", alignItems: "center" }}
          className={styles.searchItem}
        >
          <Search
            style={{ display: "flex" }}
            placeholder="Search recipes..."
            onSearch={onSearch}
            allowClear
            className={styles.searchInput}
            prefix={<SearchOutlined />}
          />
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default CustomHeader;
