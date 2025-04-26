import axios from 'axios';

 
const API_URL = 'http://localhost:5000/api';
const AUTH_API_URL = 'http://localhost:4000/api/auth';

 
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

 
export const api = axios.create({
  baseURL: API_URL,
});

 
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete authApi.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  }
};

 
export const initializeToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
     
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
     
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 