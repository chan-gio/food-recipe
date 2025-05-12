import React, { useState, useEffect } from "react";
import styles from "./DetailRecipe.module.scss";
import {
  Rate,
  Avatar,
  Button,
  Space,
  Divider,
  Select,
  Input,
  Modal,
  message,
  Carousel,
  Skeleton, // Import Skeleton component
} from "antd";
import {
  BookOutlined,
  DownloadOutlined,
  PrinterOutlined,
  UndoOutlined,
  PlusOutlined,
  MinusOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { recipeService } from "../../services/recipeService";
import { favoriteService } from "../../services/favoriteService";
import { reviewService } from "../../services/reviewService";
import useAuth from "../../utils/auth";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const DetailRecipe = () => {
  const { id } = useParams();
  const { isAuthenticated, userId } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [servings, setServings] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await recipeService.getRecipeById(id);
        const recipeData = response.data;
        setRecipe(recipeData);
        setServings(recipeData.servings || 1);

        // Check if the recipe is favorited by the user
        if (isAuthenticated && userId) {
          const favoritesResponse = await favoriteService.getFavoritesByUserId(userId);
          const isFav = favoritesResponse.data.some(fav => fav.recipe_id === parseInt(id));
          setIsFavorited(isFav);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, isAuthenticated, userId]);

  // Handle review submission
  const handleWriteReview = () => {
    if (!isAuthenticated) {
      message.error("Please log in to write a review");
      return;
    }
    setIsReviewModalVisible(true);
  };

  const handleModalOk = async () => {
    if (rating === 0) {
      message.error("Please provide a rating");
      return;
    }
    if (!reviewText.trim()) {
      message.error("Please write a review");
      return;
    }

    try {
      await reviewService.createReview({
        recipe_id: parseInt(id),
        user_id: userId,
        rating,
        comment: reviewText,
      });
      message.success("Review submitted successfully");
      setIsReviewModalVisible(false);
      setRating(0);
      setReviewText("");

      // Refresh recipe to get updated reviews
      const response = await recipeService.getRecipeById(id);
      setRecipe(response.data);
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleModalCancel = () => {
    setIsReviewModalVisible(false);
    setRating(0);
    setReviewText("");
  };

  // Handle serving size adjustment
  const handleServingsChange = (increment) => {
    setServings((prev) => {
      const newServings = increment ? prev + 1 : prev - 1;
      return newServings < 1 ? 1 : newServings;
    });
  };

  // Handle favoriting/unfavoriting
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      message.error("Please log in to favorite this recipe");
      return;
    }

    try {
      if (isFavorited) {
        await favoriteService.deleteFavorite(userId, parseInt(id));
        message.success("Removed from favorites");
        setIsFavorited(false);
      } else {
        await favoriteService.createFavorite({
          user_id: userId,
          recipe_id: parseInt(id),
        });
        message.success("Added to favorites");
        setIsFavorited(true);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.skeletonContainer}>
        <Skeleton active title={{ width: '50%' }} paragraph={false} />
        <Skeleton active avatar paragraph={{ rows: 1, width: ['20%'] }} />
        <Skeleton active paragraph={{ rows: 2, width: ['80%', '60%'] }} />
        <Skeleton active paragraph={{ rows: 0 }} className={styles.skeletonActions} />
        <Divider className={styles.divider} />
        <Skeleton.Image active className={styles.skeletonImage} />
        <Divider className={styles.divider} />
        <div className={styles.skeletonInfoSection}>
          <Skeleton active paragraph={{ rows: 1, width: ['30%'] }} />
          <Skeleton active paragraph={{ rows: 1, width: ['20%'] }} />
          <Skeleton active paragraph={{ rows: 1, width: ['20%'] }} />
        </div>
        <Divider className={styles.divider} />
        <div className={styles.skeletonRecipeDetails}>
          <div className={styles.skeletonDirections}>
            <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 5, width: ['90%', '80%', '70%', '60%', '50%'] }} />
          </div>
          <div className={styles.skeletonIngredients}>
            <Skeleton active title={{ width: '30%' }} paragraph={{ rows: 3, width: ['60%', '50%', '40%'] }} />
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.skeletonReviewsSection}>
          <Skeleton active title={{ width: '20%' }} paragraph={false} />
          <Skeleton active avatar paragraph={{ rows: 2, width: ['80%', '60%'] }} />
          <Skeleton active avatar paragraph={{ rows: 2, width: ['80%', '60%'] }} />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!recipe) {
    return <div className={styles.container}>Recipe not found</div>;
  }

  // Calculate average rating
  const averageRating = recipe.reviews && recipe.reviews.length > 0
    ? recipe.reviews.reduce((sum, review) => sum + review.rating, 0) / recipe.reviews.length
    : 0;

  // Scale ingredient amounts based on servings
  const servingMultiplier = servings / (recipe.servings || 1);
  const scaledIngredients = recipe.ingredients.map(ingredient => ({
    ...ingredient,
    amount: ingredient.amount ? (ingredient.amount * servingMultiplier).toFixed(2) : ingredient.amount,
  }));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{recipe.recipe_name}</h1>
      <div className={styles.rating}>
        <Rate disabled value={averageRating} />
        <span className={styles.reviewCount}>({recipe.reviews?.length || 0})</span>
      </div>
      <div className={styles.submitted}>
        <Avatar
          size={32}
          src={recipe.user?.profile_picture || "https://randomuser.me/api/portraits/women/1.jpg"}
        />
        <span className={styles.submittedText}>{recipe.user?.full_name || "Unknown User"}</span>
        <div className={styles.dots}>...</div>
      </div>
      <p className={styles.description}>{recipe.description}</p>
      <Space className={styles.actions}>
        <Button icon={<BookOutlined />} onClick={() => message.info("Saved to cookbook")} />
        <Button icon={<DownloadOutlined />} onClick={() => message.info("Downloading recipe")} />
        <Button icon={<PrinterOutlined />} onClick={() => window.print()} />
        <Button icon={<UndoOutlined />} onClick={() => message.info("Shared")} />
        <Button
          icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
          onClick={handleFavoriteToggle}
          className={isFavorited ? styles.favoritedButton : ""}
        />
        <Button type="primary" className={styles.madeButton}>
          <span role="img" aria-label="camera">📷</span> I MADE THIS
        </Button>
      </Space>
      <Divider className={styles.divider} />

      <div className={styles.imageSection}>
        <div className={styles.mainImageContainer}>
          {recipe.images && recipe.images.length > 0 ? (
            <Carousel autoplay className={styles.carousel}>
              {recipe.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`${recipe.recipe_name} ${index + 1}`}
                    className={styles.mainImage}
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <img
              src="https://via.placeholder.com/600x400"
              alt="Placeholder"
              className={styles.mainImage}
            />
          )}
          <div className={styles.imageCredit}>
            PHOTO BY {recipe.user?.full_name || "Unknown"}
          </div>
        </div>
        {recipe.videos && recipe.videos.length > 0 && (
          <div className={styles.videoContainer}>
            {recipe.videos.map((video, index) => (
              <video key={index} controls className={styles.video}>
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        )}
      </div>
      <Divider className={styles.divider} />

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>
            🕒 Ready in: {recipe.prep_time + recipe.cook_time} mins
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>🍽️ Serves: {servings}</span>
          <div className={styles.servingControls}>
            <Button icon={<MinusOutlined />} size="small" onClick={() => handleServingsChange(false)} />
            <Button icon={<PlusOutlined />} size="small" onClick={() => handleServingsChange(true)} />
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>🥄 Ingredients: {recipe.ingredients?.length || 0}</span>
        </div>
      </div>
      <Divider className={styles.divider} />

      <div className={styles.recipeDetails}>
        <div className={styles.directions}>
          <h2 className={styles.sectionTitle}>DIRECTIONS</h2>
          <ol className={styles.directionList}>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions
                .sort((a, b) => a.step_number - b.step_number)
                .map((instruction, index) => (
                  <li key={index}>{instruction.description}</li>
                ))
            ) : (
              <li>No instructions available</li>
            )}
          </ol>
        </div>
        <div className={styles.ingredients}>
          <h2 className={styles.sectionTitle}>INGREDIENTS</h2>
          {recipe.categories && recipe.categories.length > 0 && (
            <div className={styles.units}>
              <span>CATEGORY: {recipe.categories.map(cat => cat.category_name).join(', ')}</span>
            </div>
          )}
          <ul className={styles.ingredientList}>
            {scaledIngredients && scaledIngredients.length > 0 ? (
              scaledIngredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.ingredient_name} - {ingredient.amount} {ingredient.unit || ""}
                </li>
              ))
            ) : (
              <li>No ingredients available</li>
            )}
          </ul>
        </div>
      </div>
      <Divider className={styles.divider} />

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.sectionTitle}>REVIEWS</h2>
          <Select defaultValue="mostPopular" className={styles.sortSelect}>
            <Option value="mostPopular">MOST POPULAR</Option>
            <Option value="recent">RECENT</Option>
          </Select>
          <Button
            type="primary"
            className={styles.writeReviewButton}
            onClick={handleWriteReview}
          >
            <span role="img" aria-label="edit">✍️</span> WRITE A REVIEW
          </Button>
        </div>

        <Modal
          title="Write a Review"
          visible={isReviewModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Submit"
          cancelText="Cancel"
        >
          <div className={styles.reviewModal}>
            <div className={styles.ratingSection}>
              <span className={styles.ratingLabel}>Your Rating:</span>
              <Rate value={rating} onChange={setRating} />
            </div>
            <TextArea
              rows={4}
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className={styles.reviewInput}
            />
          </div>
        </Modal>

        {recipe.reviews && recipe.reviews.length > 0 ? (
          recipe.reviews.map((review, index) => (
            <div className={styles.review} key={index}>
              <div className={styles.reviewHeader}>
                <Avatar
                  size={32}
                  src={review.user?.profile_picture || "https://randomuser.me/api/portraits/women/2.jpg"}
                />
                <Rate disabled value={review.rating} className={styles.reviewRating} />
                <div className={styles.reviewDots}>...</div>
              </div>
              <p className={styles.reviewContent}>{review.comment}</p>
              <div className={styles.reviewFooter}>
                <span className={styles.reviewer}>{review.user?.full_name || "Anonymous"}</span>
                <span className={styles.timestamp}>
                  {dayjs(review.created_at).format("MMMM Do YYYY, h:mm a")}
                </span>
              </div>
              <Divider className={styles.reviewDivider} />
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
};

export default DetailRecipe;