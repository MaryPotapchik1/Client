import { api } from './api';
import { 
  InfoMaterial, 
  FAQ, 
  ConsultationRequest, 
  CreateInfoMaterialData, 
  CreateFAQData 
} from '../types';
import { 
  mockInfoMaterials, 
  mockFAQs, 
  filterMockDataByCategory, 
  getMockData, 
  createMockFAQ, 
  updateMockFAQ, 
  deleteMockFAQ 
} from './mockData';

 
const USE_MOCK_DATA = false;

interface InfoMaterialsResponse {
  materials: InfoMaterial[];
}

interface InfoMaterialResponse {
  material: InfoMaterial;
}

interface FAQsResponse {
  faqs: FAQ[];
}

interface FAQResponse {
  faq: FAQ;
}

interface ConsultationRequestsResponse {
  consultationRequests: ConsultationRequest[];
}

interface ConsultationRequestResponse {
  consultationRequest: ConsultationRequest;
}

 
interface AllConsultationsResponse {
  consultationRequests: ConsultationRequest[];
}

 
interface ConsultationResponse {
  consultationRequest: ConsultationRequest;
}

 
export const getInfoMaterials = async (page: number = 1, limit: number = 10): Promise<{ materials: InfoMaterial[], total: number }> => {
  const response = await api.get('/info/materials', { params: { page, limit } });
  return response.data;
};

export const getInfoMaterialById = async (id: string): Promise<InfoMaterial> => {
  const response = await api.get<InfoMaterialResponse>(`/info/materials/${id}`);
  return response.data.material;
};

export const createInfoMaterial = async (materialData: CreateInfoMaterialData): Promise<InfoMaterial> => {
  const response = await api.post<InfoMaterialResponse>('/info/materials', materialData);
  return response.data.material;
};

export const updateInfoMaterial = async (id: string, materialData: Partial<Omit<InfoMaterial, 'id' | 'createdAt' | 'updatedAt'>>): Promise<InfoMaterial> => {
  const response = await api.put<InfoMaterialResponse>(`/info/materials/${id}`, materialData);
  return response.data.material;
};

export const deleteInfoMaterial = async (id: string): Promise<void> => {
  await api.delete(`/info/materials/${id}`);
};

 
export const getFAQs = async (category?: string) => {
  try {
    if (USE_MOCK_DATA) {
      
      const faqs = category 
        ? mockFAQs.filter(faq => faq.category === category)
        : mockFAQs;
      console.log('Возвращаемые FAQ из сервиса:', faqs);
      return { faqs } as FAQsResponse;
    }

    let url = '/info/faq';
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await api.get<FAQsResponse>(url);
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA) {
      
      return { faqs: [] } as FAQsResponse;
    }
    throw error.response?.data?.message || 'Ошибка при получении FAQ';
  }
};

export const getAllFAQs = async (category?: string) => {
  try {
    if (USE_MOCK_DATA) {
     
      let faqs = mockFAQs;
      
      
      if (category) {
        faqs = faqs.filter(faq => faq.category === category);
      }
      
      console.log('getAllFAQs возвращает ВСЕ FAQ:', faqs);
      return { faqs } as FAQsResponse;
    }
    
    let url = '/info/faq/all';
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await api.get<FAQsResponse>(url);
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA) {
      return { faqs: [] } as FAQsResponse;
    }
    throw error.response?.data?.message || 'Ошибка при получении всех FAQ';
  }
};

export const getAllFaqAdmin = async (): Promise<FAQ[]> => {
   
  const response = await api.get('/info/faq/all'); 
  return response.data.faq; 
};

export const createFaq = async (faqData: CreateFAQData): Promise<FAQ> => {
  try {
    if (USE_MOCK_DATA) {
     
      const dataToCreate: Omit<FAQ, 'id' | 'created_at'> = {
        ...faqData,
        is_published: faqData.is_published !== undefined ? faqData.is_published : true
      };
      
      const newFaq = createMockFAQ(dataToCreate);
      return newFaq;
    }
    
    const response = await api.post('/info/faq', faqData);
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA && typeof error === 'string') {
      throw error;
    }
    throw error.response?.data?.message || 'Ошибка при создании FAQ';
  }
};

export const updateFaq = async (id: string, faqData: Partial<Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'> & { is_published?: boolean }>): Promise<FAQ> => {
  try {
    if (USE_MOCK_DATA) {
 
      const updatedFaq = updateMockFAQ(parseInt(id), faqData);
      if (!updatedFaq) {
        throw 'FAQ не найден';
      }
      return updatedFaq;
    }
    
    const response = await api.put(`/info/faq/${id}`, faqData);
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA && typeof error === 'string') {
      throw error;
    }
    throw error.response?.data?.message || 'Ошибка при обновлении FAQ';
  }
};

export const deleteFaq = async (id: string): Promise<void> => {
  try {
    if (USE_MOCK_DATA) {
     
      const success = deleteMockFAQ(parseInt(id));
      if (!success) {
        throw 'FAQ не найден';
      }
      return;
    }
    
    await api.delete(`/info/faq/${id}`);
  } catch (error: any) {
    if (USE_MOCK_DATA && typeof error === 'string') {
      throw error;
    }
    throw error.response?.data?.message || 'Ошибка при удалении FAQ';
  }
};

 
export const createConsultationRequest = async (data: Omit<ConsultationRequest, 'id' | 'user_id' | 'status' | 'created_at'>) => {
  try {
    const response = await api.post<ConsultationRequestResponse>('/info/consultation-requests', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при создании запроса на консультацию';
  }
};

export const getUserConsultationRequests = async () => {
  try {
    const response = await api.get<ConsultationRequestsResponse>('/info/consultation-requests/my');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении запросов на консультацию';
  }
};

 
export const getAllConsultationRequests = async (status?: 'pending' | 'in_progress' | 'completed') => {
  try {
    let url = '/info/consultation-requests';
    if (status) {
      url += `?status=${status}`;
    }
    const response = await api.get<AllConsultationsResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении всех запросов на консультацию';
  }
};

 
export const updateConsultationRequestStatus = async (id: number, status: 'pending' | 'in_progress' | 'completed') => {
  try {
    const response = await api.put<ConsultationResponse>(
      `/info/consultation-requests/${id}/status`,
      { status }  
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при обновлении статуса запроса на консультацию';
  }
};

export const getAdminFAQs = async () => {
  try {
    if (USE_MOCK_DATA) {
      
      console.log('getAdminFAQs возвращает все FAQ для админа:', mockFAQs);
      return { faqs: mockFAQs } as FAQsResponse;
    }
    
    const response = await api.get<FAQsResponse>('/info/faq/all');
    return response.data;
  } catch (error: any) {
    if (USE_MOCK_DATA) {
      return { faqs: [] } as FAQsResponse;
    }
    throw error.response?.data?.message || 'Ошибка при получении всех FAQ для админа';
  }
};

export const getAllPublicFAQs = async (category?: string) => {
  try {
    let url = '/info/faq/all/public';
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await api.get<FAQsResponse>(url);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Ошибка при получении всех публичных FAQ';
  }
}; 