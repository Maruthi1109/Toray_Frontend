import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage";
import LoginErrorPage from "./LoginErrorPage";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./Routes/routes";

// Import Scss
import './assets/scss/theme.scss';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />
       <Route path="/login-error" element={<LoginErrorPage />} />

      {publicRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={route.element}
          key={idx}
        />
      ))}

      {/* Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={route.element}
          key={idx}
        />
      ))}
    </Routes>
  );
};

export default App;
