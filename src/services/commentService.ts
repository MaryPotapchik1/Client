import { api } from './api';
import { Comment } from '../store/slices/commentSlice';
import { mockApplications } from './mockData';

 
const USE_MOCK_DATA = true;

 
const mockComments: Comment[] = [
  {
    id: 1,
    applicationId: 1,
    text: 'Заявление получено, рассматривается',
    userId: 2,
    createdAt: '2023-10-05T10:00:00.000Z',
    user: {
      username: 'admin',
      role: 'admin'
    }
  },
  {
    id: 2,
    applicationId: 1,
    text: 'Когда ожидать ответа?',
    userId: 1,
    createdAt: '2023-10-07T14:30:00.000Z',
    user: {
      username: 'user',
      role: 'user'
    }
  },
  {
    id: 3,
    applicationId: 1,
    text: 'Обработка займет приблизительно 5-7 рабочих дней',
    userId: 2,
    createdAt: '2023-10-07T16:45:00.000Z',
    user: {
      username: 'admin',
      role: 'admin'
    }
  },
  {
    id: 4,
    applicationId: 2,
    text: 'Заявление одобрено. Средства будут перечислены в течение 3 рабочих дней.',
    userId: 2,
    createdAt: '2023-09-18T12:00:00.000Z',
    user: {
      username: 'admin',
      role: 'admin'
    }
  },
  {
    id: 5,
    applicationId: 2,
    text: 'Спасибо за оперативное рассмотрение!',
    userId: 1,
    createdAt: '2023-09-18T14:20:00.000Z',
    user: {
      username: 'user',
      role: 'user'
    }
  },
  {
    id: 6,
    applicationId: 3,
    text: 'Заявление отклонено. Недостаточно представленных документов.',
    userId: 2,
    createdAt: '2023-12-08T11:30:00.000Z',
    user: {
      username: 'admin',
      role: 'admin'
    }
  },
  {
    id: 7,
    applicationId: 3,
    text: 'Какие именно документы требуется добавить?',
    userId: 1,
    createdAt: '2023-12-09T09:45:00.000Z',
    user: {
      username: 'user',
      role: 'user'
    }
  },
  {
    id: 8,
    applicationId: 3,
    text: 'Необходимо предоставить справку о составе семьи и актуальное свидетельство о рождении ребенка.',
    userId: 2,
    createdAt: '2023-12-09T13:15:00.000Z',
    user: {
      username: 'admin',
      role: 'admin'
    }
  }
];

 
export const getComments = async (applicationId: number): Promise<Comment[]> => {
  try {
    if (USE_MOCK_DATA) {
     
      return mockComments.filter(comment => comment.applicationId === applicationId);
    }

    const response = await api.get(`/comments/${applicationId}`);
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA) {
      
      return [];
    }
    throw error.response?.data?.message || 'Ошибка при получении комментариев';
  }
};

export const addComment = async (applicationId: number, text: string): Promise<Comment> => {
  try {
    if (USE_MOCK_DATA) {
     
      const newComment: Comment = {
        id: mockComments.length + 1,
        applicationId,
        text,
        userId: 1, 
        createdAt: new Date().toISOString(),
        user: {
          username: 'user',
          role: 'user'
        }
      };
      mockComments.push(newComment);
      return newComment;
    }

    const response = await api.post('/comments', { applicationId, text });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при добавлении комментария';
  }
}; 