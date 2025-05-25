import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Space, Card, Rate, Typography } from "antd";
import { reviewService } from "../../services/reviewService";
import { toastSuccess, toastError } from "../../utils/toastNotifier";
import styles from "./ReviewManagement.module.scss";

const { Title, Text } = Typography;

const ReviewManagement = () => {
  const { recipeId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewService.getReviewsByRecipeId(recipeId);
      setReviews(response.data);
    } catch (error) {
      toastError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      toastSuccess("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toastError(error.message);
    }
  };

  const flattenReviews = (reviews, level = 0) => {
    const flattened = [];
    reviews.forEach((review) => {
      flattened.push({ ...review, level });
      if (review.replies && review.replies.length > 0) {
        flattened.push(...flattenReviews(review.replies, level + 1));
      }
    });
    return flattened;
  };

  const flattenedReviews = flattenReviews(reviews);

  const columns = [
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text, record) => (
        <div style={{ marginLeft: record.level * 20 }}>
          {record.level > 0 && <Text type="secondary">↳ Reply: </Text>}
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (rating ? <Rate disabled value={rating} /> : "N/A"),
    },
    {
      title: "User",
      dataIndex: ["user", "full_name"],
      key: "user",
      render: (text) => text || "Anonymous",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) =>
        new Date(text).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space className={styles.actionButtons}>
          <Button
            className={styles.deleteButton}
            onClick={() => handleDelete(record.review_id)}
          >
            DELETE
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.reviewManagement}>
      <Space className={styles.header}>
        <Title level={2}>Manage Reviews for Recipe ID: {recipeId}</Title>
        <Button
          className={styles.backButton}
          onClick={() => navigate("/admin/recipes")}
        >
          Back to Recipes
        </Button>
      </Space>
      <Card className={styles.card}>
        <Table
          dataSource={flattenedReviews}
          columns={columns}
          rowKey="review_id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ReviewManagement;
