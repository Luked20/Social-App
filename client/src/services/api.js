import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor para logar requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CloneSocial:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('📤 Requisição:', {
    url: config.url,
    method: config.method,
    data: config.data,
    headers: config.headers,
    token: token
  });
  
  return config;
}, (error) => {
  console.error('❌ Erro na requisição:', error);
  return Promise.reject(error);
});

// Interceptor para logar respostas
api.interceptors.response.use((response) => {
  console.log('📥 Resposta:', {
    status: response.status,
    data: response.data,
    headers: response.headers
  });
  return response;
}, (error) => {
  console.error('❌ Erro na resposta:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
    headers: error.response?.headers
  });

  if (error.response?.status === 401) {
    localStorage.removeItem('@CloneSocial:token');
    localStorage.removeItem('@CloneSocial:user');
    window.location.href = '/login';
  }

  return Promise.reject(error);
});

export default api; 