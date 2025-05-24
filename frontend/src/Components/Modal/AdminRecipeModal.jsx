import React, { useState, useEffect } from "react";
import {
  Modal,
  Rate,
  Avatar,
  Button,
  Space,
  Divider,
  Select,
  Carousel,
  Skeleton,
} from "antd";
import {
  BookOutlined,
  DownloadOutlined,
  PrinterOutlined,
  UndoOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { reviewService } from "../../services/reviewService"; // Adjust the import path as needed
import dayjs from "dayjs";
import "./AdminRecipeModal.module.scss";

const { Option } = Select;

const AdminRecipeModal = ({ visible, onClose, recipe }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});

  // Fetch reviews when the modal is opened
  useEffect(() => {
    if (visible && recipe) {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const response = await reviewService.getReviewsByRecipeId(
            recipe.recipe_id,
            { page: 1, limit: 10 }
          );
          setReviews(response.data || []);
        } catch (err) {
          setErrorReviews(err.message);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [visible, recipe]);

  const toggleReplies = (reviewId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const ReviewItem = ({ review, level = 0 }) => {
    const hasReplies = review.replies && review.replies.length > 0;
    const isExpanded = expandedReplies[review.review_id] || false;

    return (
      <div
        className={`review ${
          level === 0 ? "top-level-review" : "reply-review"
        }`}
      >
        <div className="review-header">
          <Avatar
            size={32}
            src={
              review.user?.profile_picture ||
              "https://randomuser.me/api/portraits/women/2.jpg"
            }
          />
          <Rate disabled value={review.rating || 0} className="review-rating" />
          <div className="review-dots">...</div>
        </div>
        <p className="review-content">{review.comment}</p>
        <div className="review-footer">
          <span className="reviewer">
            {review.user?.full_name || "Anonymous"}
          </span>
          <span className="timestamp">
            {dayjs(review.created_at).format("MMMM Do YYYY, h:mm a")}
          </span>
          {hasReplies && (
            <Button
              type="link"
              className="toggle-replies-button"
              onClick={() => toggleReplies(review.review_id)}
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
            >
              {isExpanded
                ? `Hide Replies (${review.replies.length})`
                : `Show Replies (${review.replies.length})`}
            </Button>
          )}
        </div>
        {hasReplies && isExpanded && (
          <div className="replies">
            {review.replies.map((reply) => (
              <ReviewItem
                key={reply.review_id}
                review={reply}
                level={level + 1}
              />
            ))}
          </div>
        )}
        <Divider className="review-divider" />
      </div>
    );
  };

  if (!recipe) return null;

  const averageRating =
    reviews && reviews.length > 0
      ? reviews
          .filter((review) => !review.parent_review_id)
          .reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.filter((review) => !review.parent_review_id).length
      : 0;

  return (
    <Modal
      title="Recipe Details"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      className="admin-recipe-modal"
      width={900}
    >
      <div className="modal-container">
        {recipe.categories && recipe.categories.length > 0 && (
          <div className="units">
            <span>
              CATEGORY:{" "}
              {recipe.categories.map((cat) => cat.category_name).join(", ")}
            </span>
          </div>
        )}
        <h1 className="title">{recipe.recipe_name}</h1>
        <div className="rating">
          <Rate disabled value={averageRating} />
          <span className="review-count">
            ({reviews?.filter((review) => !review.parent_review_id).length || 0}
            )
          </span>
        </div>
        <div className="submitted">
          <Avatar
            size={32}
            src={
              recipe.user?.profile_picture ||
              "https://randomuser.me/api/portraits/women/1.jpg"
            }
          />
          <span className="submitted-text">
            {recipe.user?.full_name || "Unknown User"}
          </span>
          <div className="dots">...</div>
        </div>
        <p className="description">{recipe.description}</p>
        <Space className="actions">
          <Button
            icon={<BookOutlined />}
            onClick={() => message.info("Saved to cookbook")}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => message.info("Downloading recipe")}
          />
          <Button icon={<PrinterOutlined />} onClick={() => window.print()} />
          <Button
            icon={<UndoOutlined />}
            onClick={() => message.info("Shared")}
          />
        </Space>
        <Divider className="divider" />

        <div className="image-section">
          <div className="main-image-container">
            {recipe.images && recipe.images.length > 0 ? (
              <Carousel autoplay className="carousel">
                {recipe.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`${recipe.recipe_name} ${index + 1}`}
                      className="main-image"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src="https://via.placeholder.com/600x400"
                alt="Placeholder"
                className="main-image"
              />
            )}
            <div className="image-credit">
              PHOTO BY {recipe.user?.full_name || "Unknown"}
            </div>
          </div>
          {recipe.videos && recipe.videos.length > 0 && (
            <div className="video-container">
              {recipe.videos.map((video, index) => (
                <video key={index} controls className="video">
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}
            </div>
          )}
        </div>
        <Divider className="divider" />

        <div className="info-section">
          <div className="info-item">
            <span className="info-label">
              🕒 Ready in: {recipe.prep_time + recipe.cook_time} mins
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">🍽️ Serves: {recipe.servings}</span>
          </div>
          <div className="info-item">
            <span className="info-label">
              🥄 Ingredients: {recipe.ingredients?.length || 0}
            </span>
          </div>
        </div>
        <Divider className="divider" />

        <div className="recipe-details">
          <div className="directions">
            <h2 className="section-title">DIRECTIONS</h2>
            <ol className="direction-list">
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
          <div className="ingredients">
            <h2 className="section-title">INGREDIENTS</h2>
            <ul className="ingredient-list">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.ingredient_name} - {ingredient.amount}{" "}
                    {ingredient.unit || ""}
                  </li>
                ))
              ) : (
                <li>No ingredients available</li>
              )}
            </ul>
          </div>
        </div>
        <Divider className="divider" />

        <div className="reviews-section">
          <div className="reviews-header">
            <h2 className="section-title">REVIEWS</h2>
            <Select defaultValue="mostPopular" className="sort-select">
              <Option value="mostPopular">MOST POPULAR</Option>
              <Option value="recent">RECENT</Option>
            </Select>
          </div>

          {loadingReviews ? (
            <div className="skeleton-reviews-section">
              <Skeleton active title={{ width: "20%" }} paragraph={false} />
              <Skeleton
                active
                avatar
                paragraph={{ rows: 2, width: ["80%", "60%"] }}
              />
              <Skeleton
                active
                avatar
                paragraph={{ rows: 2, width: ["80%", "60%"] }}
              />
            </div>
          ) : errorReviews ? (
            <p>Error loading reviews: {errorReviews}</p>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review.review_id} review={review} level={0} />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminRecipeModal;
