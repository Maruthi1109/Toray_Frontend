import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
  Progress
} from "reactstrap";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from '../../helpers/api_helper';
import { useNavigate } from "react-router-dom";

const api = new APIClient();

const BulkUpload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  document.title = "Bulk Upload | Toray Admin Dashboard";

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('applications');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError(t('Please upload a CSV file'));
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    setError(t('Please select a file to upload'));
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess(null);
  setProgress(0);

  try {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const endpoint = uploadType === 'applications' ? '/applications/upload' : '/app-users/upload';

    const response = await api.post(endpoint, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      }
    });

    if (response.data) {
      const inserted = response.data.result?.insertedCount || 0;
      const failed = response.data.result?.failedCount || 0;
      const error = response.data.result.failedRows.map(row => row.error).filter(Boolean);
      if (failed > 0 && error.length > 0) {        
        const errorText = error.join('; ');
        setError(errorText);
        return;
      }
  let successMessage = '';

  if (uploadType === 'applications') {
    successMessage = t(`Applications imported successfully. ${inserted} rows inserted and ${failed} rows failed.`);
    navigate('/application', {
      state: { message: successMessage }
    });
  } else {
    successMessage = t(`Users imported successfully. ${inserted} rows inserted and ${failed} rows failed.`);
    navigate('/user-details', {
      state: { message: successMessage },
      replace: true // ensures message stays in state when navigating back
    });
  }

  setSuccess(successMessage);

    } else {
      throw new Error(response.data?.error || t('Upload failed'));
    }
  } catch (err) {
    console.error('Upload error:', err);
    setError(err.message || t('Upload failed'));
  } finally {
    setLoading(false);
  }
};

  const handleDownloadTemplate = async () => {
    setError(null);
    setSuccess(null);
  
    const endpoint =
      uploadType === 'applications'
        ? '/applications/template'
        : '/app-users/template';
  
    try {
      const response = await api.get(endpoint, {
        responseType: 'blob', // Important to handle binary files
      });
  
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        uploadType === 'applications'
          ? 'applications_template.csv'
          : 'application-user-template.csv'
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      setSuccess(t('Template downloaded successfully'));
    } catch (error) {
      console.error("Template download error:", error);
      setError(t("Failed to download template"));
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
                    <h4 className="card-title">{t("Bulk Upload")}</h4>
                  </div>

                  {error && (
                    <Alert color="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert color="success" className="mb-4">
                      {success}
                    </Alert>
                  )}

                  <Form>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="uploadType">{t("Upload Type")}</Label>
                          <Input
                            type="select"
                            name="uploadType"
                            id="uploadType"
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value)}
                          >
                            <option value="applications">{t("Applications")}</option>
                            <option value="users">{t("Users")}</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="file">{t("Select CSV File")}</Label>
                          <Input
                            type="file"
                            name="file"
                            id="file"
                            accept=".csv"
                            onChange={handleFileChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    {selectedFile && (
                      <Row>
                        <Col md={6}>
                          <div className="mt-3">
                            <p>{t("Selected File")}: {selectedFile.name}</p>
                          </div>
                        </Col>
                      </Row>
                    )}

                    {progress > 0 && (
                      <Row>
                        <Col md={6}>
                          <div className="mt-3">
                            <Progress value={progress}>{progress}%</Progress>
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col md={6}>
                        <div className="mt-3">
                          <Button
                            color="primary"
                            onClick={handleUpload}
                            disabled={loading || !selectedFile}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" className="me-2" />
                                {t("Uploading...")}
                              </>
                            ) : (
                              t("Upload")
                            )}
                          </Button> 

                          <Row>
                <Col md={6}>
                  <div className="mt-3">
                    <Button
                      color="secondary"
                      onClick={handleDownloadTemplate}
                      disabled={loading}
                    >
                      {t("Download Template")}
                   </Button>
                        </div>
                      </Col>
                    </Row>

                      
                        </div>
                      </Col>
                    </Row>
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

export default BulkUpload; 