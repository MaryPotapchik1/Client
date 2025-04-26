import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import {
  getInfoMaterials,
  createInfoMaterial,
  updateInfoMaterial,
  deleteInfoMaterial,
  clearInfoError
} from '../../store/slices/infoSlice';
import { InfoMaterial } from '../../types';
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
  Pagination,
  Badge
} from 'react-bootstrap';

const ITEMS_PER_PAGE = 10;

 
const MATERIAL_CATEGORIES = [
  { value: 'general_info', label: 'Общая информация' },
  { value: 'how_to_get', label: 'Как получить' },
  { value: 'housing', label: 'Жилье' },
  { value: 'education', label: 'Образование' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'legislation', label: 'Законодательство' }
];

const AdminInfoMaterialsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { materials, loading, error } = useSelector((state: RootState) => state.info);
  const [showModal, setShowModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<InfoMaterial> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getInfoMaterials({}));
    return () => {
      dispatch(clearInfoError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (currentMaterial) {
      setTitle(currentMaterial.title || '');
      setContent(currentMaterial.content || '');
      setCategory(currentMaterial.category || '');
      setIsPublished(currentMaterial.is_published || false);
      setFormError(null);  
    }
  }, [currentMaterial]);

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMaterial(null);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setIsPublished(false);
    setFormError(null);
  };

  const handleShowAddModal = () => {
    setCurrentMaterial({});
    setIsEditing(false);
    resetForm();
    setShowModal(true);
  };

  const handleShowEditModal = (material: InfoMaterial) => {
    setCurrentMaterial(material);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleShowDeleteConfirm = (id: number) => {
    setMaterialToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setMaterialToDelete(null);
  };

  const handleDelete = () => {
    if (materialToDelete !== null) {
      dispatch(deleteInfoMaterial(materialToDelete)).then(() => {
        handleCloseDeleteConfirm();
      });
    }
  };

  const validateForm = (): boolean => {
      if (!title.trim()) {
          setFormError("Заголовок не может быть пустым.");
          return false;
      }
      if (!content.trim()) {
          setFormError("Содержимое не может быть пустым.");
          return false;
      }
      if (!category.trim()) {
          setFormError("Категория не может быть пустой.");
          return false;
      }
      setFormError(null);
      return true;
  };

 
  const getCategoryLabel = (categoryValue: string): string => {
    const category = MATERIAL_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    const materialData = {
      title,
      content,
      category,
      is_published: isPublished,
    };

    if (isEditing && currentMaterial?.id) {
      dispatch(updateInfoMaterial({ id: currentMaterial.id, data: materialData }))
        .unwrap()  
        .then(() => {
          handleCloseModal();
    
          dispatch(getInfoMaterials({}));
        })
        .catch((error) => {
          setFormError(error || "Не удалось обновить материал.");
        });
    } else {
      dispatch(createInfoMaterial(materialData))
        .unwrap()  
        .then(() => {
          handleCloseModal();
           
          dispatch(getInfoMaterials({}));
        })
        .catch((error) => {
          setFormError(error || "Не удалось создать материал.");
        });
    }
  };

 
  const totalPages = Math.ceil(materials.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = materials.slice(indexOfFirstItem, indexOfLastItem);

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


  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Управление Информационными Материалами</h2>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={handleShowAddModal}>
            <i className="bi bi-plus-lg me-2"></i>Добавить Материал
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
                <th>Заголовок</th>
                <th>Категория</th>
                
                <th>Дата Создания</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((material, index) => (
                <tr key={material.id}>
                  <td>{index + 1}</td>
                  <td>{material.title}</td>
                  <td>{getCategoryLabel(material.category)}</td>
                  
                  <td>{new Date(material.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowEditModal(material)}
                    >
                      <i className="bi bi-pencil-fill"></i> Редактировать
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleShowDeleteConfirm(material.id)}
                    >
                      <i className="bi bi-trash-fill"></i> Удалить
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center">Информационные материалы не найдены.</td>
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
          <Modal.Title>{isEditing ? 'Редактировать Материал' : 'Добавить Новый Материал'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formMaterialTitle">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMaterialContent">
              <Form.Label>Содержимое</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Введите содержимое материала"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMaterialCategory">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Выберите категорию</option>
                {MATERIAL_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

 

            <Button variant="secondary" onClick={handleCloseModal} className="me-2">
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : ''}
              {isEditing ? ' Сохранить Изменения' : ' Добавить Материал'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтверждение Удаления</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить этот материал?</Modal.Body>
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

export default AdminInfoMaterialsPage; 