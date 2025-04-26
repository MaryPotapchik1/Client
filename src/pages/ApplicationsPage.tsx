import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getUserApplications } from '../store/slices/applicationSlice';
import { Application } from '../types';
import { 
  getStatusText, 
  getStatusVariant, 
  getApplicationTypeText, 
  formatDate, 
  ApplicationStatus 
} from '../utils/typeUtils';

const ApplicationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { applications, loading, error } = useAppSelector(state => state.applications);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

  useEffect(() => {
   
    dispatch(getUserApplications());
  }, [dispatch]);

 
  const applicationsArray = Array.isArray(applications) ? applications : [];
 
  const filteredApplications = filter === 'all'
    ? applicationsArray
    : applicationsArray.filter(app => app.status === filter);

  return (
    <Container>
      <h1 className="page-header">Мои заявки</h1>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h5 className="mb-md-0">Всего заявок: {applicationsArray.length}</h5>
                </Col>
                <Col md={4} className="text-md-end">
                  <Button as={Link} to="/applications/create" variant="primary">
                    Создать новую заявку
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Фильтр по статусу</h5>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('all')}
                >
                  Все
                </Button>
                <Button
                  variant={filter === 'pending' ? 'secondary' : 'outline-secondary'}
                  onClick={() => setFilter('pending')}
                >
                  Ожидает рассмотрения
                </Button>
                <Button
                  variant={filter === 'reviewing' ? 'info' : 'outline-info'}
                  onClick={() => setFilter('reviewing')}
                >
                  На рассмотрении
                </Button>
                <Button
                  variant={filter === 'approved' ? 'success' : 'outline-success'}
                  onClick={() => setFilter('approved')}
                >
                  Одобрена
                </Button>
                <Button
                  variant={filter === 'rejected' ? 'danger' : 'outline-danger'}
                  onClick={() => setFilter('rejected')}
                >
                  Отклонена
                </Button>
                <Button
                  variant={filter === 'completed' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('completed')}
                >
                  Завершена
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Загрузка заявок...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">
                  {error}
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-4">
                  <p className="mb-3">Заявки не найдены</p>
                  <Button as={Link} to="/applications/create" variant="primary">
                    Создать новую заявку
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Дата создания</th>
                        <th>Тип</th>
                        <th>Сумма</th>
                        <th>Цель</th>
                        <th>Статус</th>
                        <th>Причина отказа</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((application: Application) => (
                        <tr key={application.id}>
                          <td>{application.id}</td>
                          <td>{formatDate(application.created_at)}</td>
                          <td>{getApplicationTypeText(application.application_type)}</td>
                          <td>
                            {application.requested_amount ? 
                              new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'BYN'
                              }).format(application.requested_amount) : 'Неизвестно'}
                          </td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {application.purpose || '-'}
                          </td>
                          <td>
                            <Badge bg={getStatusVariant(application.status)}>
                              {getStatusText(application.status)}
                            </Badge>
                          </td>
                          <td>
                            {application.status === 'rejected' && application.rejection_reason 
                              ? (
                                <span 
                                  title={application.rejection_reason}
                                  style={{ cursor: 'help', textDecoration: 'underline dotted' }}
                                >
                                  {application.rejection_reason.substring(0, 30)}{application.rejection_reason.length > 30 ? '...' : ''}
                                </span>
                              ) 
                              : '-'}
                          </td>
                          <td>
                            <Button
                              as={Link}
                              to={`/applications/${application.id}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              Подробнее
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicationsPage; 