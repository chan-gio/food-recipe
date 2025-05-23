import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from "react-router-dom";
import { Routes } from "./Routers/allrouters";
import Layout from "./Components/Layout/Layout";

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {Routes.map(({ path, component, children }, index) => (
            <Route
              key={index}
              path={path}
              element={
                path === "/login" ? component : <Layout>{component}</Layout>
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
          ))}
          {/* Thêm tuyến đường động cho /recipeform/:id */}
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
