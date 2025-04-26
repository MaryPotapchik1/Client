import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { fetchAllUsers, clearUsersError } from '../../store/slices/adminSlice';
import { User } from '../../types';
import { 
  Table, Card, Badge, Form, Row, Col, Button, 
  Spinner, Alert, Modal
} from 'react-bootstrap';

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loadingUsers, usersError } = useAppSelector((state) => state.admin);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  useEffect(() => {
    dispatch(fetchAllUsers());

    return () => {
      dispatch(clearUsersError());
    };
  }, [dispatch]);
  
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    const profile = user.profile;

    return (
      user.email.toLowerCase().includes(term) || 
      (profile && profile.first_name && profile.first_name.toLowerCase().includes(term)) || 
      (profile && profile.last_name && profile.last_name.toLowerCase().includes(term)) ||
      (profile && profile.phone && profile.phone.includes(term))
    );
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleResetPasswordClick = (userId: number) => {
    setSelectedUserId(userId);
    setShowResetModal(true);
  };
  
  const handleResetPassword = () => {
    console.log(`Имитация сброса пароля для пользователя ID: ${selectedUserId}`);
    setShowResetModal(false);
    setSelectedUserId(null);
  };

  const handleRoleChangeClick = (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    console.log(`Имитация смены роли для ID ${userId} на ${newRole}`);
  };
  
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
    } catch (e) {
      return 'Неверная дата';
    }
  };

  return (
    <div className="admin-users-page my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Управление пользователями</h1>
        <Link to="/admin" className="btn btn-outline-secondary">
          &larr; Назад к дашборду
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">Поиск</Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                placeholder="Поиск по имени, фамилии, email или телефону..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {loadingUsers ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Загрузка пользователей...</p>
        </div>
      ) : usersError ? (
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки пользователей</Alert.Heading>
          <p>{usersError}</p>
          <Button variant="primary" onClick={() => dispatch(fetchAllUsers())}>
            Попробовать снова
          </Button>
        </Alert>
      ) : filteredUsers.length === 0 ? (
        <Alert variant="info">
          Пользователи не найдены {searchTerm ? 'по вашему запросу' : 'в системе'}.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Роль</th>
                    <th>Мат. капитал (сумма)</th>
                    <th>Дата регистрации</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const profile = user.profile;
                    return (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{profile ? `${profile.last_name || ''} ${profile.first_name || ''}`.trim() : '-'}</td>
                        <td>{user.email}</td>
                        <td>{profile?.phone || '-'}</td>
                        <td>
                          <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </Badge>
                        </td>
                        <td>
                          {profile?.has_maternal_capital ? (
                            <span>{profile.maternal_capital_amount ? profile.maternal_capital_amount.toLocaleString() + ' BYN' : 'Есть (сумма ?)'}</span>
                          ) : (
                            <span className="text-muted">Нет</span>
                          )}
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          <Button 
                            variant="warning" 
                            size="sm"
                            onClick={() => handleResetPasswordClick(user.id)}
                            className="me-1 mb-1"
                            title="Сбросить пароль"
                          >
                            <i className="bi bi-key"></i> Сброс
                          </Button>
                          <Button 
                            variant={user.role === 'admin' ? 'outline-success' : 'outline-danger'} 
                            size="sm"
                            onClick={() => handleRoleChangeClick(user.id, user.role)}
                            className="mb-1"
                            title={user.role === 'admin' ? 'Снять права администратора' : 'Назначить администратором'}
                          >
                            <i className={user.role === 'admin' ? 'bi bi-person-dash' : 'bi bi-person-plus'}></i> Роль
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Сброс пароля</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите сбросить пароль для пользователя ID: {selectedUserId}?
          Новый пароль будет сгенерирован и (в идеале) отправлен пользователю.
          (Текущая реализация просто выведет сообщение в консоль).
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Отмена
          </Button>
          <Button variant="warning" onClick={handleResetPassword}>
            Сбросить пароль
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsersPage; 