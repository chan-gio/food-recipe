import { useParams, useNavigate } from "react-router-dom";
import styles from "./User.module.scss";
import { Avatar, Tabs, Rate, Spin, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { userService } from "../../services/userService.jsx";
import { recipeService } from "../../services/recipeService.jsx";
import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewService.jsx";

// Helper function to calculate time difference
const getTimeAgo = (createdAt) => {
  const now = new Date("2025-05-25T00:01:00+07:00"); // Current date and time
  const reviewDate = new Date(createdAt);
  const diffInMs = now - reviewDate; // Difference in milliseconds
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Difference in hours

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes <= 1 ? "just now" : `${diffInMinutes} minutes ago`;
  }
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
};

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userResponse = await userService.getUserById(id);
        setUser(userResponse.data);

        const recipesResponse = await recipeService.getRecipesByUserId(id, { page: 1, limit: 10 });
        setRecipes(recipesResponse.data);

        const reviewsResponse = await reviewService.getReviewsByUserId(id, { page: 1, limit: 10 });
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRecipeClick = (recipeId) => {
    navigate(`/detail/${recipeId}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" data-testid="loading-spinner" />
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

  if (!user) {
    return <div className={styles.container}>User not found</div>;
  }

  const tabItems = [
    {
      key: "1",
      label: `Recipes (${recipes.length})`,
      children: (
        <div className={styles.recipeList}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                className={styles.recipeItem}
                onClick={() => handleRecipeClick(recipe.recipe_id)}
              >
                <img
                  src={recipe.images[0] || "https://via.placeholder.com/300x200"}
                  alt={recipe.recipe_name}
                  className={styles.recipeImage}
                />
                <div className={styles.recipeContent}>
                  <h3 className={styles.recipeTitle}>{recipe.recipe_name}</h3>
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={recipe.averageRating || 0}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>
                      ({recipe.reviews?.length || 0})
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No recipes found for this user.</p>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: `Reviews (${reviews.length})`,
      children: (
        <div className={styles.reviewList}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className={styles.review}>
                <h3 className={styles.reviewRecipe}>{review.recipe_name}</h3>
                <div className={styles.reviewMeta}>
                  <Rate
                    disabled
                    defaultValue={review.rating || 0}
                    className={styles.reviewRating}
                  />
                  <span className={styles.reviewTime}>
                    {getTimeAgo(review.created_at)}
                  </span>
                </div>
                <p className={styles.reviewContent}>{review.content || "No content provided."}</p>
              </div>
            ))
          ) : (
            <p>No reviews found for this user.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar
          size={100}
          src={user.profile_picture}
          icon={<UserOutlined />}
          className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <h1 className={styles.username}>{user.full_name || user.signin_account || "User"}</h1>
          <p className={styles.bio}>
            {user.bio || "This user hasn't added a bio yet."}
          </p>
        </div>
      </div>

      <Tabs defaultActiveKey="1" className={styles.tabs} items={tabItems} />
    </div>
  );
};

export default User;