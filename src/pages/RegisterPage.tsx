import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { register, clearError } from '../store/slices/authSlice';
import { setAlert, AlertType } from '../store/slices/alertSlice';
import { RegisterData } from '../types';

 
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(6, 'Пароль должен быть не менее 6 символов')
    .required('Пароль обязателен'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
  profile: Yup.object({
    first_name: Yup.string().required('Имя обязательно'),
    last_name: Yup.string().required('Фамилия обязательна'),
    birth_date: Yup.date().required('Дата рождения обязательна'),
    passport_series: Yup.string()
      .required('Серия паспорта обязательна')
      .matches(/^[A-Z]{2}$/, 'Серия должна содержать 2 заглавные буквы'),
    passport_number: Yup.string()
      .required('Номер паспорта обязателен')
      .matches(/^\d{7}$/, 'Номер должен содержать 7 цифр'),
    address: Yup.string().required('Адрес обязателен'),
    phone: Yup.string()
      .required('Телефон обязателен')
      .matches(/^\+375\d{9}$/, 'Формат: +375XXXXXXXXX'),
    has_maternal_capital: Yup.boolean(),
    maternal_capital_amount: Yup.number().when(['has_maternal_capital'], {
      is: (has_maternal_capital: boolean) => has_maternal_capital === true,
      then: () => Yup.number()
        .required('Сумма обязательна')
        .positive('Сумма должна быть положительной')
    }),
  }),
});

 
const initialValues = {
  email: '',
  password: '',
  confirmPassword: '',
  profile: {
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    passport_series: '',
    passport_number: '',
    address: '',
    phone: '',
    has_maternal_capital: false,
    maternal_capital_amount: 10000,
  },
  familyMembers: [],
  documents: [],
};

const RegisterPage: React.FC = () => {
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

  const handleSubmit = (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    
    const { confirmPassword, ...registerData } = values;
    
    dispatch(register(registerData as RegisterData))
      .unwrap()
      .then(() => {
        dispatch(setAlert({ 
          type: AlertType.SUCCESS, 
          message: 'Вы успешно зарегистрировались в системе' 
        }));
        navigate('/');
      })
      .catch((err) => {
        console.error('Error during registration:', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="shadow mb-5">
            <Card.Body>
              <h2 className="text-center mb-4">Регистрация</h2>
              
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, isSubmitting, values, setFieldValue }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <h4 className="mt-4 mb-3">Данные аккаунта</h4>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Field
                            as={Form.Control}
                            type="email"
                            name="email"
                            placeholder="Введите email"
                          />
                          <ErrorMessage name="email" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="password">
                          <Form.Label>Пароль</Form.Label>
                          <Field
                            as={Form.Control}
                            type="password"
                            name="password"
                            placeholder="Введите пароль"
                          />
                          <ErrorMessage name="password" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                          <Form.Label>Подтверждение пароля</Form.Label>
                          <Field
                            as={Form.Control}
                            type="password"
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                          />
                          <ErrorMessage name="confirmPassword" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <h4 className="mt-4 mb-3">Личные данные</h4>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="first_name">
                          <Form.Label>Имя</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.first_name"
                            placeholder="Введите имя"
                          />
                          <ErrorMessage name="profile.first_name" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="last_name">
                          <Form.Label>Фамилия</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.last_name"
                            placeholder="Введите фамилию"
                          />
                          <ErrorMessage name="profile.last_name" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="middle_name">
                          <Form.Label>Отчество (необязательно)</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.middle_name"
                            placeholder="Введите отчество"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="birth_date">
                          <Form.Label>Дата рождения</Form.Label>
                          <Field
                            as={Form.Control}
                            type="date"
                            name="profile.birth_date"
                          />
                          <ErrorMessage name="profile.birth_date" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="passport_series">
                          <Form.Label>Серия паспорта</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.passport_series"
                            placeholder="MP"
                          />
                          <ErrorMessage name="profile.passport_series" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3" controlId="passport_number">
                          <Form.Label>Номер паспорта</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.passport_number"
                            placeholder="1234567"
                          />
                          <ErrorMessage name="profile.passport_number" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="address">
                          <Form.Label>Адрес</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.address"
                            placeholder="Введите адрес"
                          />
                          <ErrorMessage name="profile.address" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label>Телефон</Form.Label>
                          <Field
                            as={Form.Control}
                            type="text"
                            name="profile.phone"
                            placeholder="+375XXXXXXXXX"
                          />
                          <ErrorMessage name="profile.phone" component={Form.Text} className="text-danger" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="has_maternal_capital">
                          <Form.Check 
                            type="checkbox"
                            label="Есть материнский капитал"
                            name="profile.has_maternal_capital"
                            checked={values.profile.has_maternal_capital}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setFieldValue('profile.has_maternal_capital', e.target.checked)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        {values.profile.has_maternal_capital && (
                          <Form.Group className="mb-3" controlId="maternal_capital_amount">
                            <Form.Label>Сумма материнского капитала</Form.Label>
                            <Field
                              as={Form.Control}
                              type="number"
                              name="profile.maternal_capital_amount"
                            />
                            <ErrorMessage name="profile.maternal_capital_amount" component={Form.Text} className="text-danger" />
                          </Form.Group>
                        )}
                      </Col>
                    </Row>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mt-4"
                      disabled={isSubmitting || loading}
                    >
                      {(isSubmitting || loading) ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                  </Form>
                )}
              </Formik>
              
              <div className="text-center mt-3">
                <p>
                  Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage; 