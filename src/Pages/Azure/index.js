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

const Azure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  document.title = "Azure Details | Toray Admin Dashboard";

  // State for azure credentials data
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // State for filtering
  const [filters, setFilters] = useState({
    credId: "",
    status: "all"
  });

  // State for delete confirmation
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // Clear location state after displaying message
    if (location.state?.message) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Filter credentials
  const filteredCredentials = !loading ? credentials.filter(cred => {
    if (!cred || !cred.cred_id) return false;
    return (
      cred.cred_id.toLowerCase().includes(filters.credId.toLowerCase()) &&
      (filters.status === "all" || 
       (filters.status === "active" && cred.status === "Active") ||
       (filters.status === "inactive" && cred.status === "Inactive"))
    );
  }) : [];

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
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      credId: "",
      status: "all"
    });
    setCurrentPage(1);
  };

  // Fetch azure credentials data
  const fetchCredentials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/credentials');
      console.log('API Response:', response);

      if (response?.data?.success && Array.isArray(response.data.data)) {
        const formattedCredentials = response.data.data.map(cred => ({
          cred_id: cred.cred_id || cred.credId || '',
          client_id: cred.client_id || cred.clientId || '',
          client_secret: cred.client_secret || cred.clientSecret || '',
          tenant_id: cred.tenant_id || cred.tenantId || '',
          status: cred.status || 'Inactive',
          created_at: cred.created_at || cred.createdAt || '',
          updated_at: cred.updated_at || cred.updatedAt || ''
        }));
        setCredentials(formattedCredentials);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
      setError(error.message || 'Failed to fetch credentials');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Using fallback data in development');
        setCredentials([
          {
            cred_id: 'CRED001',
            client_id: 'client123',
            client_secret: '********',
            tenant_id: 'tenant123',
            status: 'Active',
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
    fetchCredentials();
  }, []);

  // Handle edit button click
  const handleEdit = (credential) => {
    navigate(`/azure/edit/${credential.cred_id}`, {
      state: { credential }
    });
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
      
      if (response?.data?.success) {
        await fetchCredentials();
        setDeleteModal(false);
        setSuccessMessage(t("Credential deleted successfully"));
      } else {
        throw new Error(response?.data?.message || 'Failed to delete credential');
      }
    } catch (err) {
      console.error('Error deleting credential:', err);
      setError(err.message || 'Failed to delete credential');
    } finally {
      setLoading(false);
      setDeleteModal(false);
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
                    <h4 className="card-title mb-0">{t("Azure Credentials")}</h4>
                    <Button color="primary" onClick={() => navigate('/azure/add')}>
                      <i className="bx bx-plus me-1"></i> {t("Add Credential")}
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
                          name="credId" 
                          value={filters.credId} 
                          onChange={handleFilterChange} 
                          placeholder={t("Search by Credential ID...")}
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
                              <th>{t("Credential ID")}</th>
                              <th>{t("Client ID")}</th>
                              <th>{t("Tenant ID")}</th>
                              <th>{t("Status")}</th>
                              <th>{t("Created At")}</th>
                              <th>{t("Updated At")}</th>
                              <th>{t("Actions")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  {filteredCredentials.length === 0 
                                    ? t("No credentials found") 
                                    : t("No matching credentials found")}
                                </td>
                              </tr>
                            ) : (
                              currentItems.map((cred) => (
                                <tr key={cred.cred_id}>
                                  <td>{cred.cred_id}</td>
                                  <td>{cred.client_id}</td>
                                  <td>{cred.tenant_id}</td>
                                  <td>
                                    <Badge color={cred.status === "Active" ? "success" : "danger"}>
                                      {cred.status}
                                    </Badge>
                                  </td>
                                  <td>{cred.created_at}</td>
                                  <td>{cred.updated_at}</td>
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
                                      onClick={() => handleDelete(cred.cred_id)}
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
    </MainLayout>
  );
};

export default Azure; 