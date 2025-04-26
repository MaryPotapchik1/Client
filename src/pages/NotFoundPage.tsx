import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFoundPage: React.FC = () => {
  return (
    <Container className="text-center my-5 py-5">
      <Row>
        <Col>
          <h1 className="display-1 fw-bold">404</h1>
          <h2 className="mb-4">Страница не найдена</h2>
          <p className="lead mb-4">
            Извините, запрашиваемая страница не существует или была удалена.
          </p>
          <div>
            <Link to="/">
              <Button variant="primary" size="lg" className="me-3">
                На главную
              </Button>
            </Link>
            <Link to="/info">
              <Button variant="outline-secondary" size="lg">
                Информационные материалы
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <p>
            Возможно, вы ищете:
          </p>
          <ul className="list-unstyled">
            <li><Link to="/applications">Мои заявки</Link></li>
            <li><Link to="/applications/create">Подать новую заявку</Link></li>
            <li><Link to="/faq">Часто задаваемые вопросы</Link></li>
            <li><Link to="/contact">Связаться с нами</Link></li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage; 