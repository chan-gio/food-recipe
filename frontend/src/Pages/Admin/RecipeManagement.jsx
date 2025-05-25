import React, { useState, useEffect } from "react";
import { Table, Button, message, Input, Space } from "antd";
import { recipeService } from "../../services/recipeService"; // Adjust the import path as needed
import AdminRecipeModal from "../../components/Modal/AdminRecipeModal"; // Import the new modal component
import "./RecipeManagement.module.scss";

const { Search } = Input;

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
      message.error(error.message);
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
      message.success("Recipe deleted successfully");
      fetchRecipes(); // Refresh the table
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle view recipe
  const handleView = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecipe(null);
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "recipe_id",
      key: "recipe_id",
    },
    {
      title: "Recipe Name",
      dataIndex: "recipe_name",
      key: "recipe_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Recipe Type",
      dataIndex: "recipe_type",
      key: "recipe_type",
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
