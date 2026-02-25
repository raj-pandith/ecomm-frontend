// src/utils/axiosInstance.js (create if not exists)
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ecomm-backend-production-4a0f.up.railway.app/',
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;