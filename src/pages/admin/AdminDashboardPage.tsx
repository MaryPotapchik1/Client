import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { getAllApplications } from '../../store/slices/applicationSlice';
import { Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';

const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, loading, error } = useAppSelector((state) => state.applications);
  
  useEffect(() => {
    dispatch(getAllApplications());
  }, [dispatch]);
  
  
  const applicationsArray = Array.isArray(applications) ? applications : [];
 
  const statusStats = {
    pending: applicationsArray.filter(app => app.status === 'pending').length,
    reviewing: applicationsArray.filter(app => app.status === 'reviewing').length,
    approved: applicationsArray.filter(app => app.status === 'approved').length,
    rejected: applicationsArray.filter(app => app.status === 'rejected').length,
    completed: applicationsArray.filter(app => app.status === 'completed').length,
  };
  
  
  const recentApplications = [...applicationsArray]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
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
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="admin-dashboard my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Панель администратора</h1>
        <div>
          <Link to="/admin/applications" className="btn btn-primary me-2">
            Все заявки
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            Пользователи
          </Link>
        </div>
      </div>
      
      <Row>
        <Col md={3}>
          <Card className="mb-4 bg-primary text-white">
            <Card.Body className="text-center">
              <h3>{applicationsArray.length}</h3>
              <p>Всего заявок</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-warning text-dark">
            <Card.Body className="text-center">
              <h3>{statusStats.pending + statusStats.reviewing}</h3>
              <p>Требуют внимания</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-success text-white">
            <Card.Body className="text-center">
              <h3>{statusStats.approved}</h3>
              <p>Одобрено</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-danger text-white">
            <Card.Body className="text-center">
              <h3>{statusStats.rejected}</h3>
              <p>Отклонено</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Последние заявки</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center">Загрузка заявок...</p>
              ) : recentApplications.length === 0 ? (
                <p className="text-center">Заявок пока нет</p>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Тип</th>
                      <th>Статус</th>
                      <th>Сумма</th>
                      <th>Дата</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map(app => (
                      <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>
                          {app.application_type === 'housing' && 'Жилье'}
                          {app.application_type === 'education' && 'Образование'}
                          {app.application_type === 'healthcare' && 'Здравоохранение'}
                          {app.application_type === 'other' && 'Другое'}
                        </td>
                        <td>{getStatusBadge(app.status)}</td>
                        <td>{app.requested_amount && app.requested_amount.toLocaleString() || 0} BYN</td>
                        <td>{formatDate(app.created_at)}</td>
                        <td>
                          <Link to={`/applications/${app.id}`} className="btn btn-sm btn-outline-primary">
                            Просмотр
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
            <Card.Footer>
              <Link to="/admin/applications" className="btn btn-outline-primary w-100">
                Смотреть все заявки
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Статистика заявок</h5>
            </Card.Header>
            <Card.Body>
              <Table>
                <tbody>
                  <tr>
                    <td>Ожидают обработки</td>
                    <td className="text-end">
                      <Badge bg="warning" text="dark">{statusStats.pending}</Badge>
                    </td>
                  </tr>
                 
                  <tr>
                    <td>Одобрено</td>
                    <td className="text-end">
                      <Badge bg="success">{statusStats.approved}</Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>Отклонено</td>
                    <td className="text-end">
                      <Badge bg="danger">{statusStats.rejected}</Badge>
                    </td>
                  </tr>
                 
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          
         
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboardPage; 