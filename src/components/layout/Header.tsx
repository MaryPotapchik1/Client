import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAppSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Родительский Капитал
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              <Nav.Link as={Link} to="/info">Информация</Nav.Link>
              <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
              <Nav.Link as={Link} to="/contact">Консультация</Nav.Link>
            </Nav>
            
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/applications">Мои заявки</Nav.Link>
                  
                  <NavDropdown title="Личный кабинет" id="user-dropdown" align="end">
                    <NavDropdown.Item as={Link} to="/profile">
                      Профиль
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/applications/create">
                      Подать заявку
                    </NavDropdown.Item>
                    
                    {isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin">
                          Панель администратора
                        </NavDropdown.Item>
                      </>
                    )}
                    
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Выйти
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <Button variant="outline-light" size="sm">
                      Регистрация
                    </Button>
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header; 