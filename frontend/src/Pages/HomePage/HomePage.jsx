import React, { useRef, useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import { Card, Avatar, Spin, message } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { categoryService } from "../../services/categoryService";

// Import the banner image from assets
import bannerImage from "../../assets/image/banner.png"; // Adjust the path as needed

const topUsers = [
  {
    user_id: 1,
    username: "PaulaG",
    bio: "I love to cook and bake. I have been cooking since I was a young girl, learning from my mom and grandma.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    recipesCount: 10,
  },
  {
    user_id: 2,
    username: "ChefJohn",
    bio: "Professional chef with a passion for Italian cuisine and grilling.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    recipesCount: 15,
  },
  {
    user_id: 3,
    username: "FoodieLover",
    bio: "Home cook who enjoys experimenting with new recipes every weekend.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    recipesCount: 8,
  },
];

// Static data for trending recipes
const trendingRecipes = [
  {
    id: 1,
    title: "Crispy Oven Baked Quesadillas",
    description: "Life saver when you’ve got a table full of hungry teenagers!",
    image: "/images/recipes/quesadillas.jpg",
  },
  {
    id: 2,
    title: "Thai Coconut Pumpkin Soup",
    description: "",
    image: "/images/recipes/pumpkin-soup.jpg",
  },
  {
    id: 3,
    title: "Creamy Tuscan Chicken Soup",
    description: "",
    image: "/images/recipes/tuscan-soup.jpg",
  },
  {
    id: 4,
    title: "Antipasto Chickpea Salad",
    description: "",
    image: "/images/recipes/chickpea-salad.jpg",
  },
  {
    id: 5,
    title: "The Most Amazing Canned Tuna Pasta",
    description: "",
    image: "/images/recipes/tuna-pasta.jpg",
  },
];

export default function HomePage() {
  const sliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        console.log("API Response:", response);
        const categoriesData = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].category_id);
        }
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch categories";
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
      setSelectedCategory(categories[newIndex]?.category_id);
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

  const selectedRecipes = Array.isArray(categories)
    ? categories.find((category) => category.category_id === selectedCategory)
        ?.recipes || []
    : [];

  return (
    <>
      {/* Banner Section - Outside homeContainer */}
      <div className={styles.bannerWrapper}>
        <img
          src={bannerImage}
          alt="Dishare Banner"
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay}>
          <h1 className={styles.bannerTitle}> Wellcome to Dishare</h1>
          <p className={styles.bannerSubtitle}>
            Discover and Share Your Favorite Recipes
          </p>
        </div>
      </div>

      {/* Main content inside homeContainer */}
      <div className={styles.homeContainer}>
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
            <div className={styles.categoryWrapper}>
              <Slider
                {...categorySettings}
                ref={categorySliderRef}
                className={styles.categoryCarousel}
              >
                {categories.map((category, index) => (
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
                      cover={
                        <img
                          alt={recipe.recipe_name}
                          src={
                            recipe.images[0] ||
                            "/images/recipes/placeholder.jpg"
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
          </>
        )}
        <br></br>
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

        {/* Trending Recipes Section */}
        <div className={styles.trendingRecipesSection}>
          <h2
            className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}
          >
            Trending Recipes
          </h2>
          <div className={styles.trendingRecipesGrid}>
            {trendingRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                hoverable
                cover={
                  <div className={styles.recipeImageContainer}>
                    <img alt={recipe.title} src={recipe.image} />
                  </div>
                }
                className={styles.trendingRecipeCard}
              >
                <Card.Meta
                  title={recipe.title}
                  description={recipe.description || ""}
                />
              </Card>
            ))}
          </div>
        </div>
        <br></br>
        <h2 className={`${styles.sectionTitle} ${styles.centeredSectionTitle}`}>
          Top Users
        </h2>
        <div className={styles.topUsersSection}>
          <div className={styles.topUsersGrid}>
            {topUsers.map((user) => (
              <Card key={user.user_id} hoverable className={styles.userCard}>
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
