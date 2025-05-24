import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Space, Image } from "antd";
import { categoryService } from "../../services/categoryService"; // Adjust the import path as needed
import "./CategoriesManagement.module.scss";

const { Search } = Input;

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch categories on component mount or when pagination/search changes
  const fetchCategories = async (page = 1, pageSize = 10, searchQuery = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
      };
      let response;
      if (searchQuery) {
        response = await categoryService.getCategoriesByName(
          searchQuery,
          params
        );
      } else {
        response = await categoryService.getCategories(params);
      }
      setCategories(response.data);
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
    fetchCategories();
  }, []);

  // Handle pagination change
  const handleTableChange = (pagination) => {
    fetchCategories(pagination.current, pagination.pageSize);
  };

  // Handle search
  const handleSearch = (value) => {
    fetchCategories(1, pagination.pageSize, value);
  };

  // Handle delete category
  const handleDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      message.success("Category deleted successfully");
      fetchCategories(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <Space>
          {images && images.length > 0 ? (
            images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Category image ${index + 1}`}
                width={50}
                height={50}
                style={{ objectFit: "cover" }}
              />
            ))
          ) : (
            <span>No images</span>
          )}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className="action-buttons">
          <Button
            className="delete-button"
            onClick={() => handleDelete(record.category_id)}
          >
            DELETE
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="categories-management">
      <div className="header">
        <h2>Admin Categories</h2>
        <Search
          placeholder="Search categories by name"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="category_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default CategoriesManagement;
