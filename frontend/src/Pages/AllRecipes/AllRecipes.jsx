import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Pagination,
  Skeleton,
  Empty,
  Image,
} from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { recipeService } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";
import { ingredientService } from "../../services/ingredientService";
import debounce from "lodash.debounce";
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
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc query parameter "search" khi component mount
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setSearchInput(searchQuery);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchParams]);

  // Fetch categories and ingredients on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const categoryData = await categoryService.getCategories();
        const ingredientData = await ingredientService.getIngredients();

        // Loại bỏ ingredients trùng lặp dựa trên ingredient_name
        const uniqueIngredients = [];
        const seenNames = new Set();
        (ingredientData.data || []).forEach((ingredient) => {
          const nameLower = ingredient.ingredient_name.toLowerCase();
          if (!seenNames.has(nameLower)) {
            seenNames.add(nameLower);
            uniqueIngredients.push(ingredient);
          }
        });

        setCategories(categoryData.data || []);
        setIngredients(uniqueIngredients);
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
        if (filters.search) {
          response = await recipeService.searchRecipesByName(filters.search, {
            page: pagination.current,
            limit: pagination.pageSize,
          });
        } else if (
          filters.category.length > 0 ||
          filters.ingredient.length > 0
        ) {
          response = await recipeService.filterRecipes({
            categoryIds:
              filters.category.length > 0 ? filters.category : undefined,
            ingredientIds:
              filters.ingredient.length > 0 ? filters.ingredient : undefined,
            page: pagination.current,
            limit: pagination.pageSize,
          });
        } else {
          response = await recipeService.getRecipes({
            page: pagination.current,
            limit: pagination.pageSize,
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

  // Debounce hàm cập nhật filters.search
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, search: value }));
        setPagination((prev) => ({ ...prev, current: 1 }));
        setSearchParams(value.trim() ? { search: value.trim() } : {});
      }, 1000),
    [setSearchParams]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSearchParams(value.trim() ? { search: value.trim() } : {});
    debouncedSearch.cancel();
  };

  const handleCategoryChange = (value) => {
    setFilters((prev) => ({ ...prev, category: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleIngredientChange = (value) => {
    setFilters((prev) => ({ ...prev, ingredient: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({ ...pagination, current: page, pageSize }));
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Component skeleton cho mỗi card
  const RecipeSkeleton = () => (
    <Col xs={24} sm={12} md={6}>
      <Card className={styles.recipeCard}>
        <Skeleton.Image active style={{ width: 200, height: 150 }} />
        <Skeleton active paragraph={false} style={{ marginTop: 12 }} />
      </Card>
    </Col>
  );

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
                value={searchInput}
                onChange={handleInputChange}
                allowClear
                loading={loading}
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
              <Row gutter={[16, 16]}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <RecipeSkeleton key={index} />
                ))}
              </Row>
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
