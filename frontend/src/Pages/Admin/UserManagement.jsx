import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Space, Form } from "antd";
import { userService } from "../../services/userService"; // Adjust the import path as needed
import AdminUserModal from "../../components/Modal/AdminUserModal"; // Import the new modal component
import "./UserManagement.module.scss"; // Update to .scss to match naming convention

const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch users on component mount or when pagination/search changes
  const fetchUsers = async (page = 1, pageSize = 10, searchQuery = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
      };
      if (searchQuery) {
        params.signin_account = searchQuery;
      }
      const response = await userService.getUsers(params);
      setUsers(response.data);
      setPagination({
        current: response.meta.page,
        pageSize: response.meta.limit,
        total: response.meta.total,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  // Handle search
  const handleSearch = (value) => {
    fetchUsers(1, pagination.pageSize, value);
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      signin_account: user.signin_account,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const userData = {
        signin_account: values.signin_account,
        email: values.email,
        full_name: values.full_name,
        role: values.role,
      };
      await userService.updateUser(selectedUser.user_id, userData);
      message.success("User updated successfully");
      handleModalClose();
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || "Failed to update user");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Username",
      dataIndex: "signin_account",
      key: "signin_account",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className="action-buttons">
          <Button className="view-button" onClick={() => handleEdit(record)}>
            VIEW/EDIT
          </Button>
          <Button
            className="delete-button"
            onClick={() => handleDelete(record.user_id)}
          >
            DELETE
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div className="header">
        <h2>Admin Users</h2>
        <Search
          placeholder="Search users by username"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="user_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
      <AdminUserModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSave={handleSave}
        user={selectedUser}
        form={form}
      />
    </div>
  );
};

export default UserManagement;
