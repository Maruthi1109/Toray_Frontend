import React from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { Container } from "reactstrap";

//Import Images
import logoSm from "../../assets/images/logo-sm.png";
import logoDark from "../../assets/images/logo-dark.png";

const SidebarContent = () => {
  return (
    <React.Fragment>
      <div className="vertical-menu" style={{ background: '#1a73e8' }}>
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" height="20" />
            </span>
          </Link>
        </div>

        <SimpleBar className="h-100">
          <Container fluid>
            <div id="sidebar-menu">
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">Main</li>

                <li>
                  <Link to="/dashboard" className="waves-effect">
                    <i className="bx bx-home-circle"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link to="/application-onboarding" className="waves-effect">
                    <i className="bx bx-window-alt"></i>
                    <span>Application Onboarding</span>
                  </Link>
                </li>

                <li>
                  <Link to="/user-onboarding" className="waves-effect">
                    <i className="bx bx-user-circle"></i>
                    <span>User Onboarding</span>
                  </Link>
                </li>

                <li>
                  <Link to="/azure-onboarding" className="waves-effect">
                    <i className="bx bx-cloud"></i>
                    <span>Azure Onboarding</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Container>
        </SimpleBar>
      </div>
    </React.Fragment>
  );
};

export default SidebarContent; 