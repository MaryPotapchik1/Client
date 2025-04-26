import { api } from './api';
import { 
  Application, 
  ApplicationComment, 
  CreateApplicationData, 
  UpdateApplicationStatusData, 
  ApplicationDetailsResponse
} from '../types';

interface ApplicationsResponse {
  applications: Application[];
}

export const createApplication = async (data: CreateApplicationData) => {
  try {
    const response = await api.post<ApplicationDetailsResponse>('/applications', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при создании заявки';
  }
};

export const getUserApplications = async () => {
  try {
    const response = await api.get<ApplicationsResponse>('/applications/my');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении заявок';
  }
};

export const getApplicationById = async (id: number) => {
  try {
    const response = await api.get<ApplicationDetailsResponse>(`/applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении заявки';
  }
};

export const updateApplicationStatus = async (id: number, data: UpdateApplicationStatusData) => {
  try {
    const response = await api.put<ApplicationDetailsResponse>(`/applications/${id}/status`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при обновлении статуса заявки';
  }
};

export const getAllApplications = async (
  status?: Application['status'],
  limit?: number,
  offset?: number
) => {
  try {
    let url = '/applications';
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    const response = await api.get<ApplicationsResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении заявок';
  }
};

export const addApplicationComment = async (applicationId: number, comment: string) => {
  try {
    const response = await api.post<{ comment: ApplicationComment }>(
      `/applications/${applicationId}/comments`,
      { comment }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при добавлении комментария';
  }
}; 