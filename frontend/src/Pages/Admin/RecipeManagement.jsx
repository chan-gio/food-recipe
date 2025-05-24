import React, { useState, useEffect } from "react";
import styles from "./RecipeManagement.module.scss";
import { Button, Card, Pagination } from "antd";
import { Link } from "react-router-dom";
import { recipeService } from "../../services/recipeService"; // Adjust path as needed

const RecipeManagement = ({ limit = 5 }) => {
  const [recipes, setRecipes] = useState([]);
  const [recipeMeta, setRecipeMeta] = useState(null);
  const [recipePage, setRecipePage] = useState(1);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all recipes when component mounts or recipePage/limit changes
  useEffect(() => {
    console.log(
      "useEffect triggered with recipePage:",
      recipePage,
      "limit:",
      limit
    );

    const fetchRecipes = async () => {
      setRecipesLoading(true);
      try {
        const response = await recipeService.getRecipes({
          page: recipePage,
          limit,
        });
        console.log("Fetched recipes response:", response);
        setRecipes(response.data || []); // Ensure recipes is an array
        setRecipeMeta(response.meta || null);
        setError("");
      } catch (err) {
        console.error("Error fetching recipes:", err.message);
        setError(err.message || "Failed to fetch recipes");
        setRecipes([]); // Set to empty array on error
      } finally {
        setRecipesLoading(false);
      }
    };

    fetchRecipes();
  }, [recipePage, limit]);

  // Handle recipe deletion
  const handleDeleteRecipe = async (id) => {
    try {
      await recipeService.deleteRecipe(id);
      const response = await recipeService.getRecipes({
        page: recipePage,
        limit,
      });
      console.log("Post-deletion recipes response:", response);
      setRecipes(response.data || []); // Ensure recipes is an array
      setRecipeMeta(response.meta || null);
      setError("");
    } catch (err) {
      console.error("Error deleting recipe:", err.message);
      setError(err.message || "Failed to delete recipe");
    }
  };

  return (
    <div className={styles.recipeManagement}>
      <h2>All Recipes</h2>
      {error && <p className={styles.error}>{error}</p>}
      {recipesLoading ? (
        <p>Loading...</p>
      ) : !recipes || !Array.isArray(recipes) || recipes.length === 0 ? (
        <p>No recipes available</p>
      ) : (
        <div className={styles.recipeList}>
          {recipes.map((recipe) => (
            <Card key={recipe.recipe_id} className={styles.recipeCard}>
              <div className={styles.recipeContent}>
                <h3>{recipe.recipe_name}</h3>
                <p>{recipe.description}</p>
              </div>
              <div className={styles.recipeActions}>
                <Link to={`/detail/${recipe.recipe_id}`}>
                  <Button className={styles.viewButton}>View</Button>
                </Link>
                <Button
                  danger
                  onClick={() => handleDeleteRecipe(recipe.recipe_id)}
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {recipeMeta && recipes && recipes.length > 0 && (
        <Pagination
          current={recipePage}
          pageSize={limit}
          total={recipeMeta.total}
          onChange={setRecipePage}
          className={styles.pagination}
        />
      )}
      <Link to="/recipeform">
        <Button type="primary" className={styles.addRecipeButton}>
          Add Recipe
        </Button>
      </Link>
    </div>
  );
};

export default RecipeManagement;
