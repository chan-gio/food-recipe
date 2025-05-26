import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfilePage.module.scss";
import { Button, Card, Input, Pagination, Spin, Skeleton } from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { recipeService } from "../../services/recipeService";
import { favoriteService } from "../../services/favoriteService";
import { reviewService } from "../../services/reviewService";
import { userService } from "../../services/userService";
import useAuth from "../../utils/auth";
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  CommentOutlined,
} from "@ant-design/icons";

const ProfilePage = () => {
  const { isAuthenticated, userId, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [comments, setComments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recipeMeta, setRecipeMeta] = useState(null);
  const [favoriteMeta, setFavoriteMeta] = useState(null);
  const [commentMeta, setCommentMeta] = useState(null);
  const [recipePage, setRecipePage] = useState(1);
  const [favoritePage, setFavoritePage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const limit = 5;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !userId) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await userService.getUserById(userId);
        const userProfile = response.data;
        setProfile(userProfile);
        setOriginalProfile(userProfile);

        const [fName, lName] = userProfile.full_name
          ? userProfile.full_name.split(" ")
          : ["", ""];
        setFirstName(fName || "");
        setLastName(lName || "");
        setEmail(userProfile.email || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchRecipes = async () => {
      setRecipesLoading(true);
      try {
        const response = await recipeService.getRecipesByUserId(userId, {
          page: recipePage,
          limit,
        });
        setRecipes(response.data);
        setRecipeMeta(response.meta);
      } catch (err) {
        setError(err.message);
      } finally {
        setRecipesLoading(false);
      }
    };

    const fetchFavorites = async () => {
      setFavoritesLoading(true);
      try {
        const response = await favoriteService.getFavoritesByUserId(userId, {
          page: favoritePage,
          limit,
        });
        setFavorites(response.data);
        setFavoriteMeta(response.meta);
      } catch (err) {
        setError(err.message);
      } finally {
        setFavoritesLoading(false);
      }
    };

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const response = await reviewService.getReviewsByUserId(userId, {
          page: commentPage,
          limit,
        });
        setComments(response.data);
        setCommentMeta(response.meta);
      } catch (err) {
        setError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (activeSection === "profile") {
      fetchProfile();
    } else if (activeSection === "myRecipes") {
      fetchRecipes();
    } else if (activeSection === "favoriteRecipes") {
      fetchFavorites();
    } else if (activeSection === "comments") {
      fetchComments();
    }
  }, [
    activeSection,
    recipePage,
    favoritePage,
    commentPage,
    isAuthenticated,
    userId,
    isLoading,
  ]);

  const handleDeleteRecipe = async (id) => {
    try {
      await recipeService.deleteRecipe(id);
      const response = await recipeService.getRecipesByUserId(userId, {
        page: recipePage,
        limit,
      });
      setRecipes(response.data);
      setRecipeMeta(response.meta);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await favoriteService.deleteFavorite(userId, recipeId);
      const response = await favoriteService.getFavoritesByUserId(userId, {
        page: favoritePage,
        limit,
      });
      setFavorites(response.data);
      setFavoriteMeta(response.meta);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await reviewService.deleteReview(commentId);
      const response = await reviewService.getReviewsByUserId(userId, {
        page: commentPage,
        limit,
      });
      setComments(response.data);
      setCommentMeta(response.meta);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const userData = {
        full_name: `${firstName} ${lastName}`.trim() || undefined,
        email: email || undefined,
      };
      const response = await userService.updateUser(userId, userData, file);
      setProfile(response.data);
      setOriginalProfile(response.data);
      setIsEditingProfile(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveProfile = async () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const userData = {
      full_name: fullName || undefined,
      email: email || undefined,
    };

    const originalFullName = originalProfile?.full_name || "";
    const originalEmail = originalProfile?.email || "";
    const hasChanges =
      (userData.full_name && userData.full_name !== originalFullName) ||
      (userData.email && userData.email !== originalEmail);

    if (!hasChanges) {
      setError("No changes detected");
      setIsEditingProfile(false);
      return;
    }

    try {
      const response = await userService.updateUser(userId, userData, null);
      setProfile(response.data);
      setOriginalProfile(response.data);
      setIsEditingProfile(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setError("");
  };

  const handleLogout = () => {
    logout();
  };

  const EmptyState = ({ icon, message, action }) => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3>{message}</h3>
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className={styles.profileSection}>
            <h2>Profile</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {profileLoading ? (
              <div className={styles.skeletonProfileSection}>
                <Skeleton.Input
                  active
                  style={{ width: "100%", marginBottom: "16px" }}
                />
                <Skeleton.Input
                  active
                  style={{ width: "100%", marginBottom: "16px" }}
                />
                <Skeleton.Button active block style={{ marginTop: "16px" }} />
              </div>
            ) : !profile ? (
              <EmptyState
                icon={
                  <UserOutlined
                    style={{ fontSize: "48px", color: "#ff6600" }}
                  />
                }
                message="No profile data available"
                action={
                  <Button
                    type="primary"
                    className={styles.editButton}
                    onClick={handleEditProfile}
                  >
                    Create Profile
                  </Button>
                }
              />
            ) : (
              <>
                <div className={styles.formGroup}>
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={styles.input}
                    disabled={!isEditingProfile}
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={styles.input}
                    disabled={!isEditingProfile}
                  />
                </div>
                <Input
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={!isEditingProfile}
                />
                <div className={styles.buttonContainer}>
                  {isEditingProfile ? (
                    <Button
                      type="primary"
                      className={styles.saveButton}
                      onClick={handleSaveProfile}
                    >
                      Save Profile
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className={styles.saveButton}
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case "myRecipes":
        return (
          <div className={styles.myRecipesSection}>
            <h2>My Recipes</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {recipesLoading ? (
              <div className={styles.skeletonMyRecipesSection}>
                <Skeleton active title={{ width: "20%" }} paragraph={false} />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
                <Skeleton.Button active block style={{ marginTop: "16px" }} />
              </div>
            ) : recipes.length === 0 ? (
              <EmptyState
                icon={
                  <FileTextOutlined
                    style={{ fontSize: "48px", color: "#ff6600" }}
                  />
                }
                message="You haven't added any recipes yet"
                action={
                  <Link to="/recipeform">
                    <Button type="primary" className={styles.addRecipeButton}>
                      Add Your First Recipe
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className={styles.recipeList}>
                {recipes.map((recipe) => (
                  <Card key={recipe.recipe_id} className={styles.recipeCard}>
                    <div className={styles.recipeContent}>
                      <h3>{recipe.recipe_name}</h3>
                      <p>{recipe.description}</p>
                    </div>
                    <div className={styles.recipeActions}>
                      <Link to={`/detail/${recipe.recipe_id}`}>
                        <Button className={styles.viewButton}>View</Button>
                      </Link>
                      <Link to={`/recipeform/${recipe.recipe_id}`}>
                        <Button className={styles.editButton}>Edit</Button>
                      </Link>
                      <Button
                        danger
                        onClick={() => handleDeleteRecipe(recipe.recipe_id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {(recipes.length > 0 || recipesLoading) && (
              <div className={styles.addRecipeContainer}>
                <Link to="/recipeform">
                  <Button type="primary" className={styles.addRecipeButton}>
                    Add Recipe
                  </Button>
                </Link>
              </div>
            )}
          </div>
        );
      case "favoriteRecipes":
        return (
          <div className={styles.favoriteRecipesSection}>
            <h2>Favorite Recipes</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {favoritesLoading ? (
              <div className={styles.skeletonFavoriteRecipesSection}>
                <Skeleton active title={{ width: "20%" }} paragraph={false} />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
              </div>
            ) : favorites.length === 0 ? (
              <EmptyState
                icon={
                  <HeartOutlined
                    style={{ fontSize: "48px", color: "#ff6600" }}
                  />
                }
                message="No favorite recipes yet"
                action={
                  <Link to="/">
                    <Button type="primary" className={styles.viewButton}>
                      Explore Recipes
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className={styles.recipeList}>
                {favorites.map((favorite) => (
                  <Card key={favorite.recipe_id} className={styles.recipeCard}>
                    <div className={styles.recipeContent}>
                      <h3>{favorite.recipe.recipe_name}</h3>
                      <p>{favorite.recipe.description}</p>
                    </div>
                    <div className={styles.recipeActions}>
                      <Link to={`/detail/${favorite.recipe_id}`}>
                        <Button className={styles.viewButton}>View</Button>
                      </Link>
                      <Button
                        danger
                        onClick={() => handleRemoveFavorite(favorite.recipe_id)}
                        className={styles.removeButton}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {favoriteMeta && favorites.length > 0 && (
              <Pagination
                current={favoritePage}
                pageSize={limit}
                total={favoriteMeta.total}
                onChange={(page) => setFavoritePage(page)}
                className={styles.pagination}
              />
            )}
          </div>
        );
      case "comments":
        return (
          <div className={styles.commentsSection}>
            <h2>Your Comments</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {commentsLoading ? (
              <div className={styles.skeletonCommentsSection}>
                <Skeleton active title={{ width: "20%" }} paragraph={false} />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["80%", "60%"] }}
                />
              </div>
            ) : comments.length === 0 ? (
              <EmptyState
                icon={
                  <CommentOutlined
                    style={{ fontSize: "48px", color: "#ff6600" }}
                  />
                }
                message="No comments added yet"
                action={
                  <Link to="/">
                    <Button type="primary" className={styles.viewButton}>
                      Find Recipes to Comment
                    </Button>
                  </Link>
                }
              />
            ) : (
              <div className={styles.recipeList}>
                {comments.map((comment) => (
                  <Card key={comment.review_id} className={styles.recipeCard}>
                    <div className={styles.recipeContent}>
                      <h3>
                        <strong>Recipe Name: </strong>
                        <Link to={`/detail/${comment.recipe.recipe_id}`}>
                          {comment.recipe.recipe_name}
                        </Link>
                      </h3>
                      <p>
                        <strong>Comment: </strong>
                        {comment.comment}
                      </p>
                      <span className={styles.timestamp}>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.recipeActions}>
                      <Link to={`/detail/${comment.recipe.recipe_id}`}>
                        <Button className={styles.viewButton}>
                          View Recipe
                        </Button>
                      </Link>
                      <Button
                        danger
                        onClick={() => handleDeleteComment(comment.review_id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {commentMeta && comments.length > 0 && (
              <Pagination
                current={commentPage}
                pageSize={limit}
                total={commentMeta.total}
                onChange={(page) => setCommentPage(page)}
                className={styles.pagination}
              />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.sidebar}>
        <Card className={styles.profileCard}>
          {profileLoading ? (
            <div className={styles.skeletonProfileCard}>
              <Skeleton.Avatar active size={100} shape="circle" />
              <Skeleton
                active
                title={{ width: "50%" }}
                paragraph={false}
                style={{ marginTop: "16px" }}
              />
              <Skeleton active paragraph={{ rows: 1, width: ["30%"] }} />
            </div>
          ) : !profile ? (
            <EmptyState
              icon={
                <UserOutlined style={{ fontSize: "48px", color: "#ff6600" }} />
              }
              message="No profile data available"
            />
          ) : (
            <>
              <div
                className={styles.avatar}
                style={{
                  backgroundImage: profile.profile_picture
                    ? `url(${profile.profile_picture})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={handleAvatarClick}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <h2>{profile.full_name || "Unknown"}</h2>
              <p>{profile.email || "No email"}</p>
            </>
          )}
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
          <Button danger className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className={styles.mainContent}>{renderSection()}</div>
    </div>
  );
};

export default ProfilePage;
