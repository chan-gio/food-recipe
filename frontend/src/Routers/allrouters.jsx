import React, { lazy } from "react";

const Homepage = lazy(() => import("../Pages/HomePage/HomePage"));
const ProfilePage = lazy(() => import("../Pages/ProfiePage/ProfilePage"));
const LoginPage = lazy(() => import("../Pages/LoginPage/LoginPage"));
const DetailRecipe = lazy(() => import("../Pages/DetailRecipe/DetailRecipe"));
const RecipeForm = lazy(() => import("../Pages/ManageRecipe/RecipeForm"));
const AdminPage = lazy(() => import("../Pages/Admin/AdminPage"));
const RecipeManagement = lazy(() => import("../Pages/Admin/RecipeManagement"));
const UserManagement = lazy(() => import("../Pages/Admin/UserManagement"));
const AllRecipes = lazy(() => import("../Pages/AllRecipes/AllRecipes"));
const CategoriesManagement = lazy(() =>
  import("../Pages/Admin/CategoriesManagement")
);
const ReviewManagement = lazy(() => import("../Pages/Admin/ReviewManagement")); // Added lazy import for ReviewManagement
const Users = lazy(() => import("../Pages/Users/User"));

const Routes = [
  { path: "/", component: <Homepage /> },
  { path: "/profile", component: <ProfilePage /> },
  { path: "/login", component: <LoginPage /> },
  { path: "/detail/:id", component: <DetailRecipe /> },
  { path: "/recipeform", component: <RecipeForm /> },
  { path: "/recipeform/:id", component: <RecipeForm /> },
  { path: "/user/:id", component: <Users /> },
  { path: "/allrecipes", component: <AllRecipes /> },
  {
    path: "/admin",
    component: <AdminPage />,
    children: [
      { path: "", component: <RecipeManagement /> },
      { path: "recipes", component: <RecipeManagement /> },
      { path: "users", component: <UserManagement /> },
      { path: "categories", component: <CategoriesManagement /> },
      { path: "reviews/:recipeId", component: <ReviewManagement /> }, // Added route for ReviewManagement
    ],
  },
];

export { Routes };
