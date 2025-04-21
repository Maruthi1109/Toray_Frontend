import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import withRouter from "../withRouter";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <div className="d-flex align-items-center">
            <i className="mdi mdi-account-circle text-primary me-1" style={{ fontSize: "24px" }}></i>
            <span className="d-none d-xl-inline-block ms-2 me-1 fw-medium font-size-15">Admin</span>
            <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </div>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem>
            <i className="mdi mdi-account-circle text-muted me-2"></i>
            {t("Profile")}
          </DropdownItem>
          <DropdownItem>
            <i className="mdi mdi-cog text-muted me-2"></i>
            {t("Settings")}
          </DropdownItem>
          <div className="dropdown-divider"></div>
          <DropdownItem onClick={handleLogout} className="text-danger">
            <i className="mdi mdi-power text-danger me-2"></i>
            {t("Logout")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

const mapStatetoProps = state => {
  const { error, success } = state.profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
