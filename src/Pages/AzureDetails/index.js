import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  FormFeedback,
  Spinner,
  Alert,
  Badge,
  Fade,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from '../../helpers/api_helper';

const api = new APIClient();

const AzureDetails = () => {
  const { t } = useTranslation();
  document.title = "Azure Details | Toray Admin Dashboard";

  // State for credentials data
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [filters, setFilters] = useState({
    status: "all"
  });

  // State for modal
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // State for credential form
  const [formData, setFormData] = useState({
    clientSecret: "",
    tenantId: "",
    clientId: "",
    sessionSecret: "",
    isActive: true,
    azureAuthority: "https://login.microsoftonline.com/"
  });

  const [errors, setErrors] = useState({});

  // Toggle modal
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setEditingId(null);
      setFormData({
        clientSecret: "",
        tenantId: "",
        clientId: "",
        sessionSecret: "",
        isActive: true,
        azureAuthority: "https://login.microsoftonline.com/"
      });
      setErrors({});
    }
  };

  // Filter credentials
  const filteredCredentials = credentials.filter(cred => {
    return (
      filters.status === "all" || 
      (filters.status === "active" && cred.is_active) ||
      (filters.status === "inactive" && !cred.is_active)
    );
  });

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCredentials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCredentials.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "all"
    });
    setCurrentPage(1);
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = t("Client Secret is required");
    }
    if (!formData.tenantId.trim()) {
      newErrors.tenantId = t("Tenant ID is required");
    }
    if (!formData.clientId.trim()) {
      newErrors.clientId = t("Client ID is required");
    }
    if (!formData.sessionSecret.trim()) {
      newErrors.sessionSecret = t("Session Secret is required");
    }
    if (!formData.azureAuthority.trim()) {
      newErrors.azureAuthority = t("Azure Authority is required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
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

  // Fetch credentials data
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/credentials');
      const responseData = response.data;
      console.log('API Response (data):', responseData);
      
      if (responseData && responseData.success) {
        setCredentials(responseData.data || []);
      } else {
        throw new Error((responseData && responseData.message) || 'Failed to fetch credentials');
      }
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError(err.message || 'Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCredentials();
    
    // Display API connection info in console
    console.info('API Connection: Using proxy setup - requests to /api will be forwarded to http://localhost:3000/api');
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Convert form data to API format
        const credData = {
          clientSecret: formData.clientSecret,
          tenantId: formData.tenantId,
          clientId: formData.clientId,
          session_secret: formData.sessionSecret,
          is_active: formData.isActive,
          azureAuthority: formData.azureAuthority
        };
        
        if (editingId) {
          const response = await api.put(`/credentials/${editingId}`, credData);
          console.log('Update Response:', response);
          
          const responseData = response.data;
          if (responseData && responseData.success) {
            await fetchCredentials();
            toggle();
          } else {
            throw new Error((responseData && responseData.message) || 'Failed to update credential');
          }
        } else {
          const response = await api.post('/credentials', credData);
          console.log('Add Response:', response);
          
          const responseData = response.data;
          if (responseData && responseData.success) {
            await fetchCredentials();
            toggle();
          } else {
            throw new Error((responseData && responseData.message) || 'Failed to add credential');
          }
        }
      } catch (err) {
        console.error('Error saving credential:', err);
        setError(err.message || 'Failed to save credential');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (cred) => {
    setEditingId(cred.credId);
    setFormData({
      clientSecret: cred.clientSecret || "",
      tenantId: cred.tenantId || "",
      clientId: cred.clientId || "",
      sessionSecret: cred.session_secret || "",
      isActive: cred.is_active,
      azureAuthority: cred.azureAuthority || "https://login.microsoftonline.com/"
    });
    setModal(true);
  };

  // Handle delete button click
  const handleDelete = (credId) => {
    setDeleteId(credId);
    setDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/credentials/${deleteId}`);
      console.log('Delete Response:', response);
      
      const responseData = response.data;
      if (responseData && responseData.success) {
        await fetchCredentials();
        setDeleteModal(false);
      } else {
        throw new Error((responseData && responseData.message) || 'Failed to delete credential');
      }
    } catch (err) {
      console.error('Error deleting credential:', err);
      setError(err.message || 'Failed to delete credential');
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  // Function to mask sensitive information
  const maskValue = (value) => {
    if (!value) return "-";
    return value.substring(0, 4) + "..." + value.substring(value.length - 4);
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
                    <h4 className="common_title card-title mb-0">{t("Azure Credentials")}</h4>
                    <Button color="primary" onClick={toggle}>
                      <i className="bx bx-plus me-1"></i> {t("Add Credential")}
                    </Button>
                  </div>

                  {/* Filter Section */}
                  <Row className="mb-3">
                    <Col md={4}>
                      <Input 
                        type="select" 
                        name="status" 
                        value={filters.status} 
                        onChange={handleFilterChange}
                      >
                        <option value="all">{t("All Status")}</option>
                        <option value="active">{t("Active")}</option>
                        <option value="inactive">{t("Inactive")}</option>
                      </Input>
                    </Col>
                    <Col md={2}>
                      <Button color="secondary" onClick={clearFilters}>
                        <i className="bx bx-reset me-1"></i> {t("Clear")}
                      </Button>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="me-2">{t("Items per page")}:</span>
                        <Input 
                          type="select" 
                          name="itemsPerPage"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          style={{ width: "70px" }}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </Input>
                      </div>
                    </Col>
                  </Row>

                  {error && (
                    <Fade in={true} timeout={300}>
                      <Alert color="danger" className="mb-4" toggle={() => setError(null)}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {loading ? (
                    <div className="text-center">
                      <Spinner color="primary" />
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table className="table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>{t("Client ID")}</th>
                              <th>{t("Tenant ID")}</th>
                              <th>{t("Client Secret")}</th>
                              <th>{t("Session Secret")}</th>
                              <th>{t("Azure Authority")}</th>
                              <th>{t("Status")}</th>
                              <th>{t("Created At")}</th>
                              <th>{t("Actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.length === 0 ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  {filteredCredentials.length === 0 
                                    ? t("No credentials found") 
                                    : t("No matching credentials found")}
                                </td>
                              </tr>
                            ) : (
                              currentItems.map((cred) => (
                                <tr key={cred.credId}>
                                  <td>{maskValue(cred.clientId)}</td>
                                  <td>{maskValue(cred.tenantId)}</td>
                                  <td>{maskValue(cred.clientSecret)}</td>
                                  <td>{maskValue(cred.session_secret)}</td>
                                  <td>{cred.azureAuthority || "-"}</td>
                                  <td>
                                    <Badge color={cred.is_active ? "success" : "danger"}>
                                      {cred.is_active ? t("Active") : t("Inactive")}
                                    </Badge>
                                  </td>
                                  <td>{formatDate(cred.created_at)}</td>
                                  <td>
                                    <Button
                                      color="info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleEdit(cred)}
                                    >
                                      <i className="bx bx-edit-alt"></i>
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDelete(cred.credId)}
                                    >
                                      <i className="bx bx-trash"></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {filteredCredentials.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div>
                            {t("Showing")} {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCredentials.length)} {t("of")} {filteredCredentials.length} {t("entries")}
                          </div>
                          <Pagination>
                            <PaginationItem disabled={currentPage === 1}>
                              <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                            </PaginationItem>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                              <PaginationItem key={number} active={currentPage === number}>
                                <PaginationLink onClick={() => handlePageChange(number)}>
                                  {number}
                                </PaginationLink>
                              </PaginationItem>
                            ))}
                            
                            <PaginationItem disabled={currentPage === totalPages}>
                              <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                            </PaginationItem>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Add/Edit Modal */}
          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}>
              {editingId ? t("Edit Credential") : t("Add Credential")}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Row>
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
                      <Label for="sessionSecret">{t("Session Secret")}</Label>
                      <Input
                        type="password"
                        name="sessionSecret"
                        id="sessionSecret"
                        value={formData.sessionSecret}
                        onChange={handleInputChange}
                        invalid={!!errors.sessionSecret}
                      />
                      <FormFeedback>{errors.sessionSecret}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="azureAuthority">{t("Azure Authority")}</Label>
                      <Input
                        type="text"
                        name="azureAuthority"
                        id="azureAuthority"
                        value={formData.azureAuthority}
                        onChange={handleInputChange}
                        invalid={!!errors.azureAuthority}
                      />
                      <FormFeedback>{errors.azureAuthority}</FormFeedback>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup check>
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
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary">
                  {editingId ? t("Update") : t("Add")}
                </Button>
                <Button type="button" color="secondary" onClick={toggle}>
                  {t("Cancel")}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
            <ModalHeader toggle={() => setDeleteModal(false)}>
              {t("Confirm Delete")}
            </ModalHeader>
            <ModalBody>
              {t("Are you sure you want to delete this credential?")}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={handleDeleteConfirm}>
                {t("Delete")}
              </Button>
              <Button color="secondary" onClick={() => setDeleteModal(false)}>
                {t("Cancel")}
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>

      <style>
        {`
                   
          .module-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #495057;
            margin-bottom: 0;
          }
          
          .card-body {
            padding: 1.5rem;
          }
        `}
      </style>
    </MainLayout>
  );
};

export default AzureDetails; 