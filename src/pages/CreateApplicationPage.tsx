import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createApplication } from '../store/slices/applicationSlice';
import { setAlert, AlertType } from '../store/slices/alertSlice';
import { CreateApplicationData, UserProfile } from '../types';

 
const validationSchema = Yup.object({
  application_type: Yup.string()
    .required('Выберите тип заявки')
    .oneOf(['housing', 'education', 'healthcare', 'other'], 'Некорректный тип заявки'),
  requested_amount: Yup.number()
    .required('Введите запрашиваемую сумму')
    .positive('Сумма должна быть положительной')
    .max(10000, 'Максимальная сумма - 10,000 BYN'),
  purpose: Yup.string()
    .required('Укажите цель использования средств')
    .min(10, 'Слишком короткое описание (минимум 10 символов)')
    .max(500, 'Слишком длинное описание (максимум 500 символов)'),
  description: Yup.string()
    .max(1000, 'Слишком длинное описание (максимум 1000 символов)'),
});

 
const initialValues: CreateApplicationData = {
  application_type: 'housing',
  requested_amount: 5000,
  purpose: '',
  description: '',
};

const CreateApplicationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.applications);
  const [formSubmitted, setFormSubmitted] = useState(false);

 
  const profile = useAppSelector(state => state.auth.profile);
  const familyMembers = useAppSelector(state => state.auth.familyMembers);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCheckError, setProfileCheckError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && familyMembers) {
       
        const hasFamily = familyMembers.length > 0;
        
        const hasHousingInfo = !!(profile.housing_type && profile.living_area && profile.ownership_status);
        
        if (hasFamily && hasHousingInfo) {
            setIsProfileComplete(true);
            setProfileCheckError(null);
        } else {
            setIsProfileComplete(false);
            if (!hasFamily) {
                setProfileCheckError('Для подачи заявки необходимо добавить информацию о членах семьи в профиле.');
            } else if (!hasHousingInfo) {
                setProfileCheckError('Для подачи заявки необходимо заполнить информацию о жилищных условиях в профиле.');
            }
        }
    } else {
        
        setIsProfileComplete(false);
        setProfileCheckError('Загрузка данных профиля...'); 
       
    }
  }, [profile, familyMembers]);
 

 
  const getApplicationTypeText = (type: string): string => {
    switch (type) {
      case 'housing': return 'Жилье';
      case 'education': return 'Образование';
      case 'healthcare': return 'Здравоохранение';
      case 'other': return 'Другое';
      default: return type;
    }
  };

  const handleSubmit = (
    values: CreateApplicationData,
    { setSubmitting }: FormikHelpers<CreateApplicationData>
  ) => {
    dispatch(createApplication(values))
      .unwrap()
      .then((response) => {
        dispatch(setAlert({
          type: AlertType.SUCCESS,
          message: 'Заявка успешно создана',
        }));
        setFormSubmitted(true);
         
        navigate(`/applications/${response.application.id}`);
      })
      .catch((err) => {
        console.error('Error creating application:', err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container>
      <h1 className="page-header">Создание новой заявки</h1>

      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {error && (
                <Alert variant="danger">{error}</Alert>
              )}
              
              {formSubmitted ? (
                <div className="text-center py-4">
                  <h4 className="text-success mb-3">Заявка успешно создана!</h4>
                  <p>Вы будете перенаправлены на страницу с деталями заявки.</p>
                  <div className="spinner-border text-primary mt-2" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                </div>
              ) : (
                <>
                {/* ---> Отображение ошибки проверки профиля */}
                {!isProfileComplete && profileCheckError && profileCheckError !== 'Загрузка данных профиля...' && (
                    <Alert variant="warning"> 
                       <Alert.Heading>Неполные данные профиля</Alert.Heading>
                       <p>{profileCheckError}</p> 
                       <p>Пожалуйста, перейдите на <Alert.Link href="/profile">страницу профиля</Alert.Link>, чтобы дополнить информацию.</p> 
                    </Alert>
                )}
                 {/* <--- Конец ошибки */}

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ handleSubmit, isSubmitting, values }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <h5>Тип заявки</h5>
                        <p className="text-muted small">
                          Выберите цель, на которую будут использованы средства материнского капитала.
                        </p>
                        <div className="mb-3">
                          <Field
                            as={Form.Select}
                            name="application_type"
                            aria-label="Тип заявки"
                          >
                            <option value="housing">Улучшение жилищных условий</option>
                            <option value="education">Образование детей</option>
                            <option value="healthcare">Здравоохранение</option>
                            <option value="other">Другое</option>
                          </Field>
                          <ErrorMessage name="application_type" component={Form.Text} className="text-danger" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5>Запрашиваемая сумма</h5>
                        <p className="text-muted small">
                          Укажите сумму средств материнского капитала, которую вы хотите использовать.
                          Максимальная сумма - 10,000 BYN.
                        </p>
                        <div className="mb-3">
                          <Field
                            as={Form.Control}
                            type="number"
                            name="requested_amount"
                            min="0"
                            max="10000"
                          />
                          <ErrorMessage name="requested_amount" component={Form.Text} className="text-danger" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5>Цель использования средств</h5>
                        <p className="text-muted small">
                          Кратко опишите, на что конкретно будут использованы средства.
                        </p>
                        <div className="mb-3">
                          <Field
                            as={Form.Control}
                            type="text"
                            name="purpose"
                            placeholder="Например: Покупка квартиры для семьи в г. Минск"
                          />
                          <ErrorMessage name="purpose" component={Form.Text} className="text-danger" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5>Подробное описание (необязательно)</h5>
                        <p className="text-muted small">
                          Предоставьте дополнительную информацию о вашей заявке,
                          если считаете это необходимым.
                        </p>
                        <div className="mb-3">
                          <Field
                            as="textarea"
                            name="description"
                            rows={4}
                            placeholder="Дополнительная информация"
                            className="form-control"
                          />
                          <ErrorMessage name="description" component={Form.Text} className="text-danger" />
                        </div>
                      </div>

                      <div className="pt-3 border-top">
                        <Row>
                          <Col sm={6} className="mb-2 mb-sm-0">
                            <Button
                              variant="outline-secondary"
                              className="w-100"
                              onClick={() => navigate('/applications')}
                            >
                              Отмена
                            </Button>
                          </Col>
                          <Col sm={6}>
                            <Button
                              variant="primary"
                              type="submit"
                              className="w-100"
                              // disabled={isSubmitting || loading || !isProfileComplete}
                            >
                              {loading ? 'Создание...' : 'Создать заявку'}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  )}
                </Formik>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateApplicationPage; 