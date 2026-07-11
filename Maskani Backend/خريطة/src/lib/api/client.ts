import axios from 'axios';
import { API_URL } from '../config';
import { logger } from './helpers';
import { navigate } from '../navigation';

/**
 * إعداد axios مع الإعدادات الأساسية
 * - baseURL: عنوان الخادم الأساسي
 * - headers: نوع المحتوى JSON
 * - withCredentials: دعم الكوكيز والجلسات
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const checkConnection = async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  };
  
const refreshToken = async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');
      
      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token, newRefreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return token;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/login');
      throw error;
    }
};

/**
 * اعتراض الطلبات
 * - إضافة التوكن تلقائياً
 * - التحقق من الاتصال
 * - تسجيل الطلبات
 */
api.interceptors.request.use(async config => {
  logger.info(`Making ${config.method?.toUpperCase()} request to ${config.url}`, config.data);
  
  const isConnected = await checkConnection();
  if (!isConnected) {
    logger.warn('No internet connection, request will likely fail.');
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * اعتراض الاستجابات
 * - معالجة أخطاء المصادقة
 * - تحديث التوكن تلقائياً
 * - تسجيل الأخطاء
 */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        logger.info('Token expired, attempting to refresh...');
        const newToken = await refreshToken();
        logger.info('Token refreshed successfully.');
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logger.error('Failed to refresh token.', refreshError);
        return Promise.reject(refreshError);
      }
    }
    
    logger.error('API Error', error);
    return Promise.reject(error);
  }
);

export { api }; 