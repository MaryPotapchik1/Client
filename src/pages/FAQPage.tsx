import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { getAllPublicFAQs } from '../store/slices/infoSlice';
import { Accordion, Card, Form, InputGroup, Button, Spinner, Alert, Badge } from 'react-bootstrap';

 
const FAQ_CATEGORIES = [
  { value: 'general', label: 'Общие вопросы' },
  { value: 'application', label: 'Заявки' },
  { value: 'housing', label: 'Жилье' },
  { value: 'education', label: 'Образование' },
  { value: 'healthcare', label: 'Здравоохранение' },
  { value: 'documents', label: 'Документы' },
  { value: 'legislation', label: 'Законодательство' }
];

const FAQPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { faqs, loading, error } = useAppSelector((state) => state.info);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<any[]>([]);
 
  const [showAll, setShowAll] = useState(true);

 
  useEffect(() => {
   
    console.log('Запрашиваю ВСЕ FAQ для страницы');
    dispatch(getAllPublicFAQs());
  }, [dispatch]);

  
  useEffect(() => {
    console.log('Начинаю фильтрацию FAQ, всего FAQ в базе:', faqs.length);
    
    if (faqs && faqs.length > 0) {
       
      let availableFaqs = showAll ? faqs : faqs.filter(faq => faq.is_published);
      console.log('Доступные FAQ:', availableFaqs.length);
      
      if (searchTerm.trim() === '') {
        console.log('Нет поискового запроса, отображаю все доступные FAQ');
        setFilteredFaqs(availableFaqs);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = availableFaqs.filter(
          (faq) =>
            faq.question.toLowerCase().includes(term) ||
            faq.answer.toLowerCase().includes(term) ||
            (faq.category && faq.category.toLowerCase().includes(term))
        );
        console.log('Отфильтровано FAQ по поиску:', filtered.length);
        setFilteredFaqs(filtered);
      }
    } else {
      console.log('Список FAQ пуст');
      setFilteredFaqs([]);
    }
  }, [faqs, searchTerm, showAll]);

 
  const getCategoryLabel = (categoryValue: string): string => {
    const category = FAQ_CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

 
  const getCategoryColor = (categoryValue: string): string => {
    switch(categoryValue) {
      case 'general': return 'primary';
      case 'application': return 'success';
      case 'housing': return 'info';
      case 'education': return 'warning';
      case 'healthcare': return 'danger';
      case 'documents': return 'secondary';
      case 'legislation': return 'dark';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка часто задаваемых вопросов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Ошибка загрузки</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="faq-page my-4">
      <h1 className="mb-4">Часто задаваемые вопросы</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <p>
            На этой странице собраны ответы на часто задаваемые вопросы о материнском капитале.
            Если вы не нашли ответ на свой вопрос, воспользуйтесь поиском или
            <Button variant="link" className="p-0 ms-1 align-baseline" href="/contact">
              запросите консультацию
            </Button>.
          </p>
          
          <Form>
            <InputGroup className="mb-0">
              <InputGroup.Text>
                🔍
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Поиск по вопросам и ответам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setSearchTerm('')}
                >
                  Очистить
                </Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {filteredFaqs.length === 0 ? (
        <Alert variant="info">
          <p className="mb-0">По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или задать свой вопрос.</p>
        </Alert>
      ) : (
        <Accordion flush>
          {filteredFaqs.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={faq.id}>
              <Accordion.Header>
                <div>
                  {faq.question}
                  {faq.category && (
                    <Badge bg={getCategoryColor(faq.category)} className="ms-2">
                      {getCategoryLabel(faq.category)}
                    </Badge>
                  )}
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
      
      <Card className="mt-4 bg-light">
        <Card.Body>
          <h5>Остались вопросы?</h5>
          <p className="mb-0">
            Если вы не нашли ответ на свой вопрос, вы можете 
            <Button variant="primary" href="/contact" className="ms-2">
              Запросить консультацию
            </Button>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FAQPage; 