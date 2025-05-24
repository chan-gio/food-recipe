import React, { useState, useEffect, useCallback } from "react";
import styles from "./AllRecipes.module.scss";
import { Input, Select, Card, Rate, Spin, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { categoryService } from "../../services/categoryService";
import { ingredientService } from "../../services/ingredientService";

const { Option } = Select;

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function AllRecipes() {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [ingredientSearchQuery, setIngredientSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const recipesPerPage = 12;

  // Debounced fetch for categories
  const fetchCategories = useCallback(
    debounce(async (query) => {
      try {
        const response = await categoryService.getCategoriesByName(query);
        const categoriesData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        console.log("Fetched categories:", categoriesData); // Debug log
        setCategories(categoriesData);
      } catch (err) {
        message.error(err.message || "Failed to fetch categories");
      }
    }, 500),
    []
  );

  // Debounced fetch for ingredients
  const fetchIngredients = useCallback(
    debounce(async (query) => {
      try {
        const response = await ingredientService.getIngredientByName(query);
        const ingredientsData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        console.log("Fetched ingredients:", ingredientsData); // Debug log
        setIngredients(ingredientsData);
      } catch (err) {
        message.error(err.message || "Failed to fetch ingredients");
      }
    }, 500),
    []
  );

  // Fetch initial categories and ingredients on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCategories(""), fetchIngredients("")]);
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch data";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchCategories, fetchIngredients]);

  // Debounced fetch for recipes
  const fetchRecipes = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: recipesPerPage,
          search: searchQuery || undefined,
          category: selectedCategory.length > 0 ? selectedCategory : undefined, // Pass as array
          ingredients:
            selectedIngredients.length > 0 ? selectedIngredients : undefined, // Pass as array
        };
        console.log("Fetching recipes with params:", params); // Debug log
        const response = await categoryService.getRecipes(params);
        console.log("Raw API response:", response); // Debug log
        const recipesData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response?.data?.recipes)
          ? response.data.recipes
          : [];
        console.log("Processed recipes:", recipesData); // Debug log
        setRecipes(recipesData);
        setTotalRecipes(response.total || recipesData.length);
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch recipes";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500),
    [currentPage, searchQuery, selectedCategory, selectedIngredients]
  );

  // Fetch recipes whenever filters or page changes
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Handle category search
  const handleCategorySearch = (value) => {
    setCategorySearchQuery(value);
    fetchCategories(value);
  };

  // Handle ingredient search
  const handleIngredientSearch = (value) => {
    setIngredientSearchQuery(value);
    fetchIngredients(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (values) => {
    console.log("Selected categories:", values); // Debug log
    setSelectedCategory(values);
    setCurrentPage(1);
  };

  const handleIngredientChange = (values) => {
    console.log("Selected ingredients:", values); // Debug log
    setSelectedIngredients(values);
    setCurrentPage(1);
  };

  return (
    <div className={styles.allRecipesContainer}>
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Filter Recipes</h2>
        <div className={styles.filterSection}>
          <Input
            placeholder="Search recipes..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterSection}>
          <h3>Category</h3>
          <Select
            mode="multiple"
            showSearch
            placeholder="Search categories..."
            onSearch={handleCategorySearch}
            onChange={handleCategoryChange}
            value={selectedCategory}
            allowClear
            filterOption={false}
            className={styles.filterSelect}
          >
            {categories.map((category) => (
              <Option key={category.category_id} value={category.category_name}>
                {category.category_name}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.filterSection}>
          <h3>Ingredients</h3>
          <Select
            mode="multiple"
            showSearch
            placeholder="Search ingredients..."
            onSearch={handleIngredientSearch}
            onChange={handleIngredientChange}
            value={selectedIngredients}
            allowClear
            filterOption={false}
            className={styles.filterSelect}
          >
            {ingredients.map((ingredient) => (
              <Option
                key={ingredient.ingredient_id}
                value={ingredient.ingredient_name}
              >
                {ingredient.ingredient_name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className={styles.recipesSection}>
        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className={styles.recipesGrid}>
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <Card
                    key={recipe.recipe_id}
                    hoverable
                    className={styles.recipeCard}
                    cover={
                      <img
                        alt={recipe.recipe_name}
                        src={recipe.image || "/images/recipes/placeholder.jpg"}
                      />
                    }
                  >
                    <div className={styles.recipeInfo}>
                      <h3 className={styles.recipeTitle}>
                        {recipe.recipe_name}
                      </h3>
                      <p className={styles.recipeAuthor}>
                        By {recipe.author || "Unknown"}
                      </p>
                      <div className={styles.recipeMeta}>
                        <Rate
                          disabled
                          allowHalf
                          value={recipe.rating || 0}
                          className={styles.recipeRating}
                        />
                        <span className={styles.recipeReviews}>
                          ({recipe.reviews || 0})
                        </span>
                        <span className={styles.recipeTime}>
                          {recipe.time || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p>No recipes found.</p>
              )}
            </div>
            {totalRecipes > 0 && (
              <div className={styles.pagination}>
                <Pagination
                  current={currentPage}
                  pageSize={recipesPerPage}
                  total={totalRecipes}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
