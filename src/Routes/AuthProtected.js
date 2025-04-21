import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../Hooks/UserHooks";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MainLayout from "../Layout/MainLayout";

const AuthProtected = ({ children }) => {
  const { userProfile, loading } = useProfile();

  if (loading) {
    return (
      <MainLayout>
        <div className="page-content">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (!userProfile) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthProtected;
