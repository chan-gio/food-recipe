import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space, Skeleton } from "antd";
import { categoryService } from "../../services/categoryService";
import { toastSuccess, toastError } from "../../utils/toastNotifier";
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
      toastError(error.message || "Failed to fetch categories");
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
    fetchCategories(1, pagination.pageSize, value.trim());
  };

  // Handle delete category
  const handleDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      toastSuccess("Category deleted successfully");
      fetchCategories(pagination.current, pagination.pageSize);
    } catch (error) {
      toastError(error.message || "Failed to delete category");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
    },
    {
      title: "Recipe Count",
      dataIndex: "recipeCount",
      key: "recipeCount",
      render: (count) => count || 0,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className="action-buttons">
          <Button
            className="delete-button"
            onClick={() => handleDelete(record.category_id)}
            disabled={record.recipeCount === 0} // Disable if recipeCount is 0
          >
            DELETE
          </Button>
        </Space>
      ),
    },
  ];

  // Skeleton row for table
  const SkeletonRow = () => (
    <tr>
      <td>
        <Skeleton active paragraph={false} title={{ width: 50 }} />
      </td>
      <td>
        <Skeleton active paragraph={false} title={{ width: 150 }} />
      </td>
      <td>
        <Skeleton active paragraph={false} title={{ width: 100 }} />
      </td>
      <td>
        <Skeleton.Button active />
      </td>
    </tr>
  );

  // Skeleton table
  const SkeletonTable = () => (
    <table className="ant-table">
      <thead className="ant-table-thead">
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody className="ant-table-tbody">
        {Array.from({ length: pagination.pageSize }).map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </tbody>
    </table>
  );

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
      {loading ? (
        <SkeletonTable />
      ) : (
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="category_id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};

export default CategoriesManagement;
