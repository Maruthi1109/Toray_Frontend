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
  Spinner,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink,
  InputGroup,
  InputGroupText
} from "reactstrap";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import { APIClient } from '../../helpers/api_helper';
import { useNavigate, useLocation } from "react-router-dom";
import CustomAlert from "../../components/Common/CustomAlert";

const api = new APIClient();

const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  document.title = "Applications | Toray Admin Dashboard";

  // State for applications data
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [filters, setFilters] = useState({
    appName: "",
    status: "all"
  });

  // State for delete confirmation
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // State for application form
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
    // Clear location state after displaying message
    if (location.state?.message) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state, navigate]);

  // Filter applications only when we have data and not loading
  const filteredApplications = !loading ? applications.filter(app => {
    if (!app || !app.app_name) return false;
    return (
      app.app_name.toLowerCase().includes(filters.appName.toLowerCase()) &&
      (filters.status === "all" || 
       (filters.status === "active" && app.status === "Active") ||
       (filters.status === "inactive" && app.status === "Inactive"))
    );
  }) : [];

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

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
      appName: "",
      status: "all"
    });
    setCurrentPage(1);
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

  // Fetch applications data
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/applications');
      console.log('API Response:', response);

      // Check if response has the expected structure
      if (response?.data?.success && Array.isArray(response.data.data)) {
        const applications = response.data.data.map(app => ({
          app_id: app.app_id || app.appId || '',
          app_name: app.app_name || app.appName || '',
          redirect_uri: app.redirect_uri || app.redirectUri || '',
          status: (app.is_active || app.isActive) ? "Active" : "Inactive",
          store_token: app.store_token || app.storeToken || false,
          internal_legacy_user: app.internalLegacyUserId || app.internal_legacy_user_id || false,
          desktop: app.isDesktop || false,
          created_at: (app.created_at || app.createdAt || '').split('T')[0],
          updated_at: (app.updated_at || app.updatedAt || '').split('T')[0]
        }));
        setApplications(applications);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error.message || 'Failed to fetch applications');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback data in development');
        setApplications([
          {
            app_id: '1',
            app_name: 'Demo App 1',
            redirect_uri: 'https://example.com/callback',
            status: 'Active',
            store_token: false,
            internal_legacy_user: false,
            desktop: false,
            created_at: '10-04-2025',
            updated_at: '10-04-2025'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Initial data fetch
  useEffect(() => {
    fetchApplications();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        
        const requestData = {
          app_name: formData.appName,
          redirect_uri: formData.redirectUri,
          status: formData.isActive ? "Active" : "Inactive",
          store_token: formData.storeToken,
          internal_legacy_user: formData.internalLegacyUserId,
          desktop: formData.isDesktop
        };

        if (deleteId) {
          const response = await api.delete(`/applications/${deleteId}`);
          console.log('Delete Response:', response);
          
          if (response?.data?.success) {
            await fetchApplications();
            setDeleteModal(false);
            setSuccessMessage(t("Application deleted successfully"));
          } else {
            throw new Error(response?.data?.message || 'Failed to delete application');
          }
        } else {
          const response = await api.post('/applications', requestData);
          console.log('Add Response:', response);
          
          if (response?.data?.success) {
            await fetchApplications();
            navigate('/applications', {
              state: { message: t("Application added successfully") }
            });
          } else {
            throw new Error(response?.data?.message || 'Failed to add application');
          }
        }
      } catch (err) {
        console.error('Error saving application:', err);
        setError(err.message || 'Failed to save application');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (application) => {
    // Transform the data to match form field names
    const formattedData = {
      appName: application.app_name,
      redirectUri: application.redirect_uri,
      isActive: application.status === "Active",
      storeToken: application.store_token,
      internalLegacyUserId: application.internal_legacy_user,
      isDesktop: application.desktop
    };
    
    navigate(`/application/edit/${application.app_id}`, {
      state: { application: formattedData }
    });
  };

  // Handle delete button click
  const handleDelete = (appId) => {
    setDeleteId(appId);
    setDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/applications/${deleteId}`);
      console.log('Delete Response:', response);
      
      const responseData = response.data;
      if (responseData && responseData.success) {
        await fetchApplications();
        setDeleteModal(false);
      } else {
        throw new Error((responseData && responseData.message) || 'Failed to delete application');
      }
    } catch (err) {
      console.error('Error deleting application:', err);
      setError(err.message || 'Failed to delete application');
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
                    <h4 className="common_title card-title mb-0">{t("Applications")}</h4>
                    <Button color="primary" onClick={() => navigate('/application/add')}>
                      <i className="bx bx-plus me-1"></i> {t("Add Application")}
                    </Button>
                  </div>

                  {successMessage && (
                    <CustomAlert 
                      color="success" 
                      className="mb-4" 
                      toggle={() => setSuccessMessage(null)}
                    >
                      {successMessage}
                    </CustomAlert>
                  )}

                  {/* Filter Section */}
                  <Row className="mb-4">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroupText>
                          <i className="bx bx-search"></i>
                        </InputGroupText>
                        <Input 
                          type="text" 
                          name="appName" 
                          value={filters.appName} 
                          onChange={handleFilterChange} 
                          placeholder={t("Search by name...")}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={3}>
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
                    <Col md={3}>
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
                    <CustomAlert 
                      color="danger" 
                      className="mb-4" 
                      toggle={() => setError(null)}
                    >
                      {error}
                    </CustomAlert>
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
                              <th>{t("App Name")}</th>
                              <th>{t("Redirect URI")}</th>
                              <th>{t("Status")}</th>
                              <th>{t("Store Token")}</th>
                              <th>{t("Internal Legacy User")}</th>
                              <th>{t("Desktop")}</th>
                              <th>{t("Created At")}</th>
                              <th>{t("Updated At")}</th>
                              <th>{t("Actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.length === 0 ? (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  {filteredApplications.length === 0 
                                    ? t("No applications found") 
                                    : t("No matching applications found")}
                                </td>
                              </tr>
                            ) : (
                              currentItems.map((app) => (
                                <tr key={app.app_id}>
                                  <td>{app.app_name}</td>
                                  <td>{app.redirect_uri}</td>
                                  <td>
                                    <Badge color={app.status === "Active" ? "success" : "danger"}>
                                      {app.status}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color={app.store_token ? "success" : "secondary"}>
                                      {app.store_token ? t("Yes") : t("No")}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color={app.internal_legacy_user ? "success" : "secondary"}>
                                      {app.internal_legacy_user ? t("Yes") : t("No")}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge color={app.desktop ? "success" : "secondary"}>
                                      {app.desktop ? t("Yes") : t("No")}
                                    </Badge>
                                  </td>
                                  <td>{app.created_at}</td>
                                  <td>{app.updated_at}</td>
                                  <td>
                                    <Button
                                      color="info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleEdit(app)}
                                    >
                                      <i className="bx bx-edit-alt"></i>
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDelete(app.app_id)}
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
                      {filteredApplications.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div>
                            {t("Showing")} {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredApplications.length)} {t("of")} {filteredApplications.length} {t("entries")}
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

          {/* Delete Confirmation Modal */}
          <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
            <ModalHeader toggle={() => setDeleteModal(false)}>
              {t("Confirm Delete")}
            </ModalHeader>
            <ModalBody>
              {t("Are you sure you want to delete this application?")}
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
    </MainLayout>
  );
};

export default Application; 