import React, { useState } from "react";
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
} from "antd";
import {
  BookOutlined,
  DownloadOutlined,
  PrinterOutlined,
  UndoOutlined,
  PlusOutlined,
  MinusOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const DetailRecipe = () => {
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleWriteReview = () => {
    setIsReviewModalVisible(true);
  };

  const handleModalOk = () => {
    setIsReviewModalVisible(false);
    setRating(0);
    setReviewText("");
  };

  const handleModalCancel = () => {
    setIsReviewModalVisible(false);
    setRating(0);
    setReviewText("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BAGEL FRENCH TOAST CASSEROLE</h1>
      <div className={styles.rating}>
        <Rate disabled defaultValue={5} />
        <span className={styles.reviewCount}>(3)</span>
      </div>
      <div className={styles.submitted}>
        <Avatar
          size={32}
          src="https://randomuser.me/api/portraits/women/1.jpg"
        />
        <span className={styles.submittedText}>Submitted by PaulaG</span>
        <div className={styles.dots}>...</div>
      </div>
      <p className={styles.description}>
        "This is an easy breakfast treat. Use raisin cinnamon or blueberry
        bagels. This casserole has more texture than the typical french toast
        casserole due to the bagels."
      </p>
      <Space className={styles.actions}>
        <Button icon={<BookOutlined />} />
        <Button icon={<DownloadOutlined />} />
        <Button icon={<PrinterOutlined />} />
        <Button icon={<UndoOutlined />} />
        <Button type="primary" className={styles.madeButton}>
          <span role="img" aria-label="camera">
            📷
          </span>{" "}
          I MADE THIS
        </Button>
      </Space>
      <Divider className={styles.divider} />

      <div className={styles.imageSection}>
        <div className={styles.mainImageContainer}>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Bagel French Toast Casserole"
            className={styles.mainImage}
          />
          <div className={styles.imageCredit}>PHOTO BY JONATHAN MELENDEZ</div>
        </div>
        <div className={styles.thumbnailContainer}>
          <div className={styles.thumbnail}>
            <img
              src="https://via.placeholder.com/150x100"
              alt="Thumbnail 1"
              className={styles.thumbnailImage}
            />
          </div>
          <div className={styles.thumbnail}>
            <img
              src="https://via.placeholder.com/150x100"
              alt="Thumbnail 2"
              className={styles.thumbnailImage}
            />
          </div>
          <div className={styles.thumbnail}>
            <img
              src="https://via.placeholder.com/150x100"
              alt="Thumbnail 3"
              className={styles.thumbnailImage}
            />
            <div className={styles.viewAllOverlay}>
              <span>VIEW ALL</span>
            </div>
          </div>
        </div>
      </div>
      <Divider className={styles.divider} />

      <div className={styles.infoSection}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>🕒 Ready in: 1hr 15mins</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>🍽️ Serves: 4</span>
          <div className={styles.servingControls}>
            <Button icon={<MinusOutlined />} size="small" />
            <Button icon={<PlusOutlined />} size="small" />
          </div>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>🥄 Ingredients: 8</span>
        </div>
      </div>
      <Divider className={styles.divider} />

      <div className={styles.recipeDetails}>
        <div className={styles.directions}>
          <h2 className={styles.sectionTitle}>DIRECTIONS</h2>
          <ol className={styles.directionList}>
            <li>
              Cut the bagels in half and spread evenly with the Laughing Cow
              Cheese. Cut each half into eighths and place cut side down in an
              8x8 inch pan that has been sprayed with non-stick cooking spray.
            </li>
            <li>
              In a small bowl, mix together the eggs or egg substitute, vanilla
              and maple syrup; pour over bagels and sprinkle with the chopped
              pecans.
            </li>
            <li>
              Cover the dish with foil, place in refrigerator overnight. The
              next morning, remove from refrigerator 30 minutes prior to baking
              and allow to stand on counter.
            </li>
            <li>
              Preheat oven to 350 degrees and place covered dish in oven. Cook
              for 30 minutes, uncover, sprinkle liberally with cinnamon sugar
              and bake an additional 20 to 30 minutes or until center is firm
              and surface is brown.
            </li>
            <li>Serve with warmed maple syrup.</li>
          </ol>
        </div>
        <div className={styles.ingredients}>
          <h2 className={styles.sectionTitle}>INGREDIENTS</h2>
          <div className={styles.units}>
            <span>UNITS: US</span>
          </div>
          <ul className={styles.ingredientList}>
            <li>2 bagels</li>
            <li>3 ounces Laughing Cow Cheese (3 wedges)</li>
            <li>3 eggs or 3/4 cup egg substitute</li>
            <li>1/2 cup milk</li>
            <li>1/2 teaspoon vanilla</li>
            <li>2 tablespoons maple syrup</li>
            <li>1/4 cup chopped pecans</li>
            <li>cinnamon sugar</li>
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
            <span role="img" aria-label="edit">
              ✍️
            </span>{" "}
            WRITE A REVIEW
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

        <div className={styles.review}>
          <div className={styles.reviewHeader}>
            <Avatar size={32} className={styles.reviewAvatar}>
              😊
            </Avatar>
            <Rate disabled defaultValue={5} className={styles.reviewRating} />
            <div className={styles.reviewDots}>...</div>
          </div>
          <p className={styles.reviewContent}>
            OMG! This was amazing!! I even fudged things up a bit when I put the
            dish in the oven uncovered for the first half, so I tried to "fix"
            it by adding bit more milk, beaten with an egg in the top, and then
            sprinkled cinnamon sugar and covering for the final 30 minutes. Came
            out absolutely delicious with the most amazing texture! Will
            definitel...
          </p>
          <div className={styles.reviewFooter}>
            <span className={styles.reviewer}>BITTERSWEETSPICE</span>
          </div>
        </div>
        <Divider className={styles.reviewDivider} />

        <div className={styles.review}>
          <div className={styles.reviewHeader}>
            <Avatar size={32} className={styles.reviewAvatar}>
              😊
            </Avatar>
            <Rate disabled defaultValue={5} className={styles.reviewRating} />
            <div className={styles.reviewDots}>...</div>
          </div>
          <p className={styles.reviewContent}>
            This will be Rockstar on a brunch buffet. I like the meaty finish
            with the bagels. Thanks PaulaG. Texas hugs!
          </p>
          <div className={styles.reviewFooter}>
            <span className={styles.reviewer}>LYNN48</span>
          </div>
        </div>
        <Divider className={styles.reviewDivider} />

        <div className={styles.review}>
          <div className={styles.reviewHeader}>
            <Avatar
              size={32}
              src="https://randomuser.me/api/portraits/women/2.jpg"
            />
            <Rate disabled defaultValue={4} className={styles.reviewRating} />
            <div className={styles.reviewDots}>...</div>
          </div>
          <p className={styles.reviewContent}>
            What a lovely sweet treat Paula. My mom & I enjoyed this quick and
            easy to make casserole, very much. The flavor and texture were
            outstanding. I made exactly as written and wouldn't change a thing.
            I did use mini bagels and scaled it down for two. It worked
            perfectly. Thank you so much for sharing this recipe, I will be
            making it again often.
          </p>
          <div className={styles.reviewFooter}>
            <span className={styles.reviewer}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailRecipe;
