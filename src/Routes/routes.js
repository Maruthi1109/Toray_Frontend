import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";

// Main pages
import Application from "../Pages/Application";
import AddEditApplication from "../Pages/Application/AddApplication";
import EditApplication from "../Pages/Application/EditApplication";
import UserDetails from "../Pages/UserDetails";
import BulkUpload from "../Pages/BulkUpload";
import AzureDetails from "../Pages/AzureDetails";

// Authentication pages
import Login from "../Pages/Authentication/Login";
import Logout from "../Pages/Authentication/Logout";
import AddUserDetails from "../Pages/UserDetails/addUserDetails";
import EditUserDetails from "../Pages/UserDetails/editUserDetails";

const authProtectedRoutes = [
  // Default redirect should be first
  { path: "/", element: <Navigate to="/dashboard" /> },
  
  // Dashboard
  { path: "/dashboard", element: <Dashboard /> },

  // Main pages
  { path: "/application", element: <Application /> },
  { path: "/application/add", element: <AddEditApplication /> },
  { path: "/application/edit/:id", element: <EditApplication /> },
  {path: "/user-details/add", element: <AddUserDetails/>},
  {path: "/user-details/edit/:id", element: <EditUserDetails/>},
  { path: "/user-details", element: <UserDetails /> },
  { path: "/bulk-upload", element: <BulkUpload /> },
  { path: "/azure-details", element: <AzureDetails /> },
];

const publicRoutes = [
  // Authentication routes
  { path: "/logout", element: <Logout /> },
  { path: "/login", element: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
