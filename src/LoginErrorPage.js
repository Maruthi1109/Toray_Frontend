import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 
const LoginErrorPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
 
  useEffect(() => {
    // Read cookie value
    const cookies = document.cookie.split("; ");
    const errorCookie = cookies.find((row) => row.startsWith("login_error="));
    if (errorCookie) {
      const message = decodeURIComponent(errorCookie.split("=")[1]);
      setErrorMessage(message);
 
      // Clear the cookie after reading it (optional)
      document.cookie = "login_error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, []);
 
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fef2f2",
      }}
    >
      <h2 style={{ color: "#b91c1c", fontSize: "1.8rem", marginBottom: "1rem" }}>Login Failed</h2>
      <p style={{ color: "#7f1d1d", fontSize: "1rem", marginBottom: "2rem" }}>
        {errorMessage || "Something went wrong during login."}
      </p>
      <button
        onClick={() => navigate("/auth")}
        style={{
          backgroundColor: "#b91c1c",
          color: "#fff",
          padding: "0.75rem 2rem",
          borderRadius: "0.5rem",
          border: "none",
          fontSize: "1rem",
          fontWeight: "500",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.2s ease-in-out",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#7f1d1d")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#b91c1c")}
      >
        Try Again
      </button>
    </div>
  );
};
 
export default LoginErrorPage;