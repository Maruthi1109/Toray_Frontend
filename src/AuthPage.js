import React from "react";
 
const AuthPage = () => {
    const handleLogin = () => {
      const baseUrl = process.env.REACT_APP_AUTH_BASE_URL;
      const applicationName = process.env.REACT_APP_APPLICATION_NAME;
      const redirectUri = process.env.REACT_APP_REDIRECT_URI;
      const loginUrl = `${baseUrl}/auth/login?applicationName=${encodeURIComponent(applicationName)}&redirectUri=${encodeURIComponent(redirectUri)}`;
      window.location.href = loginUrl;
      };
 
      return (
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "center", backgroundColor: "#f3f4f6" }}>
          <h2 style={{ marginBottom: "2rem", fontSize: "2rem", fontWeight: "600", color: "#1f2937" }}>Login</h2>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "#2563eb",
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
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            Login with Azure
          </button>
        </div>
      );
    };
 
 
export default AuthPage;