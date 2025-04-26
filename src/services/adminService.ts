import { api } from './api';  
import { User } from '../types';  

 
interface AllUsersResponse {
  users: User[];  
 
}

 
export const getAllUsers = async (): Promise<AllUsersResponse> => {
  try {
  
    const response = await api.get<AllUsersResponse>('/admin/users'); 
    return response.data;
  } catch (error: any) {
    console.error('Error getting all users:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Ошибка при получении списка пользователей';
  }
};

 