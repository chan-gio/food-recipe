import React, { useState, useEffect } from "react";
import styles from "./AdminPage.module.scss";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Giả lập lấy dữ liệu người dùng từ API
    const fetchUsers = async () => {
      const mockUsers = [
        { id: 1, username: "user1", email: "user1@example.com", role: "user" },
        {
          id: 2,
          username: "admin1",
          email: "admin1@example.com",
          role: "admin",
        },
      ];
      setUsers(mockUsers);
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    if (formData.username && formData.email) {
      const newUser = {
        id: users.length + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };
      setUsers([...users, newUser]);
      resetForm();
    }
  };

  const handleEditUser = (user) => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
    resetForm();
    setIsEditing(false);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const resetForm = () => {
    setFormData({ id: null, username: "", email: "", role: "user" });
  };

  return (
    <div>
      <div className={styles.form}>
        <h2>{isEditing ? "Sửa Người dùng" : "Thêm Người dùng"}</h2>
        <input
          type="text"
          name="username"
          placeholder="Tên người dùng"
          value={formData.username}
          onChange={handleInputChange}
          className={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className={styles.input}
        >
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
        <button
          onClick={isEditing ? handleUpdateUser : handleAddUser}
          className={styles.submitButton}
        >
          {isEditing ? "Cập nhật" : "Thêm"}
        </button>
        {isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsEditing(false);
            }}
            className={styles.cancelButton}
          >
            Hủy
          </button>
        )}
      </div>

      <div className={styles.recipeList}>
        <h2>Danh sách Người dùng</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </td>
                <td>
                  <button
                    onClick={() => handleEditUser(user)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
