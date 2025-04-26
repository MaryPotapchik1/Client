import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Tab, Tabs, Spinner, ListGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getApplicationById, addApplicationComment, resetCurrentApplication, updateApplicationStatus } from '../store/slices/applicationSlice';
import { setAlert, AlertType } from '../store/slices/alertSlice';
import { Application, ApplicationComment, UserProfile, FamilyMember, UpdateApplicationStatusData } from '../types';
import { getStatusText, getStatusVariant, getApplicationTypeText, formatDate } from '../utils/typeUtils';

 
type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';

interface StatusUpdateForm {
    newStatus: ApplicationStatus;
    approvedAmount: number | '';
    rejectionReason: string;
}
 

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentApplication, comments, loading, error } = useAppSelector(state => state.applications);
  const userRole = useAppSelector(state => state.auth.user?.role);  
  const isAdmin = userRole === 'admin';  

  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [fileUploading, setFileUploading] = useState(false);

 
  const [statusUpdateForm, setStatusUpdateForm] = useState<StatusUpdateForm>({
      newStatus: 'pending',
      approvedAmount: '',
      rejectionReason: ''
  });
 

  useEffect(() => {
    if (id) {
      dispatch(getApplicationById(parseInt(id)))
        .unwrap()
        .then((data) => {
             
            if (data && data.application) {
                setStatusUpdateForm(prev => ({ 
                    ...prev, 
                    newStatus: data.application.status as ApplicationStatus,
                    approvedAmount: data.application.approved_amount || '',
                    rejectionReason: data.application.rejection_reason || ''
                }));
            }
        });
    }

 
    return () => {
      dispatch(resetCurrentApplication());
    };
  }, [dispatch, id]);

 
  const handleStatusUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      if (!id || !isAdmin) return;

      const { newStatus, approvedAmount, rejectionReason } = statusUpdateForm;

 
      if (newStatus === 'rejected' && !rejectionReason.trim()) {
          dispatch(setAlert({ type: AlertType.ERROR, message: 'Причина отказа обязательна' }));
          return;
      }
      if (newStatus === 'approved' && (approvedAmount === '' || Number(approvedAmount) <= 0)) {
          dispatch(setAlert({ type: AlertType.ERROR, message: 'Введите корректную одобренную сумму' }));
          return;
      }

      const statusData: UpdateApplicationStatusData = {
          status: newStatus,
          approved_amount: newStatus === 'approved' ? Number(approvedAmount) : undefined,
          rejection_reason: newStatus === 'rejected' ? rejectionReason.trim() : undefined
      };

      dispatch(updateApplicationStatus({ id: parseInt(id), statusData }))
          .unwrap()
          .then(() => {
              dispatch(setAlert({ type: AlertType.SUCCESS, message: 'Статус заявки обновлен' }));
          })
          .catch((err) => {
              console.error('Error updating status:', err);
             
          });
  };

 
  const handleStatusFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setStatusUpdateForm(prev => ({
          ...prev,
          [name]: name === 'approvedAmount' ? (value === '' ? '' : Number(value)) : value
      }));
  };
 
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    dispatch(addApplicationComment({ id: parseInt(id), comment: newComment }))
      .unwrap()
      .then(() => {
        setNewComment('');
        dispatch(setAlert({
          type: AlertType.SUCCESS,
          message: 'Комментарий добавлен',
        }));
      })
      .catch((err) => {
        console.error('Error adding comment:', err);
      });
  };

 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !id) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('document', file);
    
    setFileUploading(true);
    
   
    setTimeout(() => {
      setFileUploading(false);
      dispatch(setAlert({
        type: AlertType.SUCCESS,
        message: 'Документ успешно загружен',
      }));
    }, 1500);
  };

  if (loading && !currentApplication) {  
    return (
      <Container>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Загрузка информации о заявке...</p>
        </div>
      </Container>
    );
  }

  if (error && !currentApplication) {  
    return (
      <Container>
        <Alert variant="danger">
          {error}
        </Alert>
        <div className="text-center">
          <Button as={Link} to="/applications" variant="primary">
            Вернуться к списку заявок
          </Button>
        </div>
      </Container>
    );
  }

  if (!currentApplication) {
    
    return (
      <Container>
        <Alert variant="warning">
          Заявка не найдена или доступ запрещен.
        </Alert>
        <div className="text-center">
          <Button as={Link} to="/applications" variant="primary">
            Вернуться к списку заявок
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="page-header">Заявка №{currentApplication.id}</h1>
            <Button 
              as={Link} 
              to={isAdmin ? "/admin/applications" : "/applications"} 
              variant="outline-secondary"
            >
              Назад к списку
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={4} className="border-end">
                  <div className="mb-3">
                    <h6 className="text-muted">Статус заявки</h6>
                    <Badge bg={getStatusVariant(currentApplication.status)} className="fs-6 px-3 py-2">
                      {getStatusText(currentApplication.status)}
                    </Badge>
                  </div>
                  {currentApplication.status === 'rejected' && currentApplication.rejection_reason && (
                    <div className="mb-3">
                        <h6 className="text-muted">Причина отказа</h6>
                        <p className="text-danger mb-0">{currentApplication.rejection_reason}</p>
                    </div>
                  )}
                  <div className="mb-3">
                    <h6 className="text-muted">Тип заявки</h6>
                    <p className="mb-0">{getApplicationTypeText(currentApplication.application_type)}</p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted">Запрошенная сумма</h6>
                    <p className="mb-0">{currentApplication.requested_amount ? currentApplication.requested_amount.toLocaleString() : '0'} BYN</p>
                  </div>
                  {currentApplication.status === 'approved' && currentApplication.approved_amount && (
                    <div className="mb-3">
                      <h6 className="text-muted">Одобренная сумма</h6>
                      <p className="mb-0 fw-bold text-success">{currentApplication.approved_amount.toLocaleString()} BYN</p>
                    </div>
                  )}
                </Col>
                <Col md={8}>
                  <div className="mb-3">
                    <h6 className="text-muted">Цель использования</h6>
                    <p className="mb-0">{currentApplication.purpose}</p>
                  </div>
                  {currentApplication.description && (
                    <div className="mb-3">
                      <h6 className="text-muted">Описание</h6>
                      <p className="mb-0">{currentApplication.description}</p>
                    </div>
                  )}
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="text-muted">Дата создания</h6>
                      <p className="mb-0">{formatDate(currentApplication.created_at)}</p>
                    </div>
                    <div>
                      <h6 className="text-muted">Дата обновления</h6>
                      <p className="mb-0">{formatDate(currentApplication.updated_at)}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {isAdmin && currentApplication?.user_profile && (
          <Row className="mb-4">
              <Col>
                  <Card className="shadow-sm">
                      <Card.Header>Данные пользователя</Card.Header>
                      <Card.Body>
                          <Row>
                              <Col md={6}>
                                  <p><strong>ФИО:</strong> {currentApplication.user_profile.last_name} {currentApplication.user_profile.first_name} {currentApplication.user_profile.middle_name || ''}</p>
                                  <p><strong>Дата рождения:</strong> {formatDate(currentApplication.user_profile.birth_date)}</p>
                                  <p><strong>Паспорт:</strong> {currentApplication.user_profile.passport_series} {currentApplication.user_profile.passport_number}</p>
                                  <p><strong>Адрес:</strong> {currentApplication.user_profile.address}</p>
                                  <p><strong>Телефон:</strong> {currentApplication.user_profile.phone}</p>
                              </Col>
                              <Col md={6}>
                                  <p><strong>Материнский капитал:</strong> {currentApplication.user_profile.has_maternal_capital ? 'Да' : 'Нет'} {currentApplication.user_profile.has_maternal_capital ? `(${currentApplication.user_profile.maternal_capital_amount} BYN)` : ''}</p>
                                  <p><strong>Тип жилья:</strong> {currentApplication.user_profile.housing_type ? housingTypeLabels[currentApplication.user_profile.housing_type] : 'Не указано'}</p>
                                  <p><strong>Площадь:</strong> {currentApplication.user_profile.living_area ? `${currentApplication.user_profile.living_area} кв.м` : 'Не указано'}</p>
                                  <p><strong>Статус собственности:</strong> {currentApplication.user_profile.ownership_status ? ownershipStatusLabels[currentApplication.user_profile.ownership_status] : 'Не указано'}</p>
                              </Col>
                          </Row>
                          {currentApplication.family_members && currentApplication.family_members.length > 0 && (
                              <>
                                  <h5 className="mt-3">Члены семьи</h5>
                                  <ListGroup variant="flush">
                                      {currentApplication.family_members.map((member) => (
                                          <ListGroup.Item key={member.id}>
                                              {member.last_name} {member.first_name} {member.middle_name || ''} ({member.relation_type === 'spouse' ? 'Супруг(а)' : 'Ребенок'}, {formatDate(member.birth_date)})
                                          </ListGroup.Item>
                                      ))}
                                  </ListGroup>
                              </>
                          )}
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
      )}

      <Row>
        <Col>
          <Tabs
            id="application-tabs"
            defaultActiveKey="comments"
            className="mb-4"
          >
            <Tab eventKey="comments" title={`Комментарии (${comments.length})`}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5>История обсуждения</h5>
                  <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {comments.length === 0 ? (
                      <Alert variant="info">Комментариев пока нет.</Alert>
                    ) : (
                      <ListGroup variant="flush">
                        {comments.map((comment) => (
                          <ListGroup.Item key={comment.id} className="mb-2 border-bottom-0">
                            <div className={`d-flex ${comment.is_admin ? 'justify-content-end' : ''}`}>
                               <div className={`p-2 rounded ${comment.is_admin ? 'bg-primary text-white' : 'bg-light'}`}>
                                   <small className="fw-bold d-block">{comment.is_admin ? 'Администратор' : 'Пользователь'}</small>
                                   <p className="mb-1">{comment.comment}</p>
                                   <small className={`d-block text-end ${comment.is_admin ? 'text-white-50' : 'text-muted'}`}>{formatDate(comment.created_at)}</small>
                               </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </div>
                  
                  <h5>Добавить комментарий</h5>
                  <Form onSubmit={handleAddComment}>
                    <Form.Group className="mb-3">
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Введите ваш комментарий..."
                        required
                      />
                    </Form.Group>
                    <Button variant="outline-primary" type="submit" disabled={loading || !newComment.trim()}>
                      {loading ? 'Отправка...' : 'Отправить комментарий'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {isAdmin && (
          <Row className="mt-4">
              <Col>
                  <Card className="shadow-sm">
                      <Card.Header>Управление заявкой</Card.Header>
                      <Card.Body>
                          {error && <Alert variant="danger">{error}</Alert>}
                          <Form onSubmit={handleStatusUpdate}>
                              <Row>
                                  <Col md={4}>
                                      <Form.Group className="mb-3">
                                          <Form.Label>Изменить статус</Form.Label>
                                          <Form.Select 
                                              name="newStatus"
                                              value={statusUpdateForm.newStatus} 
                                              onChange={handleStatusFormChange}
                                          >
                                              
                                              <option value="reviewing">Ожидает обработки</option>
                                              <option value="approved">Одобрено</option>
                                              <option value="rejected">Отклонено</option>
                                              
                                          </Form.Select>
                                      </Form.Group>
                                  </Col>
                                  {statusUpdateForm.newStatus === 'approved' && (
                                      <Col md={4}>
                                          <Form.Group className="mb-3">
                                              <Form.Label>Одобренная сумма</Form.Label>
                                              <Form.Control
                                                  type="number"
                                                  name="approvedAmount"
                                                  value={statusUpdateForm.approvedAmount}
                                                  onChange={handleStatusFormChange}
                                                  placeholder="Сумма"
                                                  required
                                              />
                                          </Form.Group>
                                      </Col>
                                  )}
                                  {statusUpdateForm.newStatus === 'rejected' && (
                                      <Col md={ 8}>
                                          <Form.Group className="mb-3">
                                              <Form.Label>Причина отказа</Form.Label>
                                              <Form.Control 
                                                  as="textarea" 
                                                  name="rejectionReason"
                                                  rows={1}
                                                  value={statusUpdateForm.rejectionReason} 
                                                  onChange={handleStatusFormChange}
                                                  placeholder="Укажите причину..."
                                                  required
                                              />
                                          </Form.Group>
                                      </Col>
                                  )}
                              </Row>
                              <Button 
                                  variant="primary" 
                                  type="submit"
                                  disabled={loading}
                              >
                                  {loading ? 'Сохранение...' : 'Сохранить статус'}
                              </Button>
                          </Form>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
      )}

    </Container>
  );
};

 
const housingTypeLabels: Record<NonNullable<UserProfile['housing_type']>, string> = {
    own_house: 'Собственный дом',
    own_apartment: 'Собственная квартира',
    rented: 'Аренда',
    social_housing: 'Социальное жилье',
    other: 'Другое'
};

const ownershipStatusLabels: Record<NonNullable<UserProfile['ownership_status']>, string> = {
    sole: 'Единоличная',
    joint: 'Совместная',
    none: 'Отсутствует'
};
 

export default ApplicationDetailPage; 