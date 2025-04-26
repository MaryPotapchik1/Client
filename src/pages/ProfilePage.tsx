import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal, ListGroup, Table } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchUserProfile, addFamilyMember, updateFamilyMember, deleteFamilyMember, updateProfile, createProfile, clearError } from '../store/slices/authSlice';
import { changePassword } from '../services/authService';
import { FamilyMember, UserProfile } from '../types';
import FamilyMemberForm from '../components/family/FamilyMemberForm';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const userEmail = useAppSelector((state) => state.auth.user?.email);
  const profile = useAppSelector((state) => state.auth.profile);
  const familyMembers = useAppSelector((state) => state.auth.familyMembers);
  const documents = useAppSelector((state) => state.auth.documents);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

 
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

 
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showFamilyMemberModal, setShowFamilyMemberModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [familyError, setFamilyError] = useState<string | null>(null);

  
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileMiddleName, setProfileMiddleName] = useState('');
  const [profileBirthDate, setProfileBirthDate] = useState('');
  const [profilePassportSeries, setProfilePassportSeries] = useState('');
  const [profilePassportNumber, setProfilePassportNumber] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [hasMaternalCapital, setHasMaternalCapital] = useState(false);
  const [maternalCapitalAmount, setMaternalCapitalAmount] = useState(0);

 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 
  const [housingType, setHousingType] = useState<UserProfile['housing_type'] | '' >('');
  const [livingArea, setLivingArea] = useState<number | '' >('');
  const [ownershipStatus, setOwnershipStatus] = useState<UserProfile['ownership_status'] | '' >('');
 
  useEffect(() => {
    console.log('Effect [userId] run. User ID:', userId);
    if (userId) {
      dispatch(fetchUserProfile())
        .unwrap()
        .catch(error => {
          console.error('Ошибка загрузки профиля:', error);
          setProfileError('Не удалось загрузить данные профиля');
        });
    } else {
      console.log("Условие для fetchUserProfile не выполнено (userId:", userId, ")");
    }
  }, [userId]);

 
  useEffect(() => {
    if (profile) {
      setProfileFirstName(profile.first_name || '');
      setProfileLastName(profile.last_name || '');
      setProfileMiddleName(profile.middle_name || '');
      setProfileBirthDate(profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : '');
      setProfilePassportSeries(profile.passport_series || '');
      setProfilePassportNumber(profile.passport_number || '');
      setProfileAddress(profile.address || '');
      setProfilePhone(profile.phone || '');
      setHasMaternalCapital(profile.has_maternal_capital || false);
      setMaternalCapitalAmount(profile.maternal_capital_amount || 0);
      setHousingType(profile.housing_type || '');
      setLivingArea(profile.living_area || '');
      setOwnershipStatus(profile.ownership_status || '');
    }
  }, [profile]);

 
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    dispatch(clearError());

    try {
      const profileData: Omit<UserProfile, 'user_id'> = {
        first_name: profileFirstName,
        last_name: profileLastName,
        middle_name: profileMiddleName || undefined,
        birth_date: profileBirthDate,
        passport_series: profilePassportSeries,
        passport_number: profilePassportNumber,
        address: profileAddress,
        phone: profilePhone,
        has_maternal_capital: hasMaternalCapital,
        maternal_capital_amount: hasMaternalCapital ? maternalCapitalAmount : 0,
        housing_type: housingType || undefined,
        living_area: typeof livingArea === 'number' ? livingArea : undefined,
        ownership_status: ownershipStatus || undefined
      };

      if (profile) {
        await dispatch(updateProfile(profileData as Partial<Omit<UserProfile, 'user_id'>>)).unwrap();
        setProfileSuccess('Профиль успешно обновлен');
      } else {
        if (!profileFirstName || !profileLastName || !profileBirthDate || !profilePassportSeries || !profilePassportNumber || !profileAddress || !profilePhone || !housingType || livingArea === '' || !ownershipStatus) {
            setProfileError('Пожалуйста, заполните все обязательные поля, включая информацию о жилье.');
            return;
        }
        await dispatch(createProfile(profileData as Omit<UserProfile, 'user_id'>)).unwrap();
        setProfileSuccess('Профиль успешно создан');
      }
      setShowProfileForm(false);
    } catch (error: any) {
      console.error('Ошибка при обновлении/создании профиля:', error);
      if (error && error.message && error.message.includes('404')) {
          setProfileError('Не удалось сохранить профиль. Обработчик на сервере не найден (Ошибка 404). Проверьте реализацию API.');
      } else {
          setProfileError(`Ошибка: ${error.message || error.toString()}`);
      }
    }
  };

 
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    try {
      if (!userEmail) {
        throw new Error('Email пользователя не найден для смены пароля');
      }

      await changePassword(userEmail, currentPassword, newPassword);
      setPasswordSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordError(error.toString());
    }
  };

 
  const openAddFamilyMemberModal = () => {
    setEditingFamilyMember(null);
    setShowFamilyMemberModal(true);
  };

  const openEditFamilyMemberModal = (member: FamilyMember) => {
    setEditingFamilyMember(member);
    setShowFamilyMemberModal(true);
  };

  const closeFamilyMemberModal = () => {
    setShowFamilyMemberModal(false);
    setFamilyError(null);
  };

  const handleDeleteFamilyMember = async (id: number) => {
    try {
      await dispatch(deleteFamilyMember(id)).unwrap();
    } catch (error: any) {
      setFamilyError(error.toString());
    }
  };

  const handleSubmitFamilyMember = async (memberData: Omit<FamilyMember, 'id' | 'user_id'>): Promise<void> => {
    try {
      if (editingFamilyMember && editingFamilyMember.id !== undefined) {
        await dispatch(updateFamilyMember({
          id: editingFamilyMember.id,
          data: memberData
        })).unwrap();
      } else {
        await dispatch(addFamilyMember(memberData)).unwrap();
      }
      closeFamilyMemberModal();
    } catch (error: any) {
      setFamilyError(error.toString());
    }
  };

  console.log("Rendering ProfilePage. Profile:", profile);
  console.log("Rendering ProfilePage. Loading:", loading);

 
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

 
  if (!profile) {
    return (
      <Container className="my-4">
        <Card>
          <Card.Header>
            <h2>Создание профиля</h2>
          </Card.Header>
          <Card.Body>
            {(error || profileError) && <Alert variant="danger">{profileError || error}</Alert>}
            {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}
            
            <Form onSubmit={handleUpdateProfile}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Фамилия *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profileLastName} 
                      onChange={(e) => setProfileLastName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Имя *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profileFirstName} 
                      onChange={(e) => setProfileFirstName(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Отчество</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profileMiddleName} 
                      onChange={(e) => setProfileMiddleName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Дата рождения *</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={profileBirthDate} 
                      onChange={(e) => setProfileBirthDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Серия паспорта *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profilePassportSeries} 
                      onChange={(e) => setProfilePassportSeries(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Номер паспорта *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profilePassportNumber} 
                      onChange={(e) => setProfilePassportNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Адрес *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profileAddress} 
                      onChange={(e) => setProfileAddress(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Телефон *</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox" 
                      label="Есть материнский капитал" 
                      checked={hasMaternalCapital} 
                      onChange={(e) => setHasMaternalCapital(e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                {hasMaternalCapital && (
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Сумма материнского капитала</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={maternalCapitalAmount} 
                        onChange={(e) => setMaternalCapitalAmount(Number(e.target.value))}
                      />
                    </Form.Group>
                  </Col>
                )}
              </Row>

              {/* ---> Секция Жилье при создании */}
              <h4 className="mt-4">Жилищные условия *</h4>
              <Row>
                  <Col md={4}>
                      <Form.Group className="mb-3">
                          <Form.Label>Тип жилья *</Form.Label>
                          <Form.Select 
                              value={housingType} 
                              onChange={(e) => setHousingType(e.target.value as UserProfile['housing_type'])}
                              required
                          >
                              <option value="">Выберите...</option>
                              <option value="own_house">Собственный дом</option>
                              <option value="own_apartment">Собственная квартира</option>
                              <option value="rented">Аренда</option>
                              <option value="social_housing">Социальное жилье</option>
                              <option value="other">Другое</option>
                          </Form.Select>
                      </Form.Group>
                  </Col>
                  <Col md={4}>
                      <Form.Group className="mb-3">
                          <Form.Label>Площадь (кв.м) *</Form.Label>
                          <Form.Control 
                              type="number" 
                              value={livingArea} 
                              onChange={(e) => setLivingArea(e.target.value === '' ? '' : Number(e.target.value))}
                              required
                          />
                      </Form.Group>
                  </Col>
                  <Col md={4}>
                      <Form.Group className="mb-3">
                          <Form.Label>Статус собственности *</Form.Label>
                          <Form.Select 
                              value={ownershipStatus} 
                              onChange={(e) => setOwnershipStatus(e.target.value as UserProfile['ownership_status'])}
                              required
                          >
                              <option value="">Выберите...</option>
                              <option value="sole">Единоличная</option>
                              <option value="joint">Совместная</option>
                              <option value="none">Отсутствует</option>
                          </Form.Select>
                      </Form.Group>
                  </Col>
              </Row>
              {/* <--- Конец секции жилья */}

              <Button variant="primary" type="submit">
                Создать профиль
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

 
  return (
    <Container className="my-4">
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Личные данные</h4>
              <Button variant="outline-primary" onClick={() => setShowProfileForm(!showProfileForm)}>
                {showProfileForm ? 'Отмена' : 'Редактировать'}
              </Button>
            </Card.Header>
            <Card.Body>
              {(error || profileError) && <Alert variant="danger">{profileError || error}</Alert>}
              {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}
              
              {showProfileForm ? (
                <Form onSubmit={handleUpdateProfile}>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profileLastName} 
                          onChange={(e) => setProfileLastName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profileFirstName} 
                          onChange={(e) => setProfileFirstName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Отчество</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profileMiddleName} 
                          onChange={(e) => setProfileMiddleName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Дата рождения</Form.Label>
                        <Form.Control 
                          type="date" 
                          value={profileBirthDate} 
                          onChange={(e) => setProfileBirthDate(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Серия паспорта</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profilePassportSeries} 
                          onChange={(e) => setProfilePassportSeries(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Номер паспорта</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profilePassportNumber} 
                          onChange={(e) => setProfilePassportNumber(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Адрес</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profileAddress} 
                          onChange={(e) => setProfileAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={profilePhone} 
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check 
                          type="checkbox" 
                          label="Есть материнский капитал" 
                          checked={hasMaternalCapital} 
                          onChange={(e) => setHasMaternalCapital(e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                    {hasMaternalCapital && (
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Сумма материнского капитала</Form.Label>
                          <Form.Control 
                            type="number" 
                            value={maternalCapitalAmount} 
                            onChange={(e) => setMaternalCapitalAmount(Number(e.target.value))}
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                  
                  {/* ---> Секция Жилье при редактировании */}
                  <h4 className="mt-4">Жилищные условия</h4>
                   <Row>
                       <Col md={4}>
                           <Form.Group className="mb-3">
                               <Form.Label>Тип жилья</Form.Label>
                               <Form.Select 
                                   value={housingType} 
                                   onChange={(e) => setHousingType(e.target.value as UserProfile['housing_type'])}
                               >
                                   <option value="">Не указано</option>
                                   <option value="own_house">Собственный дом</option>
                                   <option value="own_apartment">Собственная квартира</option>
                                   <option value="rented">Аренда</option>
                                   <option value="social_housing">Социальное жилье</option>
                                   <option value="other">Другое</option>
                               </Form.Select>
                           </Form.Group>
                       </Col>
                       <Col md={4}>
                           <Form.Group className="mb-3">
                               <Form.Label>Площадь (кв.м)</Form.Label>
                               <Form.Control 
                                   type="number" 
                                   value={livingArea} 
                                   onChange={(e) => setLivingArea(e.target.value === '' ? '' : Number(e.target.value))}
                               />
                           </Form.Group>
                       </Col>
                       <Col md={4}>
                           <Form.Group className="mb-3">
                               <Form.Label>Статус собственности</Form.Label>
                               <Form.Select 
                                   value={ownershipStatus} 
                                   onChange={(e) => setOwnershipStatus(e.target.value as UserProfile['ownership_status'])}
                               >
                                   <option value="">Не указано</option>
                                   <option value="sole">Единоличная</option>
                                   <option value="joint">Совместная</option>
                                   <option value="none">Отсутствует</option>
                               </Form.Select>
                           </Form.Group>
                       </Col>
                   </Row>
                   {/* <--- Конец секции жилья */}
                  
                  <Button variant="primary" type="submit">
                    Сохранить
                  </Button>
                </Form>
              ) : (
                <div>
                  <Row>
                    <Col md={4}>
                      <p><strong>ФИО:</strong> {profile?.last_name} {profile?.first_name} {profile?.middle_name || ''}</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Дата рождения:</strong> {profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : ''}</p>
                    </Col>
                    <Col md={4}>
                      <p><strong>Паспорт:</strong> {profile?.passport_series} {profile?.passport_number}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p><strong>Адрес:</strong> {profile?.address}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Телефон:</strong> {profile?.phone}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p>
                        <strong>Материнский капитал:</strong> {profile?.has_maternal_capital ? 'Да' : 'Нет'}
                        {profile?.has_maternal_capital && `, сумма: ${profile?.maternal_capital_amount} руб.`}
                      </p>
                    </Col>
                  </Row>
                  {/* ---> Отображение Жилья */}
                  <h4 className="mt-4">Жилищные условия</h4>
                   <Row>
                      <Col md={4}>
                          <p><strong>Тип жилья:</strong> 
                          {(() => {
                              if (profile && profile.housing_type) {
                                  const key = profile.housing_type;
                                  return housingTypeLabels[key as keyof typeof housingTypeLabels];
                              }
                              return 'Не указано';
                          })()}
                          </p>
                      </Col>
                      <Col md={4}>
                           <p><strong>Площадь:</strong> {profile?.living_area ? `${profile.living_area} кв.м` : 'Не указано'}</p>
                       </Col>
                      <Col md={4}>
                           <p><strong>Статус собственности:</strong> 
                           {(() => {
                               if (profile && profile.ownership_status) {
                                   const key = profile.ownership_status;
                                   return ownershipStatusLabels[key as keyof typeof ownershipStatusLabels];
                               }
                               return 'Не указано';
                           })()}
                           </p>
                       </Col>
                   </Row>
                   {/* <--- Конец отображения жилья */}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Члены семьи</h4>
              <Button variant="outline-success" onClick={openAddFamilyMemberModal}>Добавить члена семьи</Button>
            </Card.Header>
            <Card.Body>
              {familyMembers && familyMembers.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Дата рождения</th>
                      <th>Отношение</th>
                      <th>Документ</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyMembers.map((member, index) => (
                      <tr key={member.id ?? `temp-key-${index}`}>
                        <td>
                          {member.last_name} {member.first_name} {member.middle_name || ''}
                        </td>
                        <td>{new Date(member.birth_date).toLocaleDateString()}</td>
                        <td>
                          {member.relation_type === 'spouse' ? 'Супруг(а)' : 'Ребенок'}
                        </td>
                        <td>
                          {member.document_type === 'birth_certificate' ? 'Свидетельство о рождении' : 'Паспорт'}
                          {member.document_number ? `: ${member.document_number}` : ''}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-2"
                            onClick={() => openEditFamilyMemberModal(member)}
                          >
                            Редактировать
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteFamilyMember(member.id as number)}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>Нет добавленных членов семьи</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h4>Изменение пароля</h4>
            </Card.Header>
            <Card.Body>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
              
              <Form onSubmit={handleChangePassword}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Текущий пароль</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Новый пароль</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Подтверждение пароля</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button variant="primary" type="submit">
                  Изменить пароль
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно для добавления/редактирования члена семьи */}
      <Modal show={showFamilyMemberModal} onHide={closeFamilyMemberModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingFamilyMember ? 'Редактирование члена семьи' : 'Добавление члена семьи'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(familyError || error) && <Alert variant="danger">{familyError || error}</Alert>}
          {showFamilyMemberModal && (
            <FamilyMemberForm
              initialData={editingFamilyMember || undefined}
              onSubmit={handleSubmitFamilyMember}
              onCancel={closeFamilyMemberModal}
              isSubmitting={false}
              error={familyError || error}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

 
const housingTypeLabels: Record<NonNullable<UserProfile['housing_type']>, string> = {
    own_house: 'Собственный дом',
    own_apartment: 'Собственная квартира',
    rented: 'Аренда',
    social_housing: 'Социальное жилье',
    other: 'Другое'
};

const ownershipStatusLabels: Record<NonNullable<UserProfile['ownership_status']>, string> = {
    sole: 'Единоличная',
    joint: 'Совместная',
    none: 'Отсутствует'
};
 

export default ProfilePage; 