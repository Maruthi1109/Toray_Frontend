import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  FormFeedback
} from "reactstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from "../../helpers/api_helper";
import CustomAlert from "../../components/Common/CustomAlert";

const EditApplication = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const api = new APIClient();

  document.title = "Edit Application | Toray Admin Dashboard";

  const [formData, setFormData] = useState({
    appName: "",
    redirectUri: "",
    isActive: true,
    storeToken: false,
    internalLegacyUserId: false,
    isDesktop: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If we have application data in location state, use it
    if (location.state?.application) {
      setFormData(location.state.application);
    } else {
      // Otherwise fetch the application data
      fetchApplicationData();
    }
  }, [id]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      console.log("Fetching application with ID:", id);
  
      const response = await api.get(`/applications/${id}`);
      console.log("Full API response:", response);
  
      if (response?.data?.success) {
        const app = response.data.data;
        setFormData({
          appName: app.app_name,
          redirectUri: app.redirect_uri,
          isActive: app.status === "Active",
          storeToken: app.store_token,
          internalLegacyUserId: app.internal_legacy_user,
          isDesktop: app.desktop
        });
      } else {
        throw new Error("Failed to fetch application data");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch application data";
  
      console.error("Error fetching application:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.appName.trim()) {
      newErrors.appName = t("Application Name is required");
    }
    if (!formData.redirectUri.trim()) {
      newErrors.redirectUri = t("Redirect URI is required");
    } else if (!isValidUrl(formData.redirectUri)) {
      newErrors.redirectUri = t("Please enter a valid URL");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     try {
  //       setLoading(true);
  //       const requestData = {
  //         app_name: formData.appName,
  //         redirect_uri: formData.redirectUri,
  //         status: formData.isActive ? "Active" : "Inactive",
  //         store_token: formData.storeToken,
  //         internal_legacy_user: formData.internalLegacyUserId,
  //         desktop: formData.isDesktop
  //       };

  //       const response = await api.put(`/applications/${id}`, requestData);

  //       if (response?.data?.success) {
  //         navigate("/application", {
  //           state: { message: t("Application updated successfully") }
  //         });
  //       } else {
  //         throw new Error(response?.data?.message || "Failed to update application");
  //       }
  //     } catch (err) {
  //       console.error("Error updating application:", err);
  //       setError(err.message || "Failed to update application");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const requestData = {
          appName: formData.appName,
          redirectUri: formData.redirectUri,
          isActive: formData.isActive ? "Active" : "Inactive",
          storeToken: formData.storeToken,
          internalLegacyUserId: formData.internalLegacyUserId,
          isDesktop: formData.isDesktop
        };

        const response = await api.put(`/applications/${id}`, requestData);

        if (response?.data?.success) {
          navigate("/application", {
            state: { message: t("Application updated successfully") }
          });
        } else {
          throw new Error(response?.data?.message || "Failed to update application");
        }
      } catch (err) {
        setError(err.message || "Failed to update application");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formData.appName) {
    return (
      <MainLayout>
        <div className="page-content">
          <Container fluid>
            <div className="text-center">
              <Spinner color="primary" />
            </div>
          </Container>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">{t("Edit Application")}</h4>
                  </div>

                  {error && (
                    <CustomAlert 
                      color="danger" 
                      toggle={() => setError(null)}
                    >
                      {error}
                    </CustomAlert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="appName">{t("Application Name")}</Label>
                          <Input
                            type="text"
                            name="appName"
                            id="appName"
                            value={formData.appName}
                            onChange={handleInputChange}
                            invalid={!!errors.appName}
                          />
                          <FormFeedback>{errors.appName}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="redirectUri">{t("Redirect URI")}</Label>
                          <Input
                            type="text"
                            name="redirectUri"
                            id="redirectUri"
                            value={formData.redirectUri}
                            onChange={handleInputChange}
                            invalid={!!errors.redirectUri}
                          />
                          <FormFeedback>{errors.redirectUri}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={3}>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                          />
                          <Label check for="isActive">
                            {t("Active")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            name="storeToken"
                            id="storeToken"
                            checked={formData.storeToken}
                            onChange={handleInputChange}
                          />
                          <Label check for="storeToken">
                            {t("Store Token")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            name="internalLegacyUserId"
                            id="internalLegacyUserId"
                            checked={formData.internalLegacyUserId}
                            onChange={handleInputChange}
                          />
                          <Label check for="internalLegacyUserId">
                            {t("Internal Legacy User")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check>
                          <Input
                            type="checkbox"
                            name="isDesktop"
                            id="isDesktop"
                            checked={formData.isDesktop}
                            onChange={handleInputChange}
                          />
                          <Label check for="isDesktop">
                            {t("Desktop")}
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : t("Update")}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        className="ms-2"
                        onClick={() => navigate("/application")}
                      >
                        {t("Cancel")}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default EditApplication; 