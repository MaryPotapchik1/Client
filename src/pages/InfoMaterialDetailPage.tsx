import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { getInfoMaterialById } from '../store/slices/infoSlice';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';

 
const MATERIAL_CATEGORIES = [
  { value: 'general_info', label: 'Общая информация' },
  { value: 'how_to_get', label: 'Как получить' },
  { value: 'housing', label: 'Жилье' },
  { value: 'education', label: 'Образование' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'legislation', label: 'Законодательство' }
];

const InfoMaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentMaterial, loading, error } = useAppSelector((state) => state.info);

  useEffect(() => {
    if (id) {
      dispatch(getInfoMaterialById(parseInt(id)));
    }
  }, [dispatch, id]);

   
  const getCategoryLabel = (categoryValue: string): string => {
    const category = MATERIAL_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка информации...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
          <Link to="/info" className="btn btn-outline-primary mt-3">
            Вернуться к списку материалов
          </Link>
        </Alert>
      </div>
    );
  }

  if (!currentMaterial) {
    return (
      <div className="my-5">
        <Alert variant="warning">
          <Alert.Heading>Материал не найден</Alert.Heading>
          <p>Запрашиваемый информационный материал не существует или был удален.</p>
          <Link to="/info" className="btn btn-outline-primary mt-3">
            Вернуться к списку материалов
          </Link>
        </Alert>
      </div>
    );
  }

  return (
    <div className="info-material-detail-page my-4">
      <Link to="/info" className="btn btn-outline-secondary mb-4">
        &larr; Назад к списку материалов
      </Link>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{currentMaterial.title}</h2>
            <span className="badge bg-info">{getCategoryLabel(currentMaterial.category)}</span>
          </div>
        </Card.Header>
        <Card.Body>
          <div 
            className="info-material-content"
            dangerouslySetInnerHTML={{ __html: currentMaterial.content }}
          />
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>
            Опубликовано: {new Date(currentMaterial.created_at).toLocaleDateString()}
            {currentMaterial.updated_at && currentMaterial.updated_at !== currentMaterial.created_at && 
              ` (обновлено: ${new Date(currentMaterial.updated_at).toLocaleDateString()})`
            }
          </small>
        </Card.Footer>
      </Card>

      <div className="mt-4">
        <h4>Возможно, вам также будет интересно:</h4>
        <div className="d-flex flex-column gap-3 mt-3">
          <Link to="/faq" className="btn btn-outline-primary">
            Часто задаваемые вопросы (FAQ)
          </Link>
          <Link to="/contact" className="btn btn-outline-success">
            Запросить консультацию
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoMaterialDetailPage; 