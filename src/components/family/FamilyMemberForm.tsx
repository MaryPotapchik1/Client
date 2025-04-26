import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FamilyMember } from '../../types';

interface FamilyMemberFormProps {
  initialData?: FamilyMember;
  onSubmit: (data: Omit<FamilyMember, 'id' | 'user_id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const FamilyMemberForm: React.FC<FamilyMemberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  error
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [relationType, setRelationType] = useState<'spouse' | 'child'>('child');
  const [documentType, setDocumentType] = useState<'birth_certificate' | 'passport'>('birth_certificate');
  const [documentNumber, setDocumentNumber] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  
  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.first_name || '');
      setLastName(initialData.last_name || '');
      setMiddleName(initialData.middle_name || '');
      setBirthDate(initialData.birth_date ? 
        new Date(initialData.birth_date).toISOString().split('T')[0] : '');
      setRelationType(initialData.relation_type || 'child');
      setDocumentType(initialData.document_type || 'birth_certificate');
      setDocumentNumber(initialData.document_number || '');
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    if (!firstName || !lastName || !birthDate || !documentNumber) {
      setFormError('Пожалуйста, заполните все обязательные поля');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName || undefined,
        birth_date: birthDate,
        relation_type: relationType,
        document_type: documentType,
        document_number: documentNumber
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {(formError || error) && (
        <Alert variant="danger">{formError || error}</Alert>
      )}

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Фамилия*</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Имя*</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Отчество</Form.Label>
            <Form.Control
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Дата рождения*</Form.Label>
            <Form.Control
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Тип родства*</Form.Label>
            <Form.Select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value as 'spouse' | 'child')}
              required
            >
              <option value="spouse">Супруг(а)</option>
              <option value="child">Ребенок</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Тип документа*</Form.Label>
            <Form.Select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as 'birth_certificate' | 'passport')}
              required
            >
              <option value="birth_certificate">Свидетельство о рождении</option>
              <option value="passport">Паспорт</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Номер документа*</Form.Label>
            <Form.Control
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : initialData ? 'Сохранить изменения' : 'Добавить'}
        </Button>
      </div>
    </Form>
  );
};

export default FamilyMemberForm; 