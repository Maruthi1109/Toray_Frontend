import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Alert,
  Fade,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from '../../helpers/api_helper';

const api = new APIClient();

const AddEditApplication = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  document.title = `${isEditing ? "Edit" : "Add"} Application | Toray Admin Dashboard`;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    appName: "",
    redirectUri: "",
    isActive: true,
    storeToken: false,
    internalLegacyUserId: false,
    isDesktop: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchApplicationData();
    }
  }, [id]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/applications/${id}`);
      const responseData = response.data;
  
      if (responseData.success && responseData.data) {
        const app = responseData.data;
        setFormData({
          appName: app.app_name,
          redirectUri: app.redirect_uri,
          isActive: app.status === "Active",
          storeToken: app.store_token,
          internalLegacyUserId: app.internal_legacy_user,
          isDesktop: app.desktop
        });
      } else {
        throw new Error(responseData.message || 'Failed to fetch application data');
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.message || 'Failed to fetch application');
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        setError(null);

        const response = isEditing
          ? await api.put(`/applications/${id}`, formData)
          : await api.post('/applications', formData);

        if (response.status == 200 || response.status == 201) {
          navigate('/application', { 
            state: { 
              message: `Application successfully ${isEditing ? 'updated' : 'created'}!`,
              type: 'success'
            }
          });
        } else {
          throw new Error(response.message || `Failed to ${isEditing ? 'update' : 'create'} application`);
        }
      } catch (err) {
        console.error('Error saving application:', err);
        setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} application`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="page-content">
        <Container fluid>
          {/* Breadcrumb */}
          <Row>
            <Col xs={12}>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">
                  {isEditing ? t("Edit Application") : t("Add Application")}
                </h4>
                <div className="page-title-right">
                  <Breadcrumb>
                    <BreadcrumbItem>
                      <Link to="/application">{t("Applications")}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                      {isEditing ? t("Edit Application") : t("Add Application")}
                    </BreadcrumbItem>
                  </Breadcrumb>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  {error && (
                    <Fade in={true} timeout={300}>
                      <Alert color="danger" className="mb-4" toggle={() => setError(null)}>
                        {error}
                      </Alert>
                    </Fade>
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
                            placeholder={t("Enter application name")}
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
                            placeholder={t("Enter redirect URI")}
                          />
                          <FormFeedback>{errors.redirectUri}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col md={3}>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            name="isActive"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                          />
                          <Label for="isActive" check>
                            {t("Active")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            name="storeToken"
                            id="storeToken"
                            checked={formData.storeToken}
                            onChange={handleInputChange}
                          />
                          <Label for="storeToken" check>
                            {t("Store Token")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            name="internalLegacyUserId"
                            id="internalLegacyUserId"
                            checked={formData.internalLegacyUserId}
                            onChange={handleInputChange}
                          />
                          <Label for="internalLegacyUserId" check>
                            {t("Internal Legacy User")}
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup check className="mb-3">
                          <Input
                            type="checkbox"
                            name="isDesktop"
                            id="isDesktop"
                            checked={formData.isDesktop}
                            onChange={handleInputChange}
                          />
                          <Label for="isDesktop" check>
                            {t("Desktop")}
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mt-4 text-end">
                      <Button type="button" color="secondary" className="me-2" onClick={() => navigate('/application')}>
                        {t("Cancel")}
                      </Button>
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading ? (
                          <span>
                            <i className="bx bx-loader bx-spin me-1"></i>
                            {t("Saving...")}
                          </span>
                        ) : (
                          isEditing ? t("Update") : t("Save")
                        )}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style>
        {`
          .page-title-box {
            padding: 1.5rem 0;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #e9e9ef;
          }

          .page-title-box h4 {
            font-size: 1.25rem;
            margin: 0;
          }

          .page-title-right {
            float: right;
          }

          .breadcrumb {
            margin-bottom: 0;
            padding: 0;
            background: transparent;
          }

          .card {
            margin-bottom: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }

          .card-body {
            padding: 1.5rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-check {
            padding-left: 1.75rem;
          }
        `}
      </style>
    </MainLayout>
  );
};

export default AddEditApplication; 