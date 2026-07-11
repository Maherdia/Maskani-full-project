import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5236',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اعتراض الطلبات لإضافة رمز المصادقة
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// اعتراض الاستجابات للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // حذف بيانات المصادقة عند انتهاء صلاحية الجلسة
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('studentId');
      localStorage.removeItem('ownerId');
      localStorage.removeItem('userId');
      
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 