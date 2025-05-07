import React, { useState } from "react";
import styles from "./ProfilePage.module.scss";
import { Button, Card, Input, List } from "antd";
import { Link, NavLink } from "react-router-dom";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [recipes, setRecipes] = useState([
    { id: 1, title: "Recipe for Cake", details: "Additional Ingredients" },
    {
      id: 2,
      title: "Homemade Pizza",
      details: "Tomato sauce, cheese, pepperoni",
    },
    { id: 3, title: "Chocolate Cookies", details: "Flour, cocoa, sugar" },
  ]);

  const [favorites, setFavorites] = useState([
    {
      id: 4,
      title: "Apricot-Dijon Glazed Salmon",
      details: "Sweet and savory glaze",
    },
    { id: 5, title: "Garlic Broccolini", details: "Crispy and flavorful" },
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      recipeTitle: "Apricot-Dijon Glazed Salmon",
      content: "This recipe is amazing! The glaze is perfect.",
      timestamp: "2025-05-07 10:00",
    },
    {
      id: 2,
      recipeTitle: "Garlic Broccolini",
      content: "Super easy and delicious!",
      timestamp: "2025-05-06 18:30",
    },
  ]);

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((recipe) => recipe.id !== id));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className={styles.profileSection}>
            <h2>Profile</h2>
            <div className={styles.formGroup}>
              <Input placeholder="First Name" className={styles.input} />
              <Input placeholder="Last Name" className={styles.input} />
            </div>
            <Input placeholder="Mobile Number" className={styles.input} />
            <Input placeholder="Email ID" className={styles.input} />
            <Button type="primary" className={styles.saveButton}>
              Save Profile
            </Button>
          </div>
        );
      case "myRecipes":
        return (
          <div className={styles.myRecipesSection}>
            <h2>My Recipes</h2>
            <div className={styles.recipeList}>
              {recipes.map((recipe) => (
                <Card key={recipe.id} className={styles.recipeCard}>
                  <div className={styles.recipeContent}>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.details}</p>
                  </div>
                  <div className={styles.recipeActions}>
                    <Link to={`/recipeform/${recipe.id}`}>
                      <Button className={styles.editButton}>Edit</Button>
                    </Link>
                    <Button
                      danger
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Link to="/recipeform">
              <Button type="primary" className={styles.addRecipeButton}>
                Add Recipe
              </Button>
            </Link>
          </div>
        );
      case "favoriteRecipes":
        return (
          <div className={styles.favoriteRecipesSection}>
            <h2>Favorite Recipes</h2>
            <div className={styles.recipeList}>
              {favorites.map((recipe) => (
                <Card key={recipe.id} className={styles.recipeCard}>
                  <div className={styles.recipeContent}>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.details}</p>
                  </div>
                  <div className={styles.recipeActions}>
                    <Link to={`/detail/${recipe.id}`}>
                      <Button className={styles.viewButton}>View</Button>
                    </Link>
                    <Button
                      danger
                      onClick={() => handleRemoveFavorite(recipe.id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      case "comments":
        return (
          <div className={styles.commentsSection}>
            <h2>Your Comments</h2>
            <List
              className={styles.commentList}
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item) => (
                <List.Item className={styles.commentItem}>
                  <List.Item.Meta
                    title={
                      <span>
                        On{" "}
                        <Link to={`/detail/${item.id}`}>
                          {item.recipeTitle}
                        </Link>
                      </span>
                    }
                    description={
                      <>
                        <p>{item.content}</p>
                        <span className={styles.timestamp}>
                          {item.timestamp}
                        </span>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.sidebar}>
        <Card className={styles.profileCard}>
          <div className={styles.avatar}></div>
          <h2>Edogaru</h2>
          <p>edogaru@mail.com.my</p>
        </Card>
        <div className={styles.menu}>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${styles.menuItem} ${
                activeSection === "profile" ? styles.active : ""
              }`
            }
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${styles.menuItem} ${
                activeSection === "myRecipes" ? styles.active : ""
              }`
            }
            onClick={() => setActiveSection("myRecipes")}
          >
            My Recipes
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${styles.menuItem} ${
                activeSection === "favoriteRecipes" ? styles.active : ""
              }`
            }
            onClick={() => setActiveSection("favoriteRecipes")}
          >
            Favorite Recipes
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              `${styles.menuItem} ${
                activeSection === "comments" ? styles.active : ""
              }`
            }
            onClick={() => setActiveSection("comments")}
          >
            Your Comments
          </NavLink>
        </div>
      </div>
      <div className={styles.mainContent}>{renderSection()}</div>
    </div>
  );
};

export default ProfilePage;
