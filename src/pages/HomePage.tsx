import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button   } from 'react-bootstrap';  
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { getInfoMaterials } from '../store/slices/infoSlice';

 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

 
const sliderStyles = `
.slick-slide {
  padding: 0 10px; /* Отступы между слайдами */
}
.info-material-card {
  height: 250px; /* Фиксированная высота карточки */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.info-material-card .card-body {
  overflow: hidden;
}
.info-material-card .card-title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.info-material-card .card-text {
  font-size: 0.9rem;
  color: #6c757d; /* Серый цвет текста */
}
`;

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const { materials, loading } = useAppSelector(state => state.info);
  const recentMaterials = materials.slice(0, 6);  

  useEffect(() => {
    dispatch(getInfoMaterials({ limit: 6 }));  
  }, [dispatch]);

  
  const sliderSettings = {
    dots: true,
    infinite: recentMaterials.length > 3,  
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 992,  
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,  
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="home-page">
      {/* Добавляем стили в head */}
      <style>{sliderStyles}</style>
      
      {/* Раздел баннер */}
      <section className="banner bg-light py-5 mb-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 mb-4">Родительский капитал</h1>
              <p className="lead mb-4">
                Информационная система учета и распределения материнского капитала.
                Узнайте о возможностях использования материнского капитала для улучшения
                жизни вашей семьи.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <Button as={Link} to="/applications/create" variant="primary" size="lg">
                    Подать заявку
                  </Button>
                ) : (
                  <Button as={Link} to="/register" variant="primary" size="lg">
                    Зарегистрироваться
                  </Button>
                )}
                <Button as={Link} to="/info" variant="outline-primary" size="lg">
                  Узнать больше
                </Button>
              </div>
            </Col>
            {/* <Col lg={6} className="mt-4 mt-lg-0">
              <img
                src="./../../public/i.jpg"
                alt="Счастливая семья"
                className="img-fluid rounded shadow"
              />
            </Col> */}
          </Row>
        </Container>
      </section>

      {/* Раздел информации о системе */}
      <section className="features py-5 mb-5">
        <Container>
          <h2 className="text-center mb-5">Возможности системы</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-house-heart fs-1 text-primary"></i>
                  </div>
                  <Card.Title>Жилье</Card.Title>
                  <Card.Text>
                    Улучшение жилищных условий с использованием материнского капитала.
                    Покупка, строительство или реконструкция жилья.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button as={Link} to="/info?category=housing" variant="outline-primary" className="w-100">
                    Подробнее
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-mortarboard fs-1 text-primary"></i>
                  </div>
                  <Card.Title>Образование</Card.Title>
                  <Card.Text>
                    Оплата образования детей с использованием материнского капитала.
                    Школа, детский сад, университет и дополнительное образование.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button as={Link} to="/info?category=education" variant="outline-primary" className="w-100">
                    Подробнее
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-heart-pulse fs-1 text-primary"></i>
                  </div>
                  <Card.Title>Здоровье</Card.Title>
                  <Card.Text>
                    Оплата медицинских услуг для детей с использованием материнского капитала.
                    Лечение, реабилитация и приобретение средств реабилитации.
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Button as={Link} to="/info?category=healthcare" variant="outline-primary" className="w-100">
                    Подробнее
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

     
      <section className="info-materials py-5 bg-light mb-5">
        <Container>
          <h2 className="text-center mb-5">Последние информационные материалы</h2>
          
          {loading && recentMaterials.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            </div>
          ) : recentMaterials.length > 0 ? (
           
            <Slider {...sliderSettings} className="info-carousel">
              {recentMaterials.map((material) => (
                 
                <div key={material.id}>
              
                  <Card className="h-100 shadow-sm info-material-card">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{material.title}</Card.Title>
                      <Card.Text className="flex-grow-1">
                        {material.content.substring(0, 120)}...
                      </Card.Text>
                      <Button 
                        as={Link} 
                        to={`/info/${material.id}`} 
                        variant="outline-primary" 
                        size="sm"
                        className="mt-auto align-self-start"
                      >
                        Читать полностью
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-3">
              <p>Информационные материалы не найдены.</p>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Button as={Link} to="/info" variant="primary">
              Все информационные материалы
            </Button>
          </div>
        </Container>
      </section>

      {/* Вызов к действию */}
      <section className="cta py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-3">Готовы воспользоваться материнским капиталом?</h2>
          <p className="lead mb-4">
            Создайте аккаунт и подайте заявку на использование материнского капитала уже сегодня.
          </p>
          {isAuthenticated ? (
            <Button as={Link} to="/applications/create" variant="light" size="lg">
              Подать заявку
            </Button>
          ) : (
            <Button as={Link} to="/register" variant="light" size="lg">
              Зарегистрироваться
            </Button>
          )}
        </Container>
      </section>
    </div>
  );
};

export default HomePage; 