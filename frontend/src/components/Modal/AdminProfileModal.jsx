import React from "react";
import { Modal, Button, Form, Input, Avatar } from "antd";
import styles from "./AdminProfileModal.module.scss";

const AdminProfileModal = ({ visible, onClose, user, form }) => {
  if (!user) return null;

  return (
    <Modal
      title="Admin Profile"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      className={styles.adminProfileModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.userHeader}>
          <Avatar
            size={64}
            src={user.profile_picture || null}
            className={styles.userAvatar}
          />
          <h2 className={styles.userName}>
            {user.full_name || "Unknown Admin"}
          </h2>
        </div>
        <Form form={form} layout="vertical" className={styles.userForm}>
          <Form.Item label="Username" name="signin_account">
            <Input disabled value={user.signin_account || ""} />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled value={user.email || ""} />
          </Form.Item>
          <Form.Item label="Full Name" name="full_name">
            <Input disabled value={user.full_name || ""} />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Input disabled value={user.role || ""} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AdminProfileModal;
