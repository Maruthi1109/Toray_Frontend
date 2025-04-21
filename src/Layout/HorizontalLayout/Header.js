import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { withTranslation } from "react-i18next";
import logoLight from "../../assets/images/logo-light.png";
import logoSm from "../../assets/images/logo-sm.png";

// Import components
import LanguageDropdown from "../../components/Common/TopbarDropdown/LanguageDropdown";
import ProfileMenu from "../../components/Common/TopbarDropdown/ProfileMenu";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";

const Header = (props) => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <Container fluid>
            <Row className="align-items-center">
              {/* Logo */}
              <Col xs={3} className="px-0">
                <div className="navbar-brand-box">
                  <Link to="/" className="logo">
                    <span className="logo-lg">
                      <img src={logoLight} alt="" height="50" />
                    </span>
                    <span className="logo-sm">
                      <img src={logoSm} alt="" height="30" />
                    </span>
                  </Link>
                </div>
              </Col>

              {/* Application Name */}
              <Col xs={6} className="text-center px-0">
                <div className="app-name-container d-flex align-items-center justify-content-center h-100">
                  <h3 className="mb-0 fw-bold text-primary">Toray Admin Dashboard</h3>
                </div>
              </Col>

              {/* Right Menu */}
              <Col xs={3} className="px-0">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <LanguageDropdown />
                  <ProfileMenu />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </header>

      <style>
        {`
          .navbar-header {
            height: 70px;
            padding: 0 15px;
            background: #ffffff;
            border-bottom: 1px solid #e9e9ef;
          }
          .navbar-brand-box {
            padding: 0 1.5rem;
            text-align: center;
            width: auto;
          }
          .app-name-container {
            min-height: 70px;
          }
          .logo {
            display: block;
            line-height: 70px;
            text-align: center;
          }
          .logo img {
            vertical-align: middle;
          }
        `}
      </style>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
