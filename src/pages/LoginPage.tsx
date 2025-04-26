import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, clearError } from '../store/slices/authSlice';
import { setAlert, AlertType } from '../store/slices/alertSlice';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
   
    if (isAuthenticated) {
      navigate('/');
    }
    
   
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Пожалуйста, заполните все поля');
      return;
    }
    
    dispatch(login({ email, password }))
      .unwrap()
      .then((authResponse) => {
      
        if (authResponse.user && authResponse.user.role === 'admin') {
          navigate('/admin');  
        } else {
        
          const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
          navigate(redirectUrl);
          localStorage.removeItem('redirectAfterLogin');  
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        setFormError('Неверный логин или пароль');
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Вход в систему</h2>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Введите email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Пожалуйста, введите корректный email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Пожалуйста, введите пароль.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Загрузка...' : 'Войти'}
                </Button>
              </Form>
              
              <div className="text-center mt-3">
                <p>
                  Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage; 