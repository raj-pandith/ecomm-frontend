// src/utils/axiosInstance.js (create if not exists)
import axios from 'axios';
import { JAVA_BASE_URL } from '../API_GATEWAY/Apis';

const axiosInstance = axios.create({
  baseURL: JAVA_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;