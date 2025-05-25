import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./HomePage.module.scss";
import { Card, Avatar, Spin, Alert } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { recipeService } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";

const bannerImage = "/images/banner.jpg";

export default function HomePage() {
  const sliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [mostFavoritedRecipes, setMostFavoritedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoriesResponse = await categoryService.getCategories({ page: 1, limit: 10 });
        const fetchedCategoriesData = categoriesResponse.data;
        setCategoriesData(fetchedCategoriesData);

        if (fetchedCategoriesData.length > 0) {
          setSelectedCategory(fetchedCategoriesData[0].category_id);
        }

        const mostFavoritedResponse = await recipeService.getMostFavoritedRecipes();
        setMostFavoritedRecipes(mostFavoritedResponse.data);

        const topUsersResponse = await recipeService.getTopContributors();
        const topContributors = topUsersResponse.data.map((contributor) => ({
          user_id: contributor.userId,
          username: contributor.fullName,
          bio: `Contributed ${contributor.recipeCount} recipes`,
          avatar: `https://randomuser.me/api/portraits/${
            contributor.userId % 2 === 0 ? "men" : "women"
          }/${contributor.userId}.jpg`,
          recipesCount: contributor.recipeCount,
        }));
        setTopUsers(topContributors);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recipeSettings = {
    centerMode: true,
    centerPadding: "0px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const categorySettings = {
    centerMode: true,
    centerPadding: "0px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => {
      setSelectedCategory(categoriesData[newIndex]?.category_id);
    },
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const handleCategoryClick = (categoryId, index) => {
    setSelectedCategory(categoryId);
    categorySliderRef.current?.slickGoTo(index);
  };

  // Navigate to recipe detail page
  const handleRecipeClick = (recipeId) => {
    navigate(`/detail/${recipeId}`);
  };

  // Navigate to user profile page
  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const selectedRecipes =
    categoriesData.find((category) => category.category_id === selectedCategory)
      ?.recipes || [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <>
      {/* Banner Section */}
      <div className={styles.bannerWrapper}>
        <img
          src={bannerImage}
          alt="Dishare Banner"
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}>Welcome to Dishare</h1>
          <p className={styles.bannerSubtitle}>
            Discover and Share Your Favorite Recipes
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className={styles.homeContainer}>
        <div className={styles.categoryWrapper}>
          <Slider
            {...categorySettings}
            ref={categorySliderRef}
            className={styles.categoryCarousel}
          >
            {categoriesData.map((category, index) => (
              <div
                key={category.category_id}
                className={styles.categoryItemWrapper}
                onClick={() => handleCategoryClick(category.category_id, index)}
              >
                <span
                  className={`${styles.categoryItem} ${
                    category.category_id === selectedCategory ? styles.active : ""
                  }`}
                >
                  {category.category_name}
                </span>
              </div>
            ))}
          </Slider>
        </div>

        <div className={styles.carouselWrapper}>
          <LeftOutlined
            className={styles.arrow}
            onClick={() => sliderRef.current?.slickPrev()}
          />
          <Slider
            {...recipeSettings}
            ref={sliderRef}
            className={styles.carousel}
          >
            {selectedRecipes.map((recipe) => (
              <div key={recipe.recipe_id}>
                <Card
                  hoverable
                  onClick={() => handleRecipeClick(recipe.recipe_id)}
                  cover={
                    <img
                      alt={recipe.recipe_name}
                      src={recipe.images[0] || "/images/recipes/default.jpg"}
                    />
                  }
                  className={styles.recipeCard}
                >
                  <Card.Meta
                    title={recipe.recipe_name}
                    description={recipe.description || ""}
                  />
                </Card>
              </div>
            ))}
          </Slider>
          <RightOutlined
            className={styles.arrow}
            onClick={() => sliderRef.current?.slickNext()}
          />
        </div>
        <br />
        <h2 className={styles.sectionTitle}>Top Collection</h2>
        <div className={styles.featuredCollection}>
          <div className={styles.featuredImage}>
            <img src="/images/recipes/macandcheese.jpg" alt="Mac and Cheese" />
          </div>
          <div className={styles.featuredText}>
            <p className={styles.featuredLabel}>Collection</p>
            <h2 className={styles.featuredTitle}>
              32 Best Mac & Cheese Recipes
            </h2>
            <p className={styles.featuredDescription}>
              Cheesy and oh so satisfying, mac and cheese can do no wrong.
              Transport yourself back to childhood with one of these classic or
              kicked-up options.
            </p>
          </div>
        </div>

        {/* Most Favorited Recipes Section */}
        <div className={styles.trendingRecipesSection}>
          <h2
            className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}
          >
            Most Favorited Recipes
          </h2>
          <div className={styles.trendingRecipesGrid}>
            {mostFavoritedRecipes.map((recipe) => (
              <Card
                key={recipe.recipe_id}
                hoverable
                onClick={() => handleRecipeClick(recipe.recipe_id)}
                cover={
                  <img
                    alt={recipe.recipe_name}
                    src={recipe.images[0] || "/images/recipes/default.jpg"}
                  />
                }
                className={styles.recipeCard}
              >
                <Card.Meta
                  title={recipe.recipe_name}
                  description={recipe.description || ""}
                />
              </Card>
            ))}
          </div>
        </div>
        <br />
        <h2 className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}>
          Top Users
        </h2>
        <div className={styles.topUsersSection}>
          <div className={styles.topUsersGrid}>
            {topUsers.map((user) => (
              <Card
                key={user.user_id}
                hoverable
                onClick={() => handleUserClick(user.user_id)}
                className={styles.userCard}
              >
                <div className={styles.userCardContent}>
                  <Avatar
                    size={64}
                    src={user.avatar}
                    icon={<UserOutlined />}
                    className={styles.userAvatar}
                  />
                  <div className={styles.userInfo}>
                    <h3 className={styles.username}>{user.username}</h3>
                    <p className={styles.userBio}>{user.bio}</p>
                    <p className={styles.recipesCount}>
                      {user.recipesCount} Recipes
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}