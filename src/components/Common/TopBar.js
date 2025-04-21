import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import LanguageDropdown from "./TopbarDropdown/LanguageDropdown";
import ProfileMenu from "./TopbarDropdown/ProfileMenu";
import logoLight from "../../assets/images/logo-light.png";
import logoSm from "../../assets/images/logo-sm.png";

const TopBar = () => {
  return (
    <React.Fragment>
      <div className="navbar-header">
        <Container fluid>
          <Row>
            <Col>
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

            <Col>
              <div className="d-flex align-items-center">
                <div className="dropdown d-inline-block d-lg-none ms-2">
                  <button
                    type="button"
                    className="btn header-item noti-icon"
                    id="page-header-search-dropdown"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="mdi mdi-magnify"></i>
                  </button>
                </div>

                <LanguageDropdown />
                <ProfileMenu />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TopBar;
