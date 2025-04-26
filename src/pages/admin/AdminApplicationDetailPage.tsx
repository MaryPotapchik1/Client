import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
 
import { fetchApplicationDetails, clearCurrentApplicationDetails, updateApplicationStatus } from '../../store/slices/applicationSlice';
 
import { UserProfile, FamilyMember, UpdateApplicationStatusData } from '../../types';
import { Container, Card, Row, Col, Spinner, Alert, Button, ListGroup, Badge, Modal, Form, ButtonGroup } from 'react-bootstrap';

 
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
};

const getStatusBadge = (status: string | undefined) => {
  if (!status) return <Badge bg="secondary">Неизвестно</Badge>;
  switch(status) {
    case 'pending': return <Badge bg="warning" text="dark">Ожидает обработки</Badge>;
    case 'reviewing': return <Badge bg="info">На рассмотрении</Badge>;
    case 'approved': return <Badge bg="success">Одобрено</Badge>;
    case 'rejected': return <Badge bg="danger">Отклонено</Badge>;
    case 'completed': return <Badge bg="primary">Завершено</Badge>;
    default: return <Badge bg="secondary">{status}</Badge>;
  }
};

 
const housingTypeLabels: Record<string, string> = {
  own_house: 'Собственный дом',
  own_apartment: 'Собственная квартира',
  rented: 'Аренда',
  social_housing: 'Социальное жилье',
  other: 'Другое'
};

const ownershipStatusLabels: Record<string, string> = {
  sole: 'Единоличная',
  joint: 'Совместная',
  none: 'Отсутствует'
};

 
type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';

const AdminApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
   
  const { currentApplicationDetails, loadingDetails, errorDetails, loading } = useAppSelector(
    (state) => state.applications
  );

 
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('reviewing');
  const [statusComment, setStatusComment] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number | '' >('');
  const [currentAction, setCurrentAction] = useState<'approve' | 'reject' | null>(null);
 

  useEffect(() => {
    if (id) {
     
      dispatch(fetchApplicationDetails(Number(id)));
    }
    
    return () => {
      dispatch(clearCurrentApplicationDetails());
    };
  }, [dispatch, id]);
 
  const handleOpenApproveModal = () => {
    if (!currentApplicationDetails) return;
    const application = currentApplicationDetails.application;
    setNewStatus('approved');
    setApprovedAmount(application.approved_amount || application.requested_amount || '');
    setStatusComment('');
    setCurrentAction('approve');
    setShowStatusModal(true);
  };

 
  const handleOpenRejectModal = () => {
    if (!currentApplicationDetails) return;
    const application = currentApplicationDetails.application;
    setNewStatus('rejected');
    setApprovedAmount(''); 
    setStatusComment(application.rejection_reason || '');
    setCurrentAction('reject');
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setNewStatus('reviewing'); 
    setApprovedAmount('');
    setStatusComment('');
    setCurrentAction(null);
  };

  const handleStatusSubmit = () => {
    if (!currentApplicationDetails || !currentAction) return;
    const application = currentApplicationDetails.application;

    const statusData: UpdateApplicationStatusData = {
      status: newStatus,
      rejection_reason: currentAction === 'reject' ? statusComment.trim() : undefined,
      approved_amount: currentAction === 'approve' && approvedAmount !== '' ? Number(approvedAmount) : undefined
    };

    if (currentAction === 'reject' && !statusComment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    dispatch(updateApplicationStatus({ id: application.id, statusData }))
      .unwrap()
      .then(() => {
      
        handleCloseStatusModal();
      
      })
      .catch(error => {
        console.error('Error updating application status:', error);
       
        alert(`Ошибка обновления статуса: ${error}`);
      });
  };
 
  if (loadingDetails) {
    return <Container className="text-center my-5"><Spinner animation="border" /></Container>;
  }

 
  if (errorDetails) {
    return (
      <Container className="my-4">
        <Alert variant="danger">Ошибка загрузки данных заявки: {errorDetails}</Alert>
        <Link to="/admin/applications">
          <Button variant="secondary">Назад к списку заявок</Button>
        </Link>
      </Container>
     );
  }

  
  if (!currentApplicationDetails) {
    return (
      <Container className="my-4">
        <Alert variant="warning">
          Данные заявки #{id} не найдены.
        </Alert>
        <Link to="/admin/applications">
          <Button variant="secondary">Назад к списку заявок</Button>
        </Link>
      </Container>
    );
  }

  
  const { application, user_profile, family_members, comments } = currentApplicationDetails;
   
  const userProfile = user_profile as UserProfile | null;
   
  const familyMembers = family_members as FamilyMember[] | null;

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Детали заявки #{application.id}</h1> 
        <Link to="/admin/applications">
          <Button variant="outline-secondary">&larr; Назад к списку</Button>
        </Link>
      </div>

    
      {(application.status === 'pending' || application.status === 'reviewing') && (
        <div className="mb-3">
          <ButtonGroup>
            <Button variant="success" onClick={handleOpenApproveModal} disabled={loading}>
              Одобрить
            </Button>
            <Button variant="danger" onClick={handleOpenRejectModal} disabled={loading}>
              Отклонить
            </Button>
          </ButtonGroup>
        </div>
      )}
  

      <Row>
    
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Информация о заявке</Card.Header>
            <Card.Body>
              <p><strong>ID заявки:</strong> {application.id}</p>
              <p><strong>Тип:</strong> {application.application_type}</p>
              <p><strong>Статус:</strong> {getStatusBadge(application.status)}</p>
              <p><strong>Запрошенная сумма:</strong> {application.requested_amount?.toLocaleString()} BYN</p>
              {application.status === 'approved' && application.approved_amount && (
                <p><strong>Одобренная сумма:</strong> {application.approved_amount.toLocaleString()} BYN</p>
              )}
              {application.status === 'rejected' && application.rejection_reason && (
                <p><strong>Причина отказа:</strong> {application.rejection_reason}</p>
              )}
              <p><strong>Дата создания:</strong> {formatDate(application.created_at)}</p>
              <p><strong>Дата обновления:</strong> {formatDate(application.updated_at)}</p>
              <p><strong>Цель:</strong> {application.purpose}</p>
              <p><strong>Описание:</strong> {application.description || '-'}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Комментарии к заявке</Card.Header>
            <ListGroup variant="flush">
              {comments && comments.length > 0 ? (
                comments.map(comment => (
                  <ListGroup.Item key={comment.id}>
                    <p className="mb-1">{comment.comment}</p>
                    <small className="text-muted">
                      {comment.is_admin ? 'Администратор' : 'Пользователь'} ({formatDate(comment.created_at)})
                    </small>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Комментариев нет</ListGroup.Item>
              )}
            </ListGroup>
            
          </Card>
        </Col>

        
        <Col md={6}>
          {userProfile ? (
            <>
              <Card className="mb-4">
                <Card.Header>Информация о заявителе</Card.Header>
                <Card.Body>
                  <p><strong>ID пользователя:</strong> {userProfile.user_id}</p>
                  <p><strong>ФИО:</strong> {userProfile.last_name} {userProfile.first_name} {userProfile.middle_name || ''}</p>
               
                  <p><strong>Телефон:</strong> {userProfile.phone}</p>
                  <p><strong>Дата рождения:</strong> {formatDate(userProfile.birth_date)}</p>
                  <p><strong>Паспорт:</strong> {userProfile.passport_series} {userProfile.passport_number}</p>
                  <p><strong>Адрес:</strong> {userProfile.address}</p>
                   <p>
                      <strong>Мат. капитал:</strong> {userProfile.has_maternal_capital ? 'Да' : 'Нет'}
                      {userProfile.has_maternal_capital && `, ${userProfile.maternal_capital_amount?.toLocaleString()} BYN`}
                    </p>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Header>Жилищные условия</Card.Header>
                <Card.Body>
                  <p><strong>Тип жилья:</strong> {housingTypeLabels[userProfile.housing_type || ''] || 'Не указано'}</p>
                  <p><strong>Площадь:</strong> {userProfile.living_area ? `${userProfile.living_area} кв.м` : 'Не указано'}</p>
                  <p><strong>Статус собственности:</strong> {ownershipStatusLabels[userProfile.ownership_status || ''] || 'Не указано'}</p>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>Члены семьи</Card.Header>
                <ListGroup variant="flush">
                  {familyMembers && familyMembers.length > 0 ? (
                    familyMembers.map(member => (
                      <ListGroup.Item key={member.id}>
                         <strong>{member.last_name} {member.first_name} {member.middle_name || ''}</strong> 
                         ({member.relation_type === 'spouse' ? 'Супруг(а)' : 'Ребенок'}, {formatDate(member.birth_date)}) <br />
                         <small>{member.document_type === 'birth_certificate' ? 'Свид. о рожд.' : 'Паспорт'}: {member.document_number}</small>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>Нет данных о членах семьи.</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </>
          ) : (
            <Card>
              <Card.Header>Информация о заявителе</Card.Header>
              <Card.Body>
                <Alert variant="warning">Не удалось загрузить информацию о профиле пользователя.</Alert>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* >>> ВОЗВРАЩАЕМ МОДАЛЬНОЕ ОКНО */}
      <Modal show={showStatusModal} onHide={handleCloseStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAction === 'approve' && `Одобрение заявки #${application?.id}`}
            {currentAction === 'reject' && `Отклонение заявки #${application?.id}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAction === 'approve' && (
            <Form.Group className="mb-3">
              <Form.Label>Одобренная сумма</Form.Label>
              <Form.Control
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Введите или подтвердите сумму"
                required
              />
            </Form.Group>
          )}
          
          {currentAction === 'reject' && (
            <Form.Group className="mb-3">
              <Form.Label>Причина отказа (обязательно)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={statusComment} 
                onChange={(e) => setStatusComment(e.target.value)}
                placeholder="Укажите причину отклонения заявки"
                required
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStatusModal}>
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusSubmit}
            disabled={loading || (currentAction === 'reject' && !statusComment.trim()) || (currentAction === 'approve' && approvedAmount === '')}
          >
            {loading ? 'Сохранение...' : (currentAction === 'approve' ? 'Одобрить' : 'Отклонить')}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <<< */}

    </Container>
  );
};

export default AdminApplicationDetailPage; 