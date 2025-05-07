import React, { useState } from "react";
import styles from "./DetailRecipe.module.scss";
import {
  Button,
  Rate,
  Typography,
  Row,
  Col,
  Input,
  List,
  Avatar,
  message,
} from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const DetailRecipe = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "User1",
      content: "This recipe is amazing! The glaze is perfect.",
      timestamp: "2025-05-07 10:00",
      rating: 5,
    },
    {
      id: 2,
      author: "User2",
      content: "Tried it last night, super easy and delicious!",
      timestamp: "2025-05-06 18:30",
      rating: 4,
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      message.error("Please enter a comment!");
      return;
    }
    if (newRating === 0) {
      message.error("Please select a rating!");
      return;
    }
    const newCommentObj = {
      id: comments.length + 1,
      author: "Current User", // Thay bằng thông tin người dùng thực tế
      content: newComment,
      timestamp: new Date().toLocaleString(),
      rating: newRating,
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
    setNewRating(0);
    message.success("Comment submitted successfully!");
  };

  return (
    <div className={styles.backgroundWrapper}>
      <div className={styles.recipeContainer}>
        <Title className={styles.title}>Apricot-Dijon Glazed Salmon</Title>
        <div className={styles.reviewSection}>
          <Rate disabled defaultValue={5} />
          <Button size="small" className={styles.reviewBtn}>
            BE THE FIRST TO LEAVE A REVIEW!
          </Button>
        </div>
        <Text className={styles.description}>
          Tender, flaky salmon fillets coated in a sticky sweet and savory
          sauce.
        </Text>

        <Row justify="center" gutter={16} className={styles.infoRow}>
          <Col className={styles.infoCol}>
            <Text strong>SERVES</Text>
            <br />
            <Text>4</Text>
          </Col>
          <Col className={styles.infoCol}>
            <Text strong>PREP</Text>
            <br />
            <Text>5 minutes</Text>
          </Col>
          <Col className={styles.infoCol}>
            <Text strong>COOK</Text>
            <br />
            <Text>10 minutes</Text>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<ArrowDownOutlined />}
          className={styles.jumpBtn}
        >
          ADD TO FAVORITES
        </Button>

        <div className={styles.imageWrapper}>
          <img
            src="/image.png"
            alt="Apricot-Dijon Glazed Salmon"
            className={styles.recipeImage}
          />
        </div>
        <div className={styles.recipeContent}>
          <p className={styles.intro}>
            Are you looking for the perfect quick-cooking dinner that’s big on
            flavor? This apricot-Dijon glazed salmon comes together in 15
            minutes from start to finish with just a handful of pantry
            staples...
          </p>

          <h3 className={styles.subheading}>Why You’ll Love It</h3>
          <ul className={styles.reasons}>
            <li>
              <strong>Minimal prep.</strong> With only five ingredients and 15
              minutes, this one-skillet salmon is as easy as it gets.
            </li>
            <li>
              <strong>The glaze is so good.</strong> The sticky-sweet and tangy
              sauce coats the super-tender salmon beautifully.
            </li>
          </ul>

          <div className={styles.videoWrapper}>
            <h4 className={styles.videoTitle}>Smashed Potato Casserole</h4>
            <video
              className={styles.video}
              controls
              poster="/potato-poster.jpg"
            >
              <source src="/sample-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <section className={styles.recipeContent}>
          <h2 className={styles.subheading}>
            Key Ingredients in Apricot-Dijon Glazed Salmon
          </h2>
          <ul className={styles.bulletList}>
            <li>
              <strong>Salmon fillets:</strong> You can use skin-on or skinless
              fillets here...
            </li>
            <li>
              <strong>Apricot preserves:</strong> Adds sweetness and thickens
              the sauce...
            </li>
            <li>
              <strong>Dijon mustard:</strong> Provides a sharp, tangy kick...
            </li>
            <li>
              <strong>Apple cider vinegar:</strong> Brings acidity that
              brightens the glaze.
            </li>
            <li>
              <strong>Soy sauce:</strong> Adds a savory, umami flavor.
            </li>
          </ul>

          <h2 className={styles.subheading}>
            How to Make Apricot-Dijon Glazed Salmon
          </h2>
          <ol className={styles.stepList}>
            <li>
              <strong>Make the sauce.</strong> Stir apricot preserves, Dijon
              mustard...
            </li>
            <li>
              <strong>Sear the salmon.</strong> Start by searing the fillets
              skin-side up...
            </li>
            <li>
              <strong>Finish cooking.</strong> Flip the salmon, pour the sauce
              on top...
            </li>
          </ol>

          <h2 className={styles.subheading}>
            What to Serve with Apricot-Dijon Glazed Salmon
          </h2>
          <ul className={styles.linkList}>
            <li>
              <a href="#">Rice Pilaf</a>
            </li>
            <li>
              <a href="#">Garlic Broccolini</a>
            </li>
            <li>
              <a href="#">Smashed Garlicky Potatoes</a>
            </li>
            <li>
              <a href="#">Perfect Buttery Green Beans</a>
            </li>
            <li>
              <a href="#">Crispiest Skillet-Fried Potatoes</a>
            </li>
          </ul>
        </section>
        <section className={styles.ingredientSection}>
          <div className={styles.ingredientHeader}>
            <div className={styles.stars}>★★★★★</div>
            <button className={styles.reviewBtn}>
              Be the first to leave a review!
            </button>
            <h2 className={styles.recipeHeading}>
              Apricot-Dijon Glazed Salmon Recipe
            </h2>
            <div className={styles.infoBar}>
              <div>
                <strong>Prep Time</strong>
                <br />5 minutes
              </div>
              <div>
                <strong>Cook Time</strong>
                <br />
                10 minutes
              </div>
              <div>
                <strong>Serves</strong>
                <br />4
              </div>
            </div>
          </div>

          <div className={styles.ingredientBox}>
            <h3>Ingredients</h3>
            <ul>
              <li>4 (6-ounce) salmon fillets (skin-on or skinless)</li>
              <li>3/4 teaspoon kosher salt</li>
              <li>1/2 cup apricot preserves</li>
              <li>2 tablespoons Dijon mustard</li>
              <li>2 tablespoons apple cider vinegar</li>
              <li>1 tablespoon soy sauce</li>
              <li>1/4 teaspoon freshly ground black pepper</li>
              <li>1 tablespoon olive oil</li>
              <li>Chopped fresh cilantro leaves, for garnish (optional)</li>
            </ul>
            <button className={styles.shopBtn}>🛒 Shop Recipe</button>
          </div>
        </section>
        <section className={styles.commentSection}>
          <h2 className={styles.subheading}>Comments</h2>
          <div className={styles.commentForm}>
            <Rate
              value={newRating}
              onChange={setNewRating}
              className={styles.commentRating}
            />
            <TextArea
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className={styles.commentInput}
            />
            <Button
              type="primary"
              onClick={handleSubmitComment}
              className={styles.submitCommentBtn}
            >
              Submit Comment
            </Button>
          </div>
          <List
            className={styles.commentList}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item className={styles.commentItem}>
                <List.Item.Meta
                  avatar={<Avatar>{item.author[0]}</Avatar>}
                  title={
                    <span>
                      {item.author}{" "}
                      <Rate
                        disabled
                        value={item.rating}
                        className={styles.commentRatingDisplay}
                      />
                    </span>
                  }
                  description={
                    <>
                      <Text>{item.content}</Text>
                      <br />
                      <Text type="secondary">{item.timestamp}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </section>
      </div>
    </div>
  );
};

export default DetailRecipe;
