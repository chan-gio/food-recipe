import React from "react";
import { Modal, Button, Form, Input, Avatar, Space } from "antd";
import "./AdminUserModal.module.scss";

const AdminUserModal = ({ visible, onClose, onSave, user, form }) => {
  if (!user) return null;

  return (
    <Modal
      title="View/Edit User"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          Save
        </Button>,
      ]}
      className="admin-user-modal"
    >
      <div className="modal-content">
        <div className="user-header">
          <Avatar
            size={64}
            src={
              user.profile_picture ||
              "https://randomuser.me/api/portraits/men/1.jpg"
            }
            className="user-avatar"
          />
          <h2 className="user-name">{user.full_name || "Unknown User"}</h2>
        </div>
        <Form form={form} layout="vertical" className="user-form">
          <Form.Item
            label="Username"
            name="signin_account"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: "Please input the full name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AdminUserModal;
