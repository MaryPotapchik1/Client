import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getAllApplications, updateApplicationStatus, addApplicationComment } from '../../store/slices/applicationSlice';
import { 
  Table, Card, Badge, Form, Row, Col, Button, 
  Pagination, Alert, Spinner, Dropdown, Modal, ButtonGroup 
} from 'react-bootstrap';
import { Application, UpdateApplicationStatusData } from '../../types';

 
type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';

const AdminApplicationsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStatusFilter = queryParams.get('status') || 'all';
  
  const dispatch = useAppDispatch();
  const { applications, loading, error } = useAppSelector((state) => state.applications);
  
  
  const applicationsArray = Array.isArray(applications) ? applications : [];
  
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  useEffect(() => {
    dispatch(getAllApplications());
  }, [dispatch]);
  
 
  const filteredApplications = applicationsArray.filter(app => {
   
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    
 
    if (typeFilter !== 'all' && app.application_type !== typeFilter) {
      return false;
    }
    
     
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.id.toString().includes(term) ||
        app.purpose.toLowerCase().includes(term) ||
        (app.description && app.description.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
 
  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = sortedApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  
 
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
   
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
  };
  
 
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge bg="warning" text="dark">Ожидает обработки</Badge>;
      case 'reviewing': return <Badge bg="info">На рассмотрении</Badge>;
      case 'approved': return <Badge bg="success">Одобрено</Badge>;
      case 'rejected': return <Badge bg="danger">Отклонено</Badge>;
      case 'completed': return <Badge bg="primary">Завершено</Badge>;
      default: return <Badge bg="secondary">Неизвестно</Badge>;
    }
  };
  
   
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
        {pages}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    );
  };
  
   
  const renderActionButtons = (application: Application) => {
    return (
      <Link to={`/admin/applications/${application.id}`} className="btn btn-sm btn-primary">
         Просмотр
      </Link>
    );
  };
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="admin-applications-page my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление заявками</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          &larr; Назад к дашборду
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Статус</Form.Label>
                <Form.Select value={statusFilter} onChange={handleStatusFilterChange}>
                  <option value="all">Все статусы</option>
                  <option value="pending">Ожидает обработки</option>
             
                  <option value="approved">Одобрено</option>
                  <option value="rejected">Отклонено</option>
                
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Тип заявки</Form.Label>
                <Form.Select value={typeFilter} onChange={handleTypeFilterChange}>
                  <option value="all">Все типы</option>
                  <option value="housing">Жилье</option>
                  <option value="education">Образование</option>
                  <option value="healthcare">Здравоохранение</option>
                  <option value="other">Другое</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Поиск</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ID, ФИО, цель..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка заявок...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Alert variant="info">
          Заявки не найдены. Попробуйте изменить параметры фильтрации.
        </Alert>
      ) : (
        <>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Дата</th>
                      <th>Пользователь</th>
                      <th>Тип</th>
                      <th>Сумма</th>
                      <th>Цель</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplications.map((application: Application) => {
                     
                      const userProfile = application.user_profile;
                      const userName = userProfile 
                        ? `${userProfile.last_name || ''} ${userProfile.first_name || ''} ${userProfile.middle_name || ''}`.trim()
                        : `ID: ${application.user_id}`;
                      
                      return (
                        <tr key={application.id}>
                          <td>{application.id}</td>
                          <td>{formatDate(application.created_at)}</td>
                          <td>
                            {userName}
                            {!userProfile && <Badge bg="warning" text="dark" className="ms-1">?</Badge>}
                          </td>
                          <td>
                            {application.application_type === 'housing' && 'Жилье'}
                            {application.application_type === 'education' && 'Образование'}
                            {application.application_type === 'healthcare' && 'Здравоохранение'}
                            {application.application_type === 'other' && 'Другое'}
                          </td>
                          <td>{application.requested_amount ? application.requested_amount.toLocaleString() + ' BYN' : 'Неизвестно'}</td>
                          <td>{application.purpose.length > 30 ? application.purpose.substring(0, 30) + '...' : application.purpose}</td>
                          <td>{getStatusBadge(application.status)}</td>
                          <td>
                            {renderActionButtons(application)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="mb-0">
                  Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredApplications.length)} из {filteredApplications.length} заявок
                </p>
                {renderPagination()}
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminApplicationsPage; 