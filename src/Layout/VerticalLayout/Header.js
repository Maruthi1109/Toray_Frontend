import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Images
import logoLight from "../../assets/images/logo-light.png";
import logoSm from "../../assets/images/logo-sm.png";

const Header = () => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header" style={{ background: '#1a73e8' }}>
          <Container fluid>
            <Row className="align-items-center">
              <Col sm={6}>
                <div className="page-title-box">
                  <h4 className="font-size-18 text-white">Toray Admin Dashboard</h4>
                </div>
              </Col>
              <Col sm={6}>
                <div className="float-end">
                  <Link to="/admin-login" className="d-flex align-items-center">
                    <img
                      className="rounded-circle header-profile-user me-2"
                      src={logoSm}
                      alt="Header Avatar"
                      style={{ width: '32px', height: '32px' }}
                    />
                    <span className="text-white">Admin Login</span>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;
