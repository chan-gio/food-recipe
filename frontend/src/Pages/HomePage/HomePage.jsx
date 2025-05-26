import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";
import { Card, Avatar, Skeleton, Alert } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { recipeService } from "../../services/recipeService";
import { categoryService } from "../../services/categoryService";

import bannerImage from "../../assets/image/banner.png"; // Adjust path based on your folder structure

export default function HomePage() {
  const sliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const navigate = useNavigate();
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
        const categoriesResponse = await categoryService.getCategories({
          page: 1,
          limit: 10,
        });
        const fetchedCategoriesData = categoriesResponse.data.filter(
          (category) => category.recipeCount > 0
        );
        setCategoriesData(fetchedCategoriesData);

        if (fetchedCategoriesData.length > 0) {
          setSelectedCategory(fetchedCategoriesData[0].category_id);
        }

        const mostFavoritedResponse =
          await recipeService.getMostFavoritedRecipes();
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

  const handleRecipeClick = (recipeId) => {
    navigate(`/detail/${recipeId}`);
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const selectedRecipes =
    categoriesData.find((category) => category.category_id === selectedCategory)
      ?.recipes || [];

  // Skeleton loading component for banner
  const BannerSkeleton = () => (
    <div className={styles.bannerWrapper}>
      <Skeleton.Image
        active
        style={{ width: "100%", height: 400 }} // Adjust height to match banner
      />
      <div className={styles.bannerOverlay}>
        <Skeleton.Input
          active
          size="large"
          style={{ width: 300, marginBottom: 16 }}
        />
        <Skeleton.Input active size="small" style={{ width: 400 }} />
      </div>
    </div>
  );

  // Skeleton loading component for categories
  const CategorySkeleton = () => (
    <div className={styles.categoryWrapper}>
      <Slider {...categorySettings} className={styles.categoryCarousel}>
        {Array(5)
          .fill()
          .map((_, index) => (
            <div key={index} className={styles.categoryItemWrapper}>
              <Skeleton.Button
                active
                size="large"
                shape="round"
                style={{ width: 200, height: 40 }}
              />
            </div>
          ))}
      </Slider>
    </div>
  );

  // Skeleton loading component for recipe carousel
  const RecipeCarouselSkeleton = () => (
    <div className={styles.carouselWrapper}>
      <Slider {...recipeSettings} className={styles.carousel}>
        {Array(3)
          .fill()
          .map((_, index) => (
            <div key={index}>
              <Card className={styles.recipeCard}>
                <Skeleton.Image active style={{ width: 300, height: 200 }} />
                <Card.Meta
                  title={
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 150 }}
                    />
                  }
                  description={
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 200 }}
                    />
                  }
                />
              </Card>
            </div>
          ))}
      </Slider>
    </div>
  );

  // Skeleton loading component for most favorited recipes
  const MostFavoritedSkeleton = () => (
    <div className={styles.trendingRecipesSection}>
      <h2 className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}>
        Most Favorited Recipes
      </h2>
      <div className={styles.trendingRecipesGrid}>
        <Card className={styles.recipeCard}>
          <Skeleton.Image active style={{ width: "100%", height: 450 }} />
          <Card.Meta
            title={
              <Skeleton.Input active size="small" style={{ width: 150 }} />
            }
            description={
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            }
          />
        </Card>
        {Array(4)
          .fill()
          .map((_, index) => (
            <Card key={index} className={styles.recipeCard}>
              <Skeleton.Image active style={{ width: "100%", height: 200 }} />
              <Card.Meta
                title={
                  <Skeleton.Input active size="small" style={{ width: 150 }} />
                }
                description={
                  <Skeleton.Input active size="small" style={{ width: 200 }} />
                }
              />
            </Card>
          ))}
      </div>
    </div>
  );

  // Skeleton loading component for top users
  const TopUsersSkeleton = () => (
    <div className={styles.topUsersSection}>
      <h2 className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}>
        Top Users
      </h2>
      <div className={styles.topUsersGrid}>
        {Array(3)
          .fill()
          .map((_, index) => (
            <Card key={index} className={styles.userCard}>
              <div className={styles.userCardContent}>
                <Skeleton.Avatar active size={64} shape="circle" />
                <div className={styles.userInfo}>
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 100, marginBottom: 8 }}
                  />
                  <Skeleton.Input active size="small" style={{ width: 150 }} />
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 80, marginTop: 8 }}
                  />
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.homeContainer}>
        <BannerSkeleton />
        <CategorySkeleton />
        <RecipeCarouselSkeleton />
        <MostFavoritedSkeleton />
        <TopUsersSkeleton />
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
        {categoriesData.length > 0 && (
          <>
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
                    onClick={() =>
                      handleCategoryClick(category.category_id, index)
                    }
                  >
                    <span
                      className={`${styles.categoryItem} ${
                        category.category_id === selectedCategory
                          ? styles.active
                          : ""
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
                          src={
                            recipe.images[0] || "/images/recipes/default.jpg"
                          }
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
          </>
        )}

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
