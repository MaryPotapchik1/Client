import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { Container, Navbar, Nav, NavDropdown, Button, Badge } from 'react-bootstrap';

const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            Панель Администратора
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-navbar-nav" />
          
          <Navbar.Collapse id="admin-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin/applications">Заявки</Nav.Link>
              <Nav.Link as={Link} to="/admin/users">Пользователи</Nav.Link>
              <NavDropdown title="Информация" id="admin-info-dropdown">
                <NavDropdown.Item as={Link} to="/admin/info-materials">
                  Информационные материалы
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/faq">
                  FAQ
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={Link} to="/admin/consultations">
                Консультации <Badge bg="warning" text="dark">Новые</Badge>
              </Nav.Link>
            </Nav>
            
            <Nav>
              <Nav.Link as={Link} to="/">
                <Button variant="outline-light" size="sm">
                  К сайту
                </Button>
              </Nav.Link>
              
              <NavDropdown title={user?.email || 'Администратор'} id="admin-dropdown" align="end">
                 
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Выйти
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader; 