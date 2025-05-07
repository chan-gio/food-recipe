import React, { useState, useEffect } from "react";
import styles from "./AdminPage.module.scss";

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    ingredients: "",
    instructions: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Giả lập lấy dữ liệu công thức từ API
    const fetchRecipes = async () => {
      const mockRecipes = [
        {
          id: 1,
          title: "Bánh Mì",
          ingredients: "Bánh mì, thịt, rau",
          instructions: "Nướng bánh, thêm nhân.",
        },
        {
          id: 2,
          title: "Phở",
          ingredients: "Bánh phở, bò, nước dùng",
          instructions: "Nấu nước dùng, thêm bò.",
        },
      ];
      setRecipes(mockRecipes);
    };
    fetchRecipes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRecipe = () => {
    if (formData.title && formData.ingredients && formData.instructions) {
      const newRecipe = {
        id: recipes.length + 1,
        title: formData.title,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
      };
      setRecipes([...recipes, newRecipe]);
      resetForm();
    }
  };

  const handleEditRecipe = (recipe) => {
    setFormData(recipe);
    setIsEditing(true);
  };

  const handleUpdateRecipe = () => {
    setRecipes(
      recipes.map((recipe) => (recipe.id === formData.id ? formData : recipe))
    );
    resetForm();
    setIsEditing(false);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const resetForm = () => {
    setFormData({ id: null, title: "", ingredients: "", instructions: "" });
  };

  return (
    <div>
      <div className={styles.form}>
        <h2>{isEditing ? "Sửa Công thức" : "Thêm Công thức"}</h2>
        <input
          type="text"
          name="title"
          placeholder="Tên công thức"
          value={formData.title}
          onChange={handleInputChange}
          className={styles.input}
        />
        <textarea
          name="ingredients"
          placeholder="Nguyên liệu"
          value={formData.ingredients}
          onChange={handleInputChange}
          className={styles.textarea}
        />
        <textarea
          name="instructions"
          placeholder="Hướng dẫn"
          value={formData.instructions}
          onChange={handleInputChange}
          className={styles.textarea}
        />
        <button
          onClick={isEditing ? handleUpdateRecipe : handleAddRecipe}
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
        <h2>Danh sách Công thức</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Nguyên liệu</th>
              <th>Hướng dẫn</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.title}</td>
                <td>{recipe.ingredients}</td>
                <td>{recipe.instructions}</td>
                <td>
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
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

export default RecipeManagement;
