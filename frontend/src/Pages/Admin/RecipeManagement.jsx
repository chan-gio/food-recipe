import React, { useState, useEffect } from "react";
import { Table, Button, Input, Space } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { recipeService } from "../../services/recipeService";
import AdminRecipeModal from "../../components/Modal/AdminRecipeModal";
import { toastSuccess, toastError } from "../../utils/toastNotifier"; // Adjusted import path
import "./RecipeManagement.module.scss";

const { Search } = Input;

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchQuery = "") => {
    setLoading(true);
    try {
      if (searchQuery) {
        const response = await recipeService.searchRecipesByName(searchQuery);
        setRecipes(response.data);
      } else {
        const response = await recipeService.getRecipes();
        setRecipes(response.data);
      }
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    fetchRecipes(value);
  };

  // Handle delete recipe
  const handleDelete = async (recipeId) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      toastSuccess("Recipe deleted successfully");
      fetchRecipes();
    } catch (error) {
      toastError(error.message);
    }
  };

  // Handle view recipe
  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  // Handle manage reviews
  const handleManageReviews = (recipeId) => {
    navigate(`/admin/reviews/${recipeId}`); // Navigate to ReviewManagement page
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  // Define table columns
  const columns = [
    {
      title: "Recipe Name",
      dataIndex: "recipe_name",
      key: "recipe_name",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        new Date(text).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) =>
        categories.length > 0
          ? categories.map((cat) => cat.category_name).join(", ")
          : "None",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className="action-buttons">
          <Button className="view-button" onClick={() => handleView(record)}>
            VIEW
          </Button>
          <Button
            className="delete-button"
            onClick={() => handleDelete(record.recipe_id)}
          >
            DELETE
          </Button>
          <Button
            className="reviews-button"
            onClick={() => handleManageReviews(record.recipe_id)}
          >
            MANAGE REVIEWS
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="recipe-management">
      <div className="header">
        <h2>Admin Recipes</h2>
        <Search
          placeholder="Search recipes by name"
          onSearch={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        dataSource={recipes}
        columns={columns}
        rowKey="recipe_id"
        loading={loading}
        pagination={false}
      />
      <AdminRecipeModal
        visible={isModalVisible}
        onClose={handleModalClose}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default RecipeManagement;
