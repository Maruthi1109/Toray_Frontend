import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import AuthPage from "../AuthPage";
import LoginErrorPage from "../LoginErrorPage";

// redux
import { useSelector } from "react-redux";

//constants
import { layoutTypes } from "../constants/layout";

// layouts
import NonAuthLayout from "../Layout/NonAuthLayout";
import VerticalLayout from "../Layout/VerticalLayout/index";
import HorizontalLayout from "../Layout/HorizontalLayout/index";
import { AuthProtected } from "./AuthProtected";

// Import routes
import { authProtectedRoutes, publicRoutes } from "./routes";

import { createSelector } from 'reselect';

// Configure future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    case layoutTypes.HORIZONTAL:
      Layout = HorizontalLayout;
      break;
    default:
      break;
  }
  return Layout;
};

const Index = () => {
  const routepage = createSelector(
    (state) => state.Layout,
    (state) => ({
      layoutType: state.layoutType,
    })
  );

  const { layoutType } = useSelector(routepage);
  const Layout = getLayout(layoutType);

  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route path="/auth" element={<AuthPage />} />
       <Route path="/login-error" element={<LoginErrorPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout>
              {route.component}
            </NonAuthLayout>
          }
        />
      ))}

      {/* Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthProtected>
              <Layout>{route.component}</Layout>
            </AuthProtected>
          }
        />
      ))}
    </Routes>
  );
};

export default Index;
