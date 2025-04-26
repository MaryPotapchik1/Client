import { InfoMaterial, FAQ, Application } from '../types';
import { ApplicationStatus, ApplicationType } from '../utils/typeUtils';

 
export const mockInfoMaterials: InfoMaterial[] = [
  {
    id: 1,
    title: 'Как получить семейный капитал в Беларуси',
    content: 'Семейный капитал в Беларуси - это единовременная государственная поддержка семей, в которых родился или был усыновлен третий или последующий ребенок. Для получения семейного капитала необходимо подать заявление в исполнительный комитет по месту жительства.',
    category: 'Семейный капитал',
    created_at: '2023-09-01T00:00:00.000Z',
    updated_at: '2023-09-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Документы для оформления семейного капитала',
    content: 'Для оформления семейного капитала необходимы следующие документы: паспорта родителей, свидетельства о рождении всех детей, свидетельство о браке, справка о составе семьи. Заявление рассматривается в течение 1 месяца.',
    category: 'Семейный капитал',
    created_at: '2023-09-02T00:00:00.000Z',
    updated_at: '2023-09-02T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Размер семейного капитала в Беларуси',
    content: 'Семейный капитал в Беларуси составляет 23 000 белорусских рублей. Средства индексируются ежегодно с учетом роста потребительских цен.',
    category: 'Семейный капитал',
    created_at: '2023-09-03T00:00:00.000Z',
    updated_at: '2023-09-03T00:00:00.000Z',
  },
  {
    id: 4,
    title: 'Основные направления использования семейного капитала',
    content: 'Семейный капитал можно использовать на улучшение жилищных условий, получение образования, медицинское обслуживание, формирование накопительной пенсии матери, а также на приобретение товаров для социальной адаптации детей-инвалидов.',
    category: 'Использование капитала',
    created_at: '2023-09-04T00:00:00.000Z',
    updated_at: '2023-09-04T00:00:00.000Z',
  },
  {
    id: 5,
    title: 'Сроки распоряжения семейным капиталом',
    content: 'Распорядиться средствами семейного капитала можно после истечения 18 лет с даты рождения ребенка, в связи с рождением которого семья приобрела право на капитал. В отдельных случаях возможно досрочное использование.',
    category: 'Использование капитала',
    created_at: '2023-09-05T00:00:00.000Z',
    updated_at: '2023-09-05T00:00:00.000Z',
  },
];

 
export const mockFAQs: FAQ[] = [
  {
    id: 1,
    question: 'Кто имеет право на семейный капитал в Беларуси?',
    answer: 'Право на семейный капитал имеют граждане Беларуси, постоянно проживающие в Республике Беларусь, при рождении или усыновлении третьего или последующих детей в период с 1 января 2015 года по 31 декабря 2024 года.',
    category: 'general',
    is_published: true,
    created_at: '2023-09-01T00:00:00.000Z',
  },
  {
    id: 2,
    question: 'Могу ли я использовать семейный капитал для лечения ребенка?',
    answer: 'Да, семейный капитал можно использовать досрочно для получения платных медицинских услуг, оказываемых организациями здравоохранения, в том числе для лечения ребенка.',
    category: 'healthcare',
    is_published: true,
    created_at: '2023-09-02T00:00:00.000Z',
  },
  {
    id: 3,
    question: 'Как долго рассматривается заявление на получение семейного капитала?',
    answer: 'Решение о назначении семейного капитала принимается в течение 1 месяца со дня подачи заявления.',
    category: 'application',
    is_published: true,
    created_at: '2023-09-03T00:00:00.000Z',
  },
  {
    id: 4,
    question: 'Можно ли использовать семейный капитал для погашения кредита на жилье?',
    answer: 'Да, семейный капитал можно использовать для погашения задолженности по кредиту, взятому на строительство или приобретение жилья, а также для погашения задолженности по займу организации на указанные цели.',
    category: 'housing',
    is_published: true,
    created_at: '2023-09-04T00:00:00.000Z',
  },
  {
    id: 5,
    question: 'Можно ли получить семейный капитал наличными?',
    answer: 'Нет, семейный капитал зачисляется на депозитный счет, открытый в ОАО "АСБ Беларусбанк", и может быть использован только на определенные цели, установленные законодательством.',
    category: 'general',
    is_published: true,
    created_at: '2023-09-05T00:00:00.000Z',
  },
  {
    id: 6,
    question: 'Какие документы необходимы для использования семейного капитала на образование?',
    answer: 'Для использования семейного капитала на образование необходимо предоставить: заявление, паспорт, свидетельства о рождении всех детей, договор с образовательным учреждением и справку из образовательного учреждения о стоимости обучения.',
    category: 'education',
    is_published: true,
    created_at: '2023-09-06T00:00:00.000Z',
  },
  {
    id: 7,
    question: 'Какие существуют законодательные акты, регулирующие семейный капитал?',
    answer: 'Основным законодательным актом, регулирующим семейный капитал, является Указ Президента Республики Беларусь от 18 сентября 2019 г. № 345 "О семейном капитале".',
    category: 'legislation',
    is_published: true,
    created_at: '2023-09-07T00:00:00.000Z',
  },
  {
    id: 8,
    question: 'Какие документы нужны для оформления семейного капитала?',
    answer: 'Для оформления семейного капитала требуются: заявление, паспорта родителей, свидетельства о рождении всех детей, справка о составе семьи.',
    category: 'documents',
    is_published: true,
    created_at: '2023-09-08T00:00:00.000Z',
  },
  {
    id: 9,
    question: 'Этот вопрос не должен отображаться на публичной странице',
    answer: 'Тестовый ответ для проверки фильтрации неопубликованных FAQ',
    category: 'general',
    is_published: false,
    created_at: '2023-09-09T00:00:00.000Z',
  },
];

 
export const mockApplications: Application[] = [
  {
    id: 1,
    user_id: 1,
    application_type: 'housing',
    status: 'pending',
    requested_amount: 10000,
    purpose: 'Улучшение жилищных условий',
    description: 'Заявление на использование средств семейного капитала для улучшения жилищных условий',
    created_at: '2023-10-01T00:00:00.000Z',
    updated_at: '2023-10-01T00:00:00.000Z',
  },
  {
    id: 2,
    user_id: 1,
    application_type: 'education',
    status: 'approved',
    requested_amount: 5000,
    approved_amount: 5000,
    purpose: 'Оплата образования ребенка',
    description: 'Заявление на использование средств семейного капитала для оплаты образования ребенка',
    created_at: '2023-09-15T00:00:00.000Z',
    updated_at: '2023-09-20T00:00:00.000Z',
  },
  {
    id: 3,
    user_id: 1,
    application_type: 'healthcare',
    status: 'rejected',
    requested_amount: 3000,
    purpose: 'Оплата медицинских услуг',
    description: 'Заявление на использование средств семейного капитала для оплаты медицинских услуг',
    created_at: '2023-12-05T00:00:00.000Z',
    updated_at: '2023-12-10T00:00:00.000Z',
  },
];

 
export function filterMockDataByCategory<T extends {category: string}>(data: T[], category: string): T[] {
  return data.filter(item => item.category === category);
}

 
export function getMockData<T extends {id: number}>(data: T[], id: number): T | undefined {
  return data.find(item => item.id === id);
}

 
export function createMockApplication(applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status'>): Application {
  const newApplication: Application = {
    ...applicationData,
    id: mockApplications.length + 1,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockApplications.push(newApplication);
  return newApplication;
}

 
export function getMockUserApplications(userId: number): Application[] {
  return mockApplications.filter(app => app.user_id === userId);
}

 
export function getMockApplicationById(id: number): Application | undefined {
  return mockApplications.find(app => app.id === id);
}

 
export function createMockFAQ(faqData: Omit<FAQ, 'id' | 'created_at'>): FAQ {
  const newFAQ: FAQ = {
    ...faqData,
    id: mockFAQs.length + 1,
    created_at: new Date().toISOString()
  };
  
  mockFAQs.push(newFAQ);
  return newFAQ;
}

 
export function updateMockFAQ(id: number, faqData: Partial<FAQ>): FAQ | undefined {
  const index = mockFAQs.findIndex(faq => faq.id === id);
  if (index !== -1) {
    mockFAQs[index] = {
      ...mockFAQs[index],
      ...faqData
    };
    return mockFAQs[index];
  }
  return undefined;
}

 
export function deleteMockFAQ(id: number): boolean {
  const index = mockFAQs.findIndex(faq => faq.id === id);
  if (index !== -1) {
    mockFAQs.splice(index, 1);
    return true;
  }
  return false;
} 