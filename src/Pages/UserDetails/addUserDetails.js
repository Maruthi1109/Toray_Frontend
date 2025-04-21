import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Container
} from "reactstrap";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { APIClient } from '../../helpers/api_helper';

const AddUserDetails = () => {
  const api = new APIClient();
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    login_id: '',
    email_id: '',
    map_user_azure_id: '',
  });

  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const responseData = response.data;
      if (responseData && responseData.success) {
        const appData = (responseData.data || []).map(app => ({
          id: app.id || app.app_id || app.appId,
          name: app.name || app.app_name || app.appName,
          app_id: app.id || app.app_id || app.appId,
          app_name: app.name || app.app_name || app.appName
        }));
        setApplications(appData);
      } else if (Array.isArray(responseData)) {
        const appData = responseData.map(app => ({
          id: app.id || app.app_id || app.appId,
          name: app.name || app.app_name || app.appName,
          app_id: app.id || app.app_id || app.appId,
          app_name: app.name || app.app_name || app.appName
        }));
        setApplications(appData);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppId) {
      alert("Please select an application");
      return;
    }

    const payload = {
      ...formData,
      app_id: parseInt(selectedAppId),
    };

    try {
      const response = await api.post('/app-users/map', payload);
      if (response?.data?.success) {
     
        navigate("/user-details");
      } else {
        
      }
    } catch (err) {
      console.error("Error adding user:", err);
      alert("An error occurred while adding the user.");
    }
  };

  return (
    <MainLayout>
      <div className="page-content mt-5">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">{t("Add User")}</h4>
                <div className="page-title-right">
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <Link to="/users">{t("Users")}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{t("Add User")}</BreadcrumbItem>
                  </Breadcrumb>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <div className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="first_name">{t("First Name")}</Label>
                        <Input
                          type="text"
                          name="first_name"
                          id="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="last_name">{t("Last Name")}</Label>
                        <Input
                          type="text"
                          name="last_name"
                          id="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="login_id">{t("Login ID")}</Label>
                        <Input
                          type="text"
                          name="login_id"
                          id="login_id"
                          value={formData.login_id}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="email_id">{t("Email")}</Label>
                        <Input
                          type="email"
                          name="email_id"
                          id="email_id"
                          value={formData.email_id}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="application_id">{t("Application")}</Label>
                        <Input
                          type="select"
                          name="application_id"
                          id="application_id"
                          value={selectedAppId}
                          onChange={(e) => setSelectedAppId(e.target.value)}
                        >
                          <option value="">{t("Select Application")}</option>
                          {applications.map((app) => (
                            <option key={app.id} value={app.id}>
                              {app.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="map_user_azure_id">
                          {t("Azure Map ID")}{" "}
                          <span className="text-muted">({t("Optional")})</span>
                        </Label>
                        <Input
                          type="text"
                          name="map_user_azure_id"
                          id="map_user_azure_id"
                          value={formData.map_user_azure_id}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-4">
                    <Button type="submit" color="primary" className="me-2">
                      {t("Add")}
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate("/user-details")}
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default AddUserDetails;
