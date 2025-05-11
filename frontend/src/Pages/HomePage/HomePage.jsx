import React, { useRef, useState } from "react";
import styles from "./HomePage.module.scss";
import { Card, Avatar } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, UserOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const categoriesData = [
  {
    category_id: 1,
    category_name: "Italian",
    recipes: [
      {
        recipe_id: 1,
        recipe_name: "Spaghetti Bolognese",
        description: "A classic Italian pasta dish with rich meat sauce.",
        recipe_type: "Italian",
        servings: 4,
        prep_time: 15,
        cook_time: 45,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/spaghetti1.jpg"],
        videos: ["/videos/recipes/spaghetti_cooking.mp4"],
      },
      {
        recipe_id: 3,
        recipe_name: "Margherita Pizza",
        description: "Traditional Italian pizza with tomato and mozzarella.",
        recipe_type: "Italian",
        servings: 2,
        prep_time: 20,
        cook_time: 15,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/pizza1.jpg"],
        videos: [],
      },
      {
        recipe_id: 4,
        recipe_name: "Lasagna",
        description: "Layered pasta with meat and cheese.",
        recipe_type: "Italian",
        servings: 6,
        prep_time: 30,
        cook_time: 60,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/lasagna1.jpg"],
        videos: [],
      },
    ],
  },
  {
    category_id: 2,
    category_name: "Barbecue",
    recipes: [
      {
        recipe_id: 2,
        recipe_name: "Barbecued Baby Back Ribs",
        description: "Sticky BBQ ribs with homemade sauce.",
        recipe_type: "Barbecue",
        servings: 6,
        prep_time: 20,
        cook_time: 120,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/ribs1.jpg"],
        videos: [],
      },
      {
        recipe_id: 5,
        recipe_name: "Grilled Chicken Wings",
        description: "Spicy BBQ wings with a smoky flavor.",
        recipe_type: "Barbecue",
        servings: 4,
        prep_time: 15,
        cook_time: 30,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/wings1.jpg"],
        videos: [],
      },
      {
        recipe_id: 6,
        recipe_name: "Pulled Pork",
        description: "Slow-cooked pork with tangy BBQ sauce.",
        recipe_type: "Barbecue",
        servings: 8,
        prep_time: 30,
        cook_time: 360,
        created_at: "2025-05-07T16:20:37.000Z",
        images: ["/images/recipes/pork1.jpg"],
        videos: [],
      },
    ],
  },
];

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

export default function HomePage() {
  const sliderRef = useRef(null);
  const categorySliderRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(
    categoriesData[0].category_id
  );

  const recipeSettings = {
    centerMode: true,
    centerPadding: "0px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
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
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (oldIndex, newIndex) => {
      setSelectedCategory(categoriesData[newIndex].category_id);
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

  const selectedRecipes =
    categoriesData.find((category) => category.category_id === selectedCategory)
      ?.recipes || [];

  return (
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
        <Slider {...recipeSettings} ref={sliderRef} className={styles.carousel}>
          {selectedRecipes.map((recipe) => (
            <div key={recipe.recipe_id}>
              <Card
                hoverable
                cover={<img alt={recipe.recipe_name} src={recipe.images[0]} />}
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

      <div className={styles.featuredCollection}>
        <div className={styles.featuredImage}>
          <img src="/images/recipes/macandcheese.jpg" alt="Mac and Cheese" />
        </div>
        <div className={styles.featuredText}>
          <p className={styles.featuredLabel}>Collection</p>
          <h2 className={styles.featuredTitle}>32 Best Mac & Cheese Recipes</h2>
          <p className={styles.featuredDescription}>
            Cheesy and oh so satisfying, mac and cheese can do no wrong.
            Transport yourself back to childhood with one of these classic or
            kicked-up options.
          </p>
        </div>
      </div>

      <div className={styles.topUsersSection}>
        <h2 className={styles.sectionTitle}>Top Users</h2>
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
  );
}
