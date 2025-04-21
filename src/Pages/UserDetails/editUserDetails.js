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
import { Link, useNavigate, useParams } from "react-router-dom";
import { APIClient } from '../../helpers/api_helper';

const EditUserDetails = () => {
  const api = new APIClient();
  const { id } = useParams(); // User ID from route
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    login_id: '',
    email_id: '',
    map_user_azure_id: '',
  });

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      const responseData = response.data;
      const appData = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      const formatted = appData.map(app => ({
        id: app.id || app.app_id || app.appId,
        name: app.name || app.app_name || app.appName,
      }));

      setApplications(formatted);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // Fetch existing user details for editing
//   const fetchUserDetails = async () => {
//     try {
//       const response = await api.get(`/app-users/application/${id}`);
//       if (response?.data?.success) {
//         const user = response.data.data;
//         setFormData({
//           first_name: user.first_name || '',
//           last_name: user.last_name || '',
//           login_id: user.login_id || '',
//           email_id: user.email_id || '',
//           map_user_azure_id: user.map_user_azure_id || '',
//         });
//         setSelectedAppId(user.app_id?.toString() || '');
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
    //   };
    
    // Fetch existing user details for editing
const fetchUserDetails = async () => {
  try {
    const response = await api.get(`/app-users/application/${id}`);
    if (response?.data?.success && Array.isArray(response.data.data)) {
      const users = response.data.data;
      const user = users.find(u => u.app_user_id.toString() === id);

      if (user) {
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          login_id: user.login_id || '',
          email_id: user.email_id || '',
          map_user_azure_id: user.map_user_azure_id || '',
        });
        setSelectedAppId(user.app_id?.toString() || '');
      } else {
        console.warn("User not found in list.");
      }
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};


  useEffect(() => {
  
    if (id) {
        fetchUserDetails();
         fetchApplications()
    }
  }, [id]);

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
      const response = id
        ? await api.put(`/app-users/${id}`, payload)
        : await api.post('/app-users/map', payload);

      if (response?.data?.success) {
        navigate("/user-details");
      } else {
        alert("Failed to save user");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      alert("An error occurred while saving the user.");
    }
  };

  return (
    <MainLayout>
      <div className="page-content mt-5">
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">{id ? t("Edit User") : t("Add User")}</h4>
                <div className="page-title-right">
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <Link to="/users">{t("Users")}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>{id ? t("Edit User") : t("Add User")}</BreadcrumbItem>
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
                      {id ? t("Update") : t("Add")}
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

export default EditUserDetails;
