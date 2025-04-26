import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  getAdminFAQs,
  createFaq,
  updateFaq,
  deleteFaq,
  clearInfoError
} from '../../store/slices/infoSlice';
import { FAQ, CreateFAQData } from '../../types';
import {
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Badge,
  Pagination
} from 'react-bootstrap';

const ITEMS_PER_PAGE = 10;

 
const FAQ_CATEGORIES = [
  { value: 'general', label: 'Общие вопросы' },
  { value: 'application', label: 'Заявки' },
  { value: 'housing', label: 'Жилье' },
  { value: 'education', label: 'Образование' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'documents', label: 'Документы' },
  { value: 'legislation', label: 'Законодательство' },
  {value: 'eligibility', label: 'Приемлемость'},
  {value: 'amount', label: 'Сумма'},
  {value: 'timeframe', label: 'Время'},
  {value: 'disbursement', label: 'Выплаты'},
  {value: 'taxes', label: 'Налоги'},
  {value: 'eligibility', label: 'Приемлемость'},
  {value: 'usage', label: 'Использование'},
];

const AdminFAQPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { faqs, loading, error } = useSelector((state: RootState) => state.info);
  const [showModal, setShowModal] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<FAQ> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

 
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Админ запрашивает список FAQ...');
    dispatch(getAdminFAQs());
    return () => {
      dispatch(clearInfoError());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log('Админ получил FAQ из Redux:', faqs);
    console.log('Количество FAQ для админа:', faqs.length);
    if (currentFaq) {
      setQuestion(currentFaq.question || '');
      setAnswer(currentFaq.answer || '');
      setCategory(currentFaq.category || '');
      setIsPublished(currentFaq.is_published || true);
      setFormError(null);  
    }
  }, [currentFaq, faqs, dispatch]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentFaq(null);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setCategory('');
    setIsPublished(true);
    setFormError(null);
  };

  const handleShowAddModal = () => {
    setCurrentFaq({});
    setIsEditing(false);
    resetForm();
    setShowModal(true);
  };

  const handleShowEditModal = (faq: FAQ) => {
    setCurrentFaq(faq);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleShowDeleteConfirm = (id: number) => {
    setFaqToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setFaqToDelete(null);
  };

  const handleDelete = () => {
    if (faqToDelete !== null) {
      dispatch(deleteFaq(faqToDelete))
        .unwrap()
        .then(() => {
          handleCloseDeleteConfirm();
           
          dispatch(getAdminFAQs());
        })
        .catch((error) => {
          console.error('Error deleting FAQ:', error);
        });
    }
  };

  const validateForm = (): boolean => {
    if (!question.trim()) {
      setFormError("Вопрос не может быть пустым.");
      return false;
    }
    if (!answer.trim()) {
      setFormError("Ответ не может быть пустым.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    const faqData: CreateFAQData = {
      question,
      answer,
      category: category || undefined,
      is_published: isPublished
    };

    if (isEditing && currentFaq?.id) {
      dispatch(updateFaq({ id: currentFaq.id, data: faqData }))
        .unwrap()  
        .then(() => {
          handleCloseModal();
           
          dispatch(getAdminFAQs());
        })
        .catch((error) => {
          setFormError(error || "Не удалось обновить FAQ.");
        });
    } else {
      dispatch(createFaq(faqData))
        .unwrap()  
        .then(() => {
          handleCloseModal();
       
          dispatch(getAdminFAQs());
        })
        .catch((error) => {
          setFormError(error || "Не удалось создать FAQ.");
        });
    }
  };

 
  const totalPages = Math.ceil(faqs.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>,
      );
    }
    return items;
  };

 
  const getCategoryLabel = (categoryValue: string): string => {
    console.log('categoryValue', categoryValue);
    
    const category = FAQ_CATEGORIES.find(cat => cat.value == categoryValue);
    console.log(category);
    
    return category ? category.label : categoryValue;
  };
console.log('currentItems', currentItems);



  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Управление FAQ</h2>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            <i className="bi bi-plus-lg me-2"></i>Добавить FAQ
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">Ошибка: {error}</Alert>}

      {loading && !showModal && !showDeleteConfirm ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Вопрос</th>
                <th>Категория</th>
                <th>Опубликовано</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.id}</td>
                  <td>{faq.question}</td>
                  <td>{faq.category ? getCategoryLabel(faq.category) : 'Без категории'}</td>
                  <td>
                    <Badge bg={faq.is_published ? 'success' : 'secondary'}>
                      {faq.is_published ? 'Да' : 'Нет'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEditModal(faq)}
                    >
                      <i className="bi bi-pencil-fill"></i> Редактировать
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleShowDeleteConfirm(faq.id)}
                    >
                      <i className="bi bi-trash-fill"></i> Удалить
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center">FAQ не найдены.</td>
                </tr>
              )}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              {renderPaginationItems()}
            </Pagination>
          )}
        </>
      )}

      {/* Модальное окно Добавления/Редактирования */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Редактировать FAQ' : 'Добавить Новый FAQ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFaqQuestion">
              <Form.Label>Вопрос</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите вопрос"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFaqAnswer">
              <Form.Label>Ответ</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Введите ответ"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFaqCategory">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Выберите категорию</option>
                {FAQ_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFaqPublished">
              <Form.Check
                type="checkbox"
                label="Опубликовано"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
            </Form.Group>

            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ''}
              {isEditing ? ' Сохранить Изменения' : ' Добавить FAQ'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение Удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить этот FAQ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ''}
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminFAQPage; 