import React, { useState, useEffect } from "react";
import styles from "./CategoriesManagement.module.scss";
import { Button, Card, Pagination, Input, Form } from "antd";
import { categoryService } from "../../services/categoryService"; // Adjust path as needed

const CategoriesManagement = ({ limit = 5 }) => {
  const [categories, setCategories] = useState([]);
  const [categoryMeta, setCategoryMeta] = useState(null);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Fetch all categories when component mounts or categoryPage/limit changes
  useEffect(() => {
    console.log(
      "useEffect triggered with categoryPage:",
      categoryPage,
      "limit:",
      limit
    );

    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await categoryService.getCategories({
          page: categoryPage,
          limit,
        });
        console.log("Fetched categories response:", response);
        const fetchedCategories = response.data || [];
        console.log("Setting categories:", fetchedCategories);
        setCategories(fetchedCategories);
        setCategoryMeta(response.meta || null);
        setError("");
      } catch (err) {
        console.error("Error fetching categories:", err.message);
        setError(err.message || "Failed to fetch categories");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [categoryPage, limit]);

  // Handle category deletion
  const handleDeleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      const response = await categoryService.getCategories({
        page: categoryPage,
        limit,
      });
      console.log("Post-deletion categories response:", response);
      setCategories(response.data || []);
      setCategoryMeta(response.meta || null);
      setError("");
    } catch (err) {
      console.error("Error deleting category:", err.message);
      setError(err.message || "Failed to delete category");
    }
  };

  // Handle form submission for editing a category
  const handleFormSubmit = async (values) => {
    try {
      if (isEditing && editingCategory) {
        // Send category_name instead of name
        await categoryService.updateCategory(editingCategory.category_id, {
          category_name: values.category_name,
        });
        const response = await categoryService.getCategories({
          page: categoryPage,
          limit,
        });
        console.log("Post-update categories response:", response);
        setCategories(response.data || []);
        setCategoryMeta(response.meta || null);
        setError("");
        setIsEditing(false);
        setEditingCategory(null);
        form.resetFields();
      }
    } catch (err) {
      console.error("Error updating category:", err.message);
      setError(err.message || "Failed to update category");
    }
  };

  // Handle edit button click
  const handleEditCategory = (category) => {
    console.log("Editing category:", category);
    setIsEditing(true);
    setEditingCategory(category);
    form.setFieldsValue({
      category_name: category.category_name || "",
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
    form.resetFields();
  };

  console.log("Rendering CategoriesManagement, categories:", categories);

  return (
    <div className={styles.categoriesManagement}>
      <h2>Manage Categories</h2>
      {error && <p className={styles.error}>{error}</p>}

      {/* Edit form (only shown when editing) */}
      {isEditing && (
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
          className={styles.editForm}
        >
          <Form.Item
            name="category_name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
            >
              Update Category
            </Button>
            <Button onClick={handleCancelEdit} className={styles.cancelButton}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}

      {/* Category list */}
      {categoriesLoading ? (
        <p>Loading...</p>
      ) : !categories ||
        !Array.isArray(categories) ||
        categories.length === 0 ? (
        <p>No categories available</p>
      ) : (
        <div className={styles.categoryList}>
          {categories.map((category) => {
            console.log("Rendering category:", category);
            return (
              <Card key={category.category_id} className={styles.categoryCard}>
                <div className={styles.categoryContent}>
                  <h3>{category.category_name || "Unnamed Category"}</h3>
                </div>
                <div className={styles.categoryActions}>
                  <Button
                    onClick={() => handleEditCategory(category)}
                    className={styles.editButton}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {categoryMeta && categories && categories.length > 0 && (
        <Pagination
          current={categoryPage}
          pageSize={limit}
          total={categoryMeta.total}
          onChange={setCategoryPage}
          className={styles.pagination}
        />
      )}
    </div>
  );
};

export default CategoriesManagement;
