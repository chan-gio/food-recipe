import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./AdminPage.module.scss";

const AdminPage = () => {
  return (
    <div className={styles.adminPage}>
      <div className={styles.sidebar}>
        <h2>Management</h2>
        <nav>
          <NavLink
            to="/admin/recipes"
            className={({ isActive }) =>
              `${styles.navButton} ${isActive ? styles.active : ""}`
            }
          >
            Recipes Mangement
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${styles.navButton} ${isActive ? styles.active : ""}`
            }
          >
            Users Mangement
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `${styles.navButton} ${isActive ? styles.active : ""}`
            }
          >
            Categories Management
          </NavLink>
        </nav>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
