import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import { Routes } from "./Routers/allrouters";
import AdminLayout from "./components/Layout/AdminLayout"; // Import the new AdminLayout
import Layout from "./components/Layout/Layout";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {Routes.map(({ path, component, children }, index) => {
            // Check if the route is an admin route
            const isAdminRoute = path.startsWith("/admin");

            return (
              <Route
                key={index}
                path={path}
                element={
                  path === "/login" ? (
                    component
                  ) : isAdminRoute ? (
                    <AdminLayout>{component}</AdminLayout>
                  ) : (
                    <Layout>{component}</Layout>
                  )
                }
              >
                {children &&
                  children.map((child, childIndex) => (
                    <Route
                      key={childIndex}
                      path={child.path}
                      element={child.component}
                    />
                  ))}
              </Route>
            );
          })}
          {/* Route for /recipeform/:id */}
          <Route
            path="/recipeform/:id"
            element={
              <Layout>
                {
                  Routes.find((route) => route.path === "/recipeform/:id")
                    ?.component
                }
              </Layout>
            }
          />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
