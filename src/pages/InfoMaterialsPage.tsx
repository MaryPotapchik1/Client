import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getInfoMaterials } from '../store/slices/infoSlice';
import { InfoMaterial } from '../types';
import { FaSearch } from 'react-icons/fa';

const InfoMaterialsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { materials, loading, error } = useAppSelector(state => state.info);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

 
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
    } else {
      setCategoryFilter('all');
    }
   
    dispatch(getInfoMaterials({}));
  }, [dispatch, location.search]);

 
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  
  const filteredMaterials = materials.filter(material => {
 
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.content.toLowerCase().includes(searchTerm.toLowerCase());
    
 
    const matchesCategory = categoryFilter === 'all' || material.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

 
  const getCategoryText = (category: string): string => {
    switch (category) {
      case 'general_info': return 'Общая информация';
      case 'how_to_get': return 'Как получить';
      case 'housing': return 'Жилье';
      case 'education': return 'Образование';
      case 'healthcare': return 'Здравоохранение';
      case 'legislation': return 'Законодательство';
      default: return category;
    }
  };

  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'general_info': return 'primary';
      case 'how_to_get': return 'info';
      case 'housing': return 'success';
      case 'education': return 'warning';
      case 'healthcare': return 'danger';
      case 'legislation': return 'dark';
      default: return 'secondary';
    }
  };

 
  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    dispatch(getInfoMaterials({}));
  };

  return (
    <Container>
      <h1 className="page-header">Информационные материалы</h1>

      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text id="search-addon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Поиск по материалам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Поиск"
              aria-describedby="search-addon"
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select 
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            aria-label="Фильтр по категории"
          >
            <option value="all">Все категории</option>
            <option value="general_info">Общая информация</option>
            <option value="how_to_get">Как получить</option>
            <option value="housing">Жилье</option>
            <option value="education">Образование</option>
            <option value="healthcare">Здравоохранение</option>
            <option value="legislation">Законодательство</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Загрузка информационных материалов...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          {error}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="alert alert-info">
          {searchTerm 
            ? 'По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос или фильтр.' 
            : 'В данной категории нет информационных материалов.'}
        </div>
      ) : (
        <Row>
          {filteredMaterials.map((material: InfoMaterial) => (
            <Col md={6} lg={4} className="mb-4" key={material.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Badge bg={getCategoryColor(material.category)} className="mb-2">
                    {getCategoryText(material.category)}
                  </Badge>
                  <Card.Title>{material.title}</Card.Title>
                  <Card.Text>
                    {material.content.length > 150 
                      ? `${material.content.substring(0, 150)}...` 
                      : material.content}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Обновлено: {formatDate(material.updated_at)}
                  </small>
                  <Button 
                    as={Link}
                    to={`/info/${material.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    Подробнее
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default InfoMaterialsPage; 