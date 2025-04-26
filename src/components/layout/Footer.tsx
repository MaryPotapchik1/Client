import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Родительский Капитал</h5>
            <p className="text-muted">
              Информационная система учета и распределения материнского капитала
            </p>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h6>Информация</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Главная</Link></li>
              <li><Link to="/info" className="text-light">Информация</Link></li>
              <li><Link to="/faq" className="text-light">FAQ</Link></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4 mb-md-0">
            <h6>Пользователям</h6>
            <ul className="list-unstyled">
              {!isAuthenticated && (
                <>
                  <li><Link to="/login" className="text-light">Вход</Link></li>
                  <li><Link to="/register" className="text-light">Регистрация</Link></li>
                </>
              )}
              {isAuthenticated && (
                 <li><Link to="/profile" className="text-light">Профиль</Link></li>
              )}
              <li><Link to="/applications/create" className="text-light">Подать заявку</Link></li>
              <li><Link to="/contact" className="text-light">Консультация</Link></li>
            </ul>
          </Col>
          
        
        </Row>
        
        <hr className="my-3" />
        
        <div className="text-center text-muted">
          <small>&copy; {currentYear} Родительский Капитал. Все права защищены.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer; 