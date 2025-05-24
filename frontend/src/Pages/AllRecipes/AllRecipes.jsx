import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Pagination,
  Spin,
  Empty,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import { recipeService } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";
import { ingredientService } from "../../services/ingredientService";
import styles from "./AllRecipes.module.scss";

const { Search } = Input;
const { Option } = Select;

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: [],
    ingredient: [],
  });

  // Fetch categories and ingredients on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const categoryData = await categoryService.getCategories();
        const ingredientData = await ingredientService.getIngredients();
        setCategories(categoryData.data || []);
        setIngredients(ingredientData.data || []);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch recipes based on filters and pagination
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        let response;
        if (filters.category.length > 0 || filters.ingredient.length > 0) {
          // Use filterRecipes for category or ingredient filters
          response = await recipeService.filterRecipes({
            categoryIds:
              filters.category.length > 0 ? filters.category : undefined,
            ingredientIds:
              filters.ingredient.length > 0 ? filters.ingredient : undefined,
            page: pagination.current,
            limit: pagination.pageSize,
          });
        } else {
          // Use getRecipes for search or no filters
          response = await recipeService.getRecipes({
            page: pagination.current,
            limit: pagination.pageSize,
            search: filters.search,
          });
        }
        setRecipes(response.data || []);
        setPagination({
          ...pagination,
          total: response.meta.total || 0,
        });
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
        setPagination({ ...pagination, total: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [pagination.current, pagination.pageSize, filters]);

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleCategoryChange = (value) => {
    setFilters({ ...filters, category: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handleIngredientChange = (value) => {
    setFilters({ ...filters, ingredient: value });
    setPagination({ ...pagination, current: 1 });
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
  };

  return (
    <div className={styles.container}>
      <Row gutter={[16, 16]}>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <div className={styles.sidebar}>
            <h2>Filters</h2>
            <div className={styles.filterSection}>
              <h3>Search</h3>
              <Search
                placeholder="Search recipes..."
                onSearch={handleSearch}
                allowClear
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filterSection}>
              <h3>Categories</h3>
              <Select
                mode="multiple"
                placeholder="Select categories"
                onChange={handleCategoryChange}
                value={filters.category}
                className={styles.selectInput}
                allowClear
              >
                {categories.map((category) => (
                  <Option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className={styles.filterSection}>
              <h3>Ingredients</h3>
              <Select
                mode="multiple"
                placeholder="Select ingredients"
                onChange={handleIngredientChange}
                value={filters.ingredient}
                className={styles.selectInput}
                allowClear
              >
                {ingredients.map((ingredient) => (
                  <Option
                    key={ingredient.ingredient_id}
                    value={ingredient.ingredient_id}
                  >
                    {ingredient.ingredient_name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Col>

        {/* Main Content */}
        <Col xs={24} md={18}>
          <div className={styles.recipeList}>
            <h2>All Recipes</h2>
            {loading ? (
              <Spin size="large" className={styles.spinner} />
            ) : recipes.length === 0 ? (
              <Empty description="No recipes found" />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {recipes.map((recipe) => (
                    <Col xs={24} sm={12} md={6} key={recipe.recipe_id}>
                      <Link to={`/detail/${recipe.recipe_id}`}>
                        <Card
                          hoverable
                          cover={
                            recipe.images && recipe.images.length > 0 ? (
                              <Image
                                src={recipe.images[0]}
                                alt={recipe.recipe_name}
                                className={styles.recipeImage}
                              />
                            ) : (
                              <div className={styles.placeholderImage}>
                                No Image
                              </div>
                            )
                          }
                          className={styles.recipeCard}
                        >
                          <Card.Meta title={recipe.recipe_name} />
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePaginationChange}
                  className={styles.pagination}
                  showSizeChanger
                />
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AllRecipes;
