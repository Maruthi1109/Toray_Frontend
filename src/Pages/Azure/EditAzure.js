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
  Spinner,
  FormFeedback
} from "reactstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from "../../helpers/api_helper";
import CustomAlert from "../../components/Common/CustomAlert";

const EditAzure = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const api = new APIClient();

  document.title = "Edit Azure Credential | Toray Admin Dashboard";

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

  useEffect(() => {
    // If we have credential data in location state, use it
    if (location.state?.credential) {
      const cred = location.state.credential;
      setFormData({
        credId: cred.cred_id,
        clientId: cred.client_id,
        clientSecret: "", // Don't show the secret
        tenantId: cred.tenant_id,
        isActive: cred.status === "Active"
      });
    } else {
      // Otherwise fetch the credential data
      fetchCredentialData();
    }
  }, [id]);

  const fetchCredentialData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/credentials/${id}`);
      if (response?.data?.success) {
        const cred = response.data.data;
        setFormData({
          credId: cred.cred_id,
          clientId: cred.client_id,
          clientSecret: "", // Don't show the secret
          tenantId: cred.tenant_id,
          isActive: cred.status === "Active"
        });
      } else {
        throw new Error("Failed to fetch credential data");
      }
    } catch (err) {
      console.error("Error fetching credential:", err);
      setError(err.message || "Failed to fetch credential data");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientId.trim()) {
      newErrors.clientId = t("Client ID is required");
    }
    if (!formData.tenantId.trim()) {
      newErrors.tenantId = t("Tenant ID is required");
    }
    // Only validate client secret if it's being updated
    if (formData.clientSecret && !formData.clientSecret.trim()) {
      newErrors.clientSecret = t("Client Secret is required if provided");
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
          client_id: formData.clientId,
          tenant_id: formData.tenantId,
          status: formData.isActive ? "Active" : "Inactive"
        };

        // Only include client secret if it's been updated
        if (formData.clientSecret) {
          requestData.client_secret = formData.clientSecret;
        }

        const response = await api.put(`/credentials/${id}`, requestData);

        if (response?.data?.success) {
          navigate("/azure", {
            state: { message: t("Azure credential updated successfully") }
          });
        } else {
          throw new Error(response?.data?.message || "Failed to update credential");
        }
      } catch (err) {
        console.error("Error updating credential:", err);
        setError(err.message || "Failed to update credential");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formData.credId) {
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
                    <h4 className="card-title">{t("Edit Azure Credential")}</h4>
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
                            disabled
                          />
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
                          <Label for="clientSecret">
                            {t("Client Secret")} <small>({t("Leave blank to keep current")})</small>
                          </Label>
                          <Input
                            type="password"
                            name="clientSecret"
                            id="clientSecret"
                            value={formData.clientSecret}
                            onChange={handleInputChange}
                            invalid={!!errors.clientSecret}
                            placeholder={t("Enter new secret to update")}
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
                        {loading ? <Spinner size="sm" /> : t("Update")}
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

export default EditAzure; 