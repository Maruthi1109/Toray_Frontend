import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MainLayout from "../../Layout/MainLayout";
import { getDashboardData } from "../../store/dashboard/actions";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import Application from "../Application";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const Dashboard = ({ getDashboardData, dashboardData, loading, error }) => {
  document.title = "Dashboard | Toray Admin Dashboard";
  // console.log(dashboardData, "dashboardData");

  // const newData = getDashboardData();
  // console.log(newData, "newData");


    // State for applications data
  const [applications, setApplications] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [isDesktopCount, setIsDesktopCount] = useState(0);
  
  console.log(applications, "applications");


   const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const activeAppCount = response.data.data.filter(app => app.isActive).length;
      const isDesktopCount = response.data.data.filter(app => app.isDesktop).length;
      console.log(activeCount, "activeCount");
      setActiveCount(activeAppCount);
      setIsDesktopCount(isDesktopCount);
      console.log('API Response:', response);

      // Check if response has the expected structure
      if (response?.data?.success && Array.isArray(response.data.data))
      {
        const applications = response.data.data.map(app => ({
          app_id: app.app_id || app.appId || '',
          app_name: app.app_name || app.appName || '',
          redirect_uri: app.redirect_uri || app.redirectUri || '',
          status: (app.is_active || app.isActive) ? "Active" : "Inactive",
          store_token: app.store_token || app.storeToken || false,
          internal_legacy_user: app.internal_legacy_user || app.internalLegacyUser || false,
          desktop: app.desktop || false,
          created_at: app.created_at || app.createdAt || '',
          updated_at: app.updated_at || app.updatedAt || ''
        }));
        setApplications(applications);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback data in development');
        setApplications([
          {
            app_id: '1',
            app_name: 'Demo App 1',
            redirect_uri: 'https://example.com/callback',
            status: 'Active',
            store_token: false,
            internal_legacy_user: false,
            desktop: false,
            created_at: '10-04-2025',
            updated_at: '10-04-2025'
          }
        ]);
      }
    } 
  };

  useEffect(() => {
    getDashboardData();
    fetchApplications();
  }, [getDashboardData]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-message">
          Error loading dashboard data: {error.message}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-content">
        <Container fluid>
          {/* Top Stats Cards */}
          <div className="stats-cards-container">
            <div className="stat-card">
              <div className="stat-icon total-apps">
                <i className="mdi mdi-application"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">{dashboardData.totalApplications}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon active-apps">
                <i className="mdi mdi-check-circle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Active Applications</div>
                <div className="stat-value">{activeCount}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon total-users">
                <i className="mdi mdi-account-group"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{dashboardData.totalUsers}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon active-users">
                <i className="mdi mdi-account-check"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{dashboardData.totalUsers}</div>
              </div>
            </div>
          </div>

          {/* Statistics Tables */}
          <Row className="statistics-container">
            <Col md={6}>
              <div className="stats-table">
                <h3>Application Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-application"></i>
                      Total Applications
                    </div>
                    <div className="stat-value">{dashboardData.totalApplications}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-check-circle"></i>
                      Active Applications
                    </div>
                    <div className="stat-value">{activeCount}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-desktop-classic"></i>
                      Desktop Applications
                    </div>
                    <div className="stat-value">{isDesktopCount}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="stats-table">
                <h3>User Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-account-group"></i>
                      Total Users
                    </div>
                    <div className="stat-value">{dashboardData.totalUsers}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-account-check"></i>
                      Active Users
                    </div>
                    <div className="stat-value">{dashboardData.totalUsers}</div>
                  </div>
                  {/* <div className="stat-item">
                    <div className="stat-label">
                      <i className="mdi mdi-account-key"></i>
                      Legacy Users
                    </div>
                    <div className="stat-value">{dashboardData.legacyUsers}</div>
                  </div> */}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style>
        {`
          .page-content {
            padding: 24px;
          }

          .error-message {
            color: #dc3545;
            padding: 20px;
            text-align: center;
            background: #fff;
            border-radius: 8px;
            margin: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .stats-cards-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-bottom: 15px;
          }

          .stat-icon i {
            font-size: 28px;
          }

          .total-apps { background-color: #6f42c1; }
          .active-apps { background-color: #198754; }
          .total-users { background-color: #0d6efd; }
          .active-users { background-color: #6610f2; }

          .stat-info {
            width: 100%;
          }

          .stat-label {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #212529;
          }

          .statistics-container {
            margin-top: 30px;
          }

          .stats-table {
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            height: 100%;
          }

          .stats-table h3 {
            margin-bottom: 24px;
            color: #212529;
            font-size: 18px;
            font-weight: 600;
          }

          .stats-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
          }

          .stat-item .stat-label {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #212529;
            font-size: 14px;
            margin: 0;
          }

          .stat-item .stat-label i {
            font-size: 20px;
            color: #6c757d;
          }

          .stat-item .stat-value {
            font-size: 16px;
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .stats-cards-container {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 480px) {
            .stats-cards-container {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </MainLayout>
  );
};

Dashboard.propTypes = {
  getDashboardData: PropTypes.func.isRequired,
  dashboardData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

const mapStateToProps = (state) => ({
  dashboardData: state.Dashboard.dashboardData,
  loading: state.Dashboard.loading,
  error: state.Dashboard.error,
});

export default connect(mapStateToProps, { getDashboardData })(Dashboard);
