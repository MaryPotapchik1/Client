import {  ApplicationComment } from '../types';

 
export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed';
export type ApplicationType = 'housing' | 'education' | 'healthcare' | 'other';

 
export const getStatusText = (status: ApplicationStatus | string): string => {
  switch (status) {
    case 'pending': return 'Ожидает рассмотрения';
    case 'reviewing': return 'На рассмотрении';
    case 'approved': return 'Одобрена';
    case 'rejected': return 'Отклонена';
    case 'completed': return 'Завершена';
    default: return status;
  }
};

 
export const getStatusVariant = (status: ApplicationStatus | string): string => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'reviewing': return 'info';
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    case 'completed': return 'primary';
    default: return 'secondary';
  }
};

 
export const getApplicationTypeText = (type: ApplicationType | string): string => {
  switch (type) {
    case 'housing': return 'Жилье';
    case 'education': return 'Образование';
    case 'healthcare': return 'Здравоохранение';
    case 'other': return 'Другое';
    default: return type;
  }
};

 
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 