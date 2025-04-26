import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { 
  getAllConsultationRequests, 
  updateConsultationRequestStatus, 
  clearInfoError 
} from '../../store/slices/infoSlice';
import { ConsultationRequest } from '../../types';
import { 
  Table, Card, Badge, Form, Row, Col, Button, 
  Spinner, Alert, Dropdown, ButtonGroup 
} from 'react-bootstrap';

 
type ConsultationStatus = 'pending' | 'in_progress' | 'completed';
const STATUS_MAP: Record<ConsultationStatus, { text: string; variant: string }> = {
  pending: { text: 'Ожидает', variant: 'warning' },
  in_progress: { text: 'В работе', variant: 'info' },
  completed: { text: 'Завершено', variant: 'success' },
};

const AdminConsultationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { consultationRequests, loading, error } = useAppSelector((state) => state.info);
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | 'all'>('all');
  
  useEffect(() => {
     
    dispatch(getAllConsultationRequests(statusFilter === 'all' ? undefined : { status: statusFilter }));
    
   
    return () => {
      dispatch(clearInfoError());
    };
  }, [dispatch, statusFilter]);
  
  
  const handleStatusChange = (id: number | undefined, newStatus: ConsultationStatus) => {
    if (id === undefined) return;
    dispatch(updateConsultationRequestStatus({ id, status: newStatus }));
  };
  
 
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Неверная дата';
    }
  };

  return (
    <div className="admin-consultations-page my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Запросы на консультацию</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          &larr; Назад к дашборду
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="auto">Фильтр по статусу:</Form.Label>
            <Col sm="auto">
              <ButtonGroup>
                {(['all', 'pending', 'in_progress', 'completed'] as const).map(status => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'primary' : 'outline-primary'}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'all' ? 'Все' : STATUS_MAP[status as ConsultationStatus].text}
                  </Button>
                ))}
              </ButtonGroup>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка запросов...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={() => dispatch(getAllConsultationRequests(statusFilter === 'all' ? undefined : { status: statusFilter }))}
          >
            Попробовать снова
          </Button>
        </Alert>
      ) : consultationRequests.length === 0 ? (
        <Alert variant="info">
          Запросы с выбранным статусом не найдены.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Тема</th>
                    <th>Сообщение</th>
                    <th>Дата создания</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {consultationRequests.map(req => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.name}</td>
                      <td>{req.email}</td>
                      <td>{req.phone || '-'}</td>
                      <td>{req.subject}</td>
                      <td title={req.message} style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.message}
                      </td>
                      <td>{formatDate(req.created_at)}</td>
                      <td>
                        <Badge bg={STATUS_MAP[req.status || 'pending'].variant}>
                          {STATUS_MAP[req.status || 'pending'].text}
                        </Badge>
                      </td>
                      <td>
                        <Dropdown as={ButtonGroup} size="sm">
                          <Button 
                            variant="outline-secondary" 
                            disabled={req.status === 'pending'}
                            onClick={() => handleStatusChange(req.id, 'pending')}
                          >
                            Ожидает
                          </Button>
                          <Button 
                            variant="outline-info" 
                            disabled={req.status === 'in_progress'}
                            onClick={() => handleStatusChange(req.id, 'in_progress')}
                          >
                            В работе
                          </Button>
                          <Button 
                            variant="outline-success" 
                            disabled={req.status === 'completed'}
                            onClick={() => handleStatusChange(req.id, 'completed')}
                          >
                            Завершено
                          </Button>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminConsultationsPage; 