import React, { useState } from "react";
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
  Spinner,
  FormFeedback
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from "../../helpers/api_helper";
import CustomAlert from "../../components/Common/CustomAlert";

const AddAzure = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = new APIClient();

  document.title = "Add Azure Credential | Toray Admin Dashboard";

  const [formData, setFormData] = useState({
    credId: "",
    clientId: "",
    clientSecret: "",
    tenantId: "",
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.credId.trim()) {
      newErrors.credId = t("Credential ID is required");
    }
    if (!formData.clientId.trim()) {
      newErrors.clientId = t("Client ID is required");
    }
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = t("Client Secret is required");
    }
    if (!formData.tenantId.trim()) {
      newErrors.tenantId = t("Tenant ID is required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        const requestData = {
          cred_id: formData.credId,
          client_id: formData.clientId,
          client_secret: formData.clientSecret,
          tenant_id: formData.tenantId,
          status: formData.isActive ? "Active" : "Inactive"
        };

        const response = await api.post("/credentials", requestData);

        if (response?.data?.success) {
          navigate("/azure", {
            state: { message: t("Azure credential added successfully") }
          });
        } else {
          throw new Error(response?.data?.message || "Failed to add credential");
        }
      } catch (err) {
        console.error("Error adding credential:", err);
        setError(err.message || "Failed to add credential");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title">{t("Add Azure Credential")}</h4>
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
                          <Label for="credId">{t("Credential ID")}</Label>
                          <Input
                            type="text"
                            name="credId"
                            id="credId"
                            value={formData.credId}
                            onChange={handleInputChange}
                            invalid={!!errors.credId}
                          />
                          <FormFeedback>{errors.credId}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="clientId">{t("Client ID")}</Label>
                          <Input
                            type="text"
                            name="clientId"
                            id="clientId"
                            value={formData.clientId}
                            onChange={handleInputChange}
                            invalid={!!errors.clientId}
                          />
                          <FormFeedback>{errors.clientId}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="clientSecret">{t("Client Secret")}</Label>
                          <Input
                            type="password"
                            name="clientSecret"
                            id="clientSecret"
                            value={formData.clientSecret}
                            onChange={handleInputChange}
                            invalid={!!errors.clientSecret}
                          />
                          <FormFeedback>{errors.clientSecret}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="tenantId">{t("Tenant ID")}</Label>
                          <Input
                            type="text"
                            name="tenantId"
                            id="tenantId"
                            value={formData.tenantId}
                            onChange={handleInputChange}
                            invalid={!!errors.tenantId}
                          />
                          <FormFeedback>{errors.tenantId}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
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
                    </Row>

                    <div className="mt-4">
                      <Button type="submit" color="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : t("Add")}
                      </Button>
                      <Button
                        type="button"
                        color="secondary"
                        className="ms-2"
                        onClick={() => navigate("/azure")}
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

export default AddAzure; 