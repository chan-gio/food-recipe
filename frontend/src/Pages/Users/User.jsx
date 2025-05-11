import React from "react";
import styles from "./User.module.scss";
import { Avatar, Button, Tabs, Card, Rate } from "antd";
import { UserOutlined, HeartOutlined, EditOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const User = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Avatar size={100} icon={<UserOutlined />} className={styles.avatar} />
        <div className={styles.userInfo}>
          <h1 className={styles.username}>PaulaG</h1>
          <p className={styles.bio}>
            I love to cook and bake. I have been cooking since I was a young
            girl, learning from my mom and grandma.
          </p>
        </div>
      </div>

      <Tabs defaultActiveKey="1" className={styles.tabs}>
        <TabPane tab="Recipes (15)" key="1">
          <div className={styles.recipeList}>
            <Card
              hoverable
              cover={
                <img
                  alt="Bagel French Toast Casserole"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Bagel French Toast Casserole"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={5}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(3)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Blueberry Muffins"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Blueberry Muffins"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={4}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(5)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img alt="Pancakes" src="https://via.placeholder.com/300x200" />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Pancakes"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={4}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(2)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Chocolate Chip Cookies"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Chocolate Chip Cookies"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={5}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(7)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Banana Bread"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Banana Bread"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={4}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(4)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Lemon Bars"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Lemon Bars"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={3}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(2)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Apple Pie"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Apple Pie"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={5}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(6)</span>
                  </div>
                }
              />
            </Card>
            <Card
              hoverable
              cover={
                <img
                  alt="Carrot Cake"
                  src="https://via.placeholder.com/300x200"
                />
              }
              className={styles.recipeCard}
            >
              <Card.Meta
                title="Carrot Cake"
                description={
                  <div className={styles.recipeMeta}>
                    <Rate
                      disabled
                      defaultValue={4}
                      className={styles.recipeRating}
                    />
                    <span className={styles.reviewCount}>(3)</span>
                  </div>
                }
              />
            </Card>
          </div>
        </TabPane>
        <TabPane tab="Reviews (5)" key="2">
          <div className={styles.reviewList}>
            <div className={styles.review}>
              <h3 className={styles.reviewRecipe}>
                Bagel French Toast Casserole
              </h3>
              <Rate disabled defaultValue={5} className={styles.reviewRating} />
              <p className={styles.reviewContent}>
                OMG! This was amazing!! I even fudged things up a bit when I put
                the dish in the oven uncovered for the first half, so I tried to
                "fix" it by adding bit more milk, beaten with an egg in the top,
                and then sprinkled cinnamon sugar and covering for the final 30
                minutes. Came out absolutely delicious with the most amazing
                texture! Will definitely make again.
              </p>
            </div>
            <div className={styles.review}>
              <h3 className={styles.reviewRecipe}>Blueberry Muffins</h3>
              <Rate disabled defaultValue={4} className={styles.reviewRating} />
              <p className={styles.reviewContent}>
                Really tasty muffins! I added a bit more sugar to suit my taste,
                but the texture was perfect. Thanks for sharing!
              </p>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default User;
