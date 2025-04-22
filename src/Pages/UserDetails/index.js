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
  InputGroup,
  InputGroupText
} from "reactstrap";
import { useTranslation } from "react-i18next";
import MainLayout from "../../Layout/MainLayout";
import {APIClient } from '../../helpers/api_helper'
import { useNavigate } from "react-router-dom";

const api = new APIClient();

const UserDetails = () => {
  const { t } = useTranslation();
  const location = useNavigate();
  document.title = "User Details | Toray Admin Dashboard";

  // State for users data
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [filters, setFilters] = useState({
    searchQuery: "",
    applicationId: ""
  });

  // State for modal
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // State for user form
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    login_id: "",
    email_id: "",
    application_id: "",
    map_user_azure_id: ""
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate()

  // Toggle modal
  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setEditingId(null);
      setFormData({
        first_name: "",
        last_name: "",
        login_id: "",
        email_id: "",
        application_id: "",
        map_user_azure_id: ""
      });
      setErrors({});
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !filters.searchQuery || 
      user.first_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.login_id.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.email_id.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesApp = !filters.applicationId ||
      user.app_name?.toLowerCase() === filters.applicationId.toLowerCase();
    return matchesSearch && matchesApp;
  });

  // Paginate results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
      searchQuery: "",
      applicationId: ""
    });
    setCurrentPage(1);
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = t("First Name is required");
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = t("Last Name is required");
    }
    if (!formData.login_id.trim()) {
      newErrors.login_id = t("Login ID is required");
    }
    if (!formData.email_id.trim()) {
      newErrors.email_id = t("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = t("Email is invalid");
    }
    if (!formData.application_id) {
      newErrors.application_id = t("Application is required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await api.get('/users');
      const responseData = response.data;
  
      console.log('API Response (full):', response);
      console.log('Parsed response data:', responseData);
  
      if (responseData && responseData.success) {
        setUsers(responseData.data || []);
        console.log('Users state:', responseData.data);
      } else {
        throw new Error(responseData?.message || 'Failed to fetch users');
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch users';
  
      console.error('Error fetching users:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for dropdown
  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      console.log('Applications Response:', response);
      
      const responseData = response.data;
      if (responseData && responseData.success) {
        // Transform the data to have consistent property names
        const appData = (responseData.data || []).map(app => ({
          id: app.id || app.app_id || app.appId,
          name: app.name || app.app_name || app.appName,
          app_id: app.id || app.app_id || app.appId,
          app_name: app.name || app.app_name || app.appName
        }));
        setApplications(appData);
      } else if (responseData && Array.isArray(responseData)) {
        // Handle case where the API returns an array directly
        const appData = responseData.map(app => ({
          id: app.id || app.app_id || app.appId,
          name: app.name || app.app_name || app.appName,
          app_id: app.id || app.app_id || app.appId,
          app_name: app.name || app.app_name || app.appName
        }));
        setApplications(appData);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        // Handle nested data structure
        const appData = responseData.data.map(app => ({
          id: app.id || app.app_id || app.appId,
          name: app.name || app.app_name || app.appName,
          app_id: app.id || app.app_id || app.appId,
          app_name: app.name || app.app_name || app.appName
        }));
        setApplications(appData);
      } else {
        console.error('Failed to fetch applications:', responseData);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      // Try to use data from users if applications can't be fetched
      if (users.length > 0) {
        const uniqueAppIds = [...new Set(users.map(user => user.app_id).filter(id => id))];
        const appData = uniqueAppIds.map(appId => {
          const appUser = users.find(u => u.app_id === appId);
          return {
            id: appId,
            name: appUser?.app_name || `App ${appId}`,
            app_id: appId,
            app_name: appUser?.app_name || `App ${appId}`
          };
        });
        setApplications(appData);
      } else if (process.env.NODE_ENV === 'development') {
        // Provide fallback data for development
        console.warn('Using fallback application data for development');
        setApplications([
          { id: 1, name: 'Demo App 1', app_id: 1, app_name: 'Demo App 1' },
          { id: 2, name: 'Demo App 2', app_id: 2, app_name: 'Demo App 2' }
        ]);
      }
    }
  };

  // Handle success message from location state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchApplications();
    
    // Display API connection info in console
    console.info('API Connection: Using proxy setup - requests to /api will be forwarded to http://localhost:3000/api');
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Find the selected application to get its app_id
        const selectedAppId = parseInt(formData.application_id);
        const selectedApp = applications.find(app => app.id === selectedAppId || app.app_id === selectedAppId);
        
        const userData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          login_id: formData.login_id,
          email_id: formData.email_id,
          app_id: selectedApp?.app_id || selectedAppId, // Use app_id from selected app or fall back to the selected value
          map_user_azure_id: formData.map_user_azure_id || null
        };
        
        if (editingId) {
          const response = await api.put(`/users/${editingId}`, userData);
          console.log('Update Response:', response);
          
          const responseData = response.data;
          if (responseData && responseData.success) {
            await fetchUsers();
            toggle();
          } else {
            throw new Error((responseData && responseData.message) || 'Failed to update user');
          }
        } else {
          const response = await api.post('/users', userData);
          console.log('Add Response:', response);
          
          const responseData = response.data;
          if (responseData && responseData.success) {
            await fetchUsers();
            toggle();
          } else {
            throw new Error((responseData && responseData.message) || 'Failed to add user');
          }
        }
      } catch (err) {
        console.error('Error saving user:', err);
        setError(err.message || 'Failed to save user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingId(user.app_user_id);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      login_id: user.login_id || "",
      email_id: user.email_id || "",
      application_id: (user.application_id || user.app_id)?.toString() || "",
      map_user_azure_id: user.map_user_azure_id || ""
    });

     navigate(`/user-details/edit/${user.app_user_id}`, {
      state: { user: formData }
    });

    setModal(true);
  };

  // Handle delete button click
  const handleDelete = (userId) => {
    setDeleteId(userId);
    setDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/users/${deleteId}`);
      console.log('Delete Response:', response);
      
      const responseData = response.data;
      if (responseData && responseData.success) {
        await fetchUsers();
        setDeleteModal(false);
      } else {
        throw new Error((responseData && responseData.message) || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setDeleteModal(false);
    }
  };

  // Get application name from ID (fallback if app_name is not in API response)
  const getApplicationName = (user) => {
    if (user.app_name) return user.app_name;
    
    const app = applications.find(a => a.id === user.application_id || a.id === user.app_id);
    return app ? app.name : (user.application_id || user.app_id);
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
                    <h4 className="common_title card-title mb-0">{t("User Details")}</h4>
                    <Button color="primary" onClick={()=>navigate("/user-details/add")}>
                      <i className="bx bx-plus me-1"></i> {t("Add User")}
                    </Button>
                  </div>

                  {/* Filter Section */}
                  <Row className="mb-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroupText>
                          <i className="bx bx-search"></i>
                        </InputGroupText>
                        <Input
                          type="text"
                          name="searchQuery"
                          placeholder={t("Search by name, login, email...")}
                          value={filters.searchQuery}
                          onChange={handleFilterChange}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={3}>
                      <Input
                        type="select"
                        name="applicationId"
                        value={filters.applicationId}
                        onChange={handleFilterChange}
                        onFocus={fetchApplications}
                      >
                        <option value="">{t("All Applications")}</option>
                        {applications.length > 0 ? (
                          applications.map(app => (
                            <option key={app.id || app.app_id} value={app.name || app.app_name}>
                              {app.name || app.app_name}
                            </option>
                          ))
                        ) : (
                          // If no applications loaded, try to get unique apps from users
                          [...new Set(users.map(user => user.app_id))]
                            .filter(appId => appId) // Remove null/undefined
                            .map(appId => {
                              const appUser = users.find(u => u.app_id === appId);
                              return (
                                <option key={appId} value={appId}>
                                  {appUser?.app_name || `App ${appId}`}
                                </option>
                              );
                            })
                        )}
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
                    <Fade timeout={300}>
                      <Alert color="danger" className="mb-4" toggle={() => setError(null)}>
                        {error}
                      </Alert>
                    </Fade>
                    
                  )}
                  {successMessage && (
                      <Alert color="success" className="mb-4" toggle={() => setSuccessMessage(null)}>
                      {successMessage}
                      </Alert>
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
                              <th>{t("User ID")}</th>
                              <th>{t("First Name")}</th>
                              <th>{t("Last Name")}</th>
                              <th>{t("Login ID")}</th>
                              <th>{t("Email")}</th>
                              <th>{t("Application")}</th>
                              <th>{t("Azure Map ID")}</th>
                              <th>{t("Created At")}</th>
                              <th>{t("Actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.length === 0 ? (
                              <tr>
                                <td colSpan="9" className="text-center">
                                  {filteredUsers.length === 0
                                    ? t("No users found")
                                    : t("No matching users found")}
                                </td>
                              </tr>
                            ) : (
                              currentItems.map((user) => (
                                <tr key={user.app_user_id}>
                                  <td>{user.app_user_id}</td>
                                  <td>{user.first_name}</td>
                                  <td>{user.last_name}</td>
                                  <td>{user.login_id}</td>
                                  <td>{user.email_id}</td>
                                  <td>{user.app_name || getApplicationName(user)}</td>
                                  <td>{user.map_user_azure_id || "-"}</td>
                                  <td>{formatDate(user.created_at)}</td>
                                  <td>
                                    <Button
                                      color="info"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => handleEdit(user)}
                                    >
                                      <i className="bx bx-edit-alt"></i>
                                    </Button>
                                    <Button
                                      color="danger"
                                      size="sm"
                                      onClick={() => handleDelete(user.app_user_id)}
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
                      {filteredUsers.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <div>
                            {t("Showing")} {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsers.length)} {t("of")} {filteredUsers.length} {t("entries")}
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
              {editingId ? t("Edit User") : t("Add User")}
            </ModalHeader>
            <Form onSubmit={handleSubmit}>
              <ModalBody>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="first_name">{t("First Name")}</Label>
                      <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        invalid={!!errors.first_name}
                      />
                      <FormFeedback>{errors.first_name}</FormFeedback>
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
                        onChange={handleInputChange}
                        invalid={!!errors.last_name}
                      />
                      <FormFeedback>{errors.last_name}</FormFeedback>
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
                        onChange={handleInputChange}
                        invalid={!!errors.login_id}
                      />
                      <FormFeedback>{errors.login_id}</FormFeedback>
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
                        onChange={handleInputChange}
                        invalid={!!errors.email_id}
                      />
                      <FormFeedback>{errors.email_id}</FormFeedback>
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
                        value={formData.application_id}
                        onChange={handleInputChange}
                        onFocus={fetchApplications}
                        invalid={!!errors.application_id}
                      >
                        <option value="">{t("Select Application")}</option>
                        {applications.length > 0 ? (
                          applications.map(app => (
                            <option key={app.id || app.app_id} value={app.id || app.app_id}>
                              {app.name || app.app_name}
                            </option>
                          ))
                        ) : (
                          // If no applications loaded, try to get unique apps from users
                          [...new Set(users.map(user => user.app_id))]
                            .filter(appId => appId) // Remove null/undefined
                            .map(appId => {
                              const appUser = users.find(u => u.app_id === appId);
                              return (
                                <option key={appId} value={appId}>
                                  {appUser?.app_name || `App ${appId}`}
                                </option>
                              );
                            })
                        )}
                      </Input>
                      <FormFeedback>{errors.application_id}</FormFeedback>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="map_user_azure_id">{t("Azure Map ID")} <span className="text-muted">({t("Optional")})</span></Label>
                      <Input
                        type="text"
                        name="map_user_azure_id"
                        id="map_user_azure_id"
                        value={formData.map_user_azure_id}
                        onChange={handleInputChange}
                      />
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
              {t("Are you sure you want to delete this user?")}
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

export default UserDetails; 