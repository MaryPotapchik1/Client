import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { createConsultationRequest } from '../store/slices/infoSlice';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

const ContactPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.info);
  const { user } = useAppSelector((state) => state.auth);
  
  const [name, setName] = useState(user ? `${user.email.split('@')[0]}` : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFormError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
     
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Пожалуйста, введите корректный email');
      return;
    }
    
    try {
      await dispatch(createConsultationRequest({ name, email, phone, subject, message })).unwrap();
      setSubmitted(true);
      
  
      setName(user ? `${user.email.split('@')[0]}` : '');
      setEmail(user ? user.email : '');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setFormError('Произошла ошибка при отправке запроса. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="contact-page my-4">
      <h1 className="mb-4">Заявка на консультацию</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {formError && <Alert variant="danger">{formError}</Alert>}
      
      {submitted ? (
        <Alert variant="success">
          <Alert.Heading>Запрос отправлен</Alert.Heading>
          <p>
            Ваш запрос на консультацию успешно отправлен. Наши специалисты свяжутся с вами в ближайшее время.
          </p>
          <Button 
            variant="outline-success" 
            onClick={() => setSubmitted(false)}
            className="mt-2"
          >
            Отправить еще один запрос
          </Button>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ваше имя <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Необязательно"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Тема обращения <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Сообщение <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </Form.Group>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="mt-3"
                    disabled={loading}
                  >
                    {loading ? 'Отправка...' : 'Отправить запрос'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="bg-light">
              <Card.Body>
                <h5>Как с нами связаться</h5>
                <p className="mb-3">Вы также можете связаться с нами одним из следующих способов:</p>
                
                <p><strong>Телефон:</strong><br />+375 (17) 123-4567</p>
                <p><strong>Email:</strong><br />info@parent-capital.by</p>
                <p><strong>Адрес:</strong><br />г. Минск, ул. Независимости, д. 95</p>
                
                <p className="mt-4"><strong>Режим работы:</strong><br />
                Пн-Пт: 9:00 - 18:00<br />
                Сб, Вс: выходные</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ContactPage; 