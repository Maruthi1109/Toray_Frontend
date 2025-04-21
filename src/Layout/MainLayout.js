import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoLight from "../assets/images/logo-light.png";
import logoSm from "../assets/images/logo-sm.png";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname === path + '/';
  };

  return (
    <div className="app-container">
      {/* Toggle Button */}
      <button 
        id="vertical-menu-btn" 
        className="toggle-sidebar-btn"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <i className={`mdi ${sidebarCollapsed ? "mdi-menu-open" : "mdi-menu"}`}></i>
      </button>

      {/* Navigation Panel */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-section">
          <Link to="/dashboard" onClick={handleLogoClick}>
            <img 
              src={sidebarCollapsed ? logoSm : logoLight} 
              alt="Company Logo" 
              className="company-logo" 
            />
          </Link>
        </div>
        <nav className="nav-menu">
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') || isActive('/') ? 'active' : ''}`}>
            <i className="mdi mdi-view-dashboard"></i>
            <span className={sidebarCollapsed ? 'hidden' : ''}>Dashboard</span>
          </Link>
          <Link to="/application" className={`nav-item ${isActive('/application') ? 'active' : ''}`}>
            <i className="mdi mdi-application"></i>
            <span className={sidebarCollapsed ? 'hidden' : ''}>Application</span>
          </Link>
          <Link to="/user-details" className={`nav-item ${isActive('/user-details') ? 'active' : ''}`}>
            <i className="mdi mdi-account-details"></i>
            <span className={sidebarCollapsed ? 'hidden' : ''}>User Details</span>
          </Link>
          <Link to="/azure-details" className={`nav-item ${isActive('/azure-details') ? 'active' : ''}`}>
            <i className="mdi mdi-microsoft-azure"></i>
            <span className={sidebarCollapsed ? 'hidden' : ''}>Azure Details</span>
          </Link>
          <Link to="/bulk-upload" className={`nav-item ${isActive('/bulk-upload') ? 'active' : ''}`}>
            <i className="mdi mdi-upload"></i>
            <span className={sidebarCollapsed ? 'hidden' : ''}>Bulk Upload</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {children}
      </div>

      <style>
        {`
          .app-container {
            display: flex;
            min-height: 100vh;
            position: relative;
          }

          /* Toggle Button */
          .toggle-sidebar-btn {
            position: fixed;
            top: 20px;
            left: ${sidebarCollapsed ? '70px' : '250px'};
            z-index: 1100;
            background-color: #1b2c3f;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          .toggle-sidebar-btn:hover {
            background-color: #2a3c4f;
          }

          .toggle-sidebar-btn i {
            font-size: 24px;
          }

          /* Sidebar */
          .sidebar {
            width: 250px;
            background-color: #1b2c3f;
            color: white;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
          }

          .sidebar.collapsed {
            width: 70px;
          }

          .logo-section {
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background-color: white;
          }

          .logo-section a {
            display: block;
            text-decoration: none;
          }

          .company-logo {
            max-width: 150px;
            height: auto;
            transition: all 0.3s ease;
          }

          .sidebar.collapsed .company-logo {
            max-width: 40px;
          }

          .nav-menu {
            display: flex;
            flex-direction: column;
            padding-top: 20px;
          }

          .nav-item {
            padding: 15px 20px;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            transition: background-color 0.3s;
          }

          .sidebar.collapsed .nav-item {
            justify-content: center;
            padding: 15px 0;
          }

          .nav-item:hover,
          .nav-item.active {
            background-color: rgba(255, 255, 255, 0.1);
            text-decoration: none;
            color: white;
          }

          .nav-item i {
            margin-right: 12px;
            font-size: 20px;
            width: 24px;
          }

          .sidebar.collapsed .nav-item i {
            margin-right: 0;
          }

          .nav-item span.hidden {
            display: none;
          }

          /* Main Content */
          .main-content {
            flex: 1;
            margin-left: 250px;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
            min-height: 100vh;
          }

          .main-content.expanded {
            margin-left: 70px;
          }

          /* Common page content styles */
          .page-content {
            padding: 24px;
          }

          .page-content .container-fluid {
            padding: 0;
          }

          .page-content .card {
            margin-bottom: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .page-content .card-body {
            padding: 24px;
          }

          /* Common spacing utilities */
          .mb-4 {
            margin-bottom: 24px !important;
          }

          .mt-4 {
            margin-top: 24px !important;
          }

          .py-4 {
            padding-top: 24px !important;
            padding-bottom: 24px !important;
          }

          .px-4 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .sidebar {
              width: 220px;
            }
            .sidebar.collapsed {
              width: 60px;
            }
            .main-content {
              margin-left: 220px;
            }
            .main-content.expanded {
              margin-left: 60px;
            }
            .toggle-sidebar-btn {
              left: ${sidebarCollapsed ? '60px' : '220px'};
            }
          }
        `}
      </style>
    </div>
  );
};

export default MainLayout; 