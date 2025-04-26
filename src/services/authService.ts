import { api, authApi, setAuthToken } from './api';
import { 
  LoginCredentials, 
  RegisterData, 
  User, 
  UserProfile, 
  FamilyMember, 
  Document 
} from '../types';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await authApi.post<AuthResponse>('/login', credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при входе';
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await authApi.post<AuthResponse>('/register', data);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при регистрации';
  }
};

export const verify = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }
    
    const response = await authApi.get<AuthResponse>('/verify');
    return response.data;
  } catch (error: any) {
    console.error('Token verification error:', error.response?.data || error.message);
    logout();
    throw error.response?.data?.message || 'Ошибка проверки токена';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
};

export const changePassword = async (email: string, currentPassword: string, newPassword: string) => {
  try {
    const response = await authApi.post('/change-password', { 
      email, 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при смене пароля';
  }
};

 
export const getUserProfile = async () => {
  try {
    const response = await authApi.get('/profile');
    
 
    if (!response.data || !response.data.profile) {
      console.error('Профиль не найден в ответе API');
      throw new Error('Профиль пользователя не найден');
    }
    
    return {
      profile: response.data.profile,
      familyMembers: response.data.familyMembers || [],
      documents: response.data.documents || []
    };
  } catch (error: any) {
 
    console.error('Get profile error:', error);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);
    
    
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Необходима авторизация для получения данных профиля');
      } else if (error.response.status === 404) {
        throw new Error('Профиль не найден. Заполните данные профиля.');
      } else {
        throw error.response.data?.message || `Ошибка сервера (${error.response.status})`;
      }
    }
    
    throw error.message || 'Ошибка при получении данных профиля';
  }
};

 
export const addFamilyMember = async (familyMember: FamilyMember) => {
  try {
    const response = await authApi.post('/family-members', familyMember);
    return response.data;
  } catch (error: any) {
    console.error('Add family member error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при добавлении члена семьи';
  }
};

 
export const updateFamilyMember = async (id: number, familyMember: FamilyMember) => {
  try {
    const response = await authApi.put(`/family-members/${id}`, familyMember);
    return response.data;
  } catch (error: any) {
    console.error('Update family member error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при обновлении данных члена семьи';
  }
};

 
export const deleteFamilyMember = async (id: number) => {
  try {
    const response = await authApi.delete(`/family-members/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete family member error:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при удалении члена семьи';
  }
};

 
export const createUserProfile = async (profileData: Omit<UserProfile, 'user_id'>) => {
  try {
    console.log('Отправка данных для создания профиля:', profileData);
    const response = await authApi.post('/profile', profileData);
    console.log('Ответ сервера при создании профиля:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Ошибка при создании профиля:', error);
    if (error.response) {
      console.error('Статус ответа:', error.response.status);
      console.error('Данные ответа:', error.response.data);
      throw error.response.data?.message || `Ошибка сервера (${error.response.status})`;
    }
    throw error.message || 'Ошибка при создании профиля пользователя';
  }
};

 
export const updateUserProfile = async (profileData: Partial<Omit<UserProfile, 'user_id'>>) => {
  try {
    console.log('Отправка запроса на обновление профиля:', profileData);
    
    const response = await authApi.put('/profile', profileData); 
    
    console.log('Ответ при обновлении профиля:', response.data);
    
    if (response.status === 200 || response.status === 201) {
      return response.data.profile;
    } else {
      throw new Error(`Ошибка при обновлении профиля: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Ошибка при обновлении профиля:', error);
    if (error.response) {
      throw new Error(`Ошибка сервера: ${error.response.status} ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(error.message || 'Неизвестная ошибка при обновлении профиля');
  }
}; 