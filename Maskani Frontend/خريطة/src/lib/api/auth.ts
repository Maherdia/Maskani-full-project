import api from './axiosConfig';
import { navigate } from '../navigation';
import { storageService } from '../services/storage';
import type { UserDTO, LoginRequestDTO } from './types';

// دالة توجيه المستخدم حسب الدور
export const redirectBasedOnRole = (role: string) => {
  if (!role) return;
  
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
    case 'admin':
    case 'user':
      navigate('/admin-dashboard');
      break;
    case 'owner':
      navigate('/owner-dashboard');
      break;
    case 'student':
      navigate('/');
      break;
    default:
      navigate('/');
  }
};

// واجهة التعامل مع المصادقة
export const authAPI = {
  // تسجيل الدخول
  login: async (data: LoginRequestDTO) => {
    try {
      console.log("محاولة تسجيل الدخول باستخدام:", data);
      
      const response = await api.post('/api/LoginAndSignin/Login', data);
      console.log("استجابة تسجيل الدخول:", response.data);
      
      let role = response.data.role || '';
      
      // تحديد الدور
      if (!role) {
        if (response.data.studentId || response.data.studentID) {
          role = 'Student';
        } else if (response.data.ownerId || response.data.ownerID) {
          role = 'Owner';
        } else if (response.data.userId || response.data.userID) {
          role = 'Admin';
        }
      }

      if (!role) {
        throw new Error('لم يتم التعرف على نوع المستخدم');
      }

      // حفظ بيانات المصادقة
      storageService.setAuthData({
        token: response.data.token,
        user: response.data,
        role: role,
        id: response.data.studentId || response.data.ownerId || response.data.userId
      });

      // توجيه المستخدم
      redirectBasedOnRole(role);
      
      return { ...response.data, role };
      
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      throw error;
    }
  },

  // تسجيل الخروج
  logout: async () => {
    try {
      // مسح بيانات المصادقة
      storageService.clearAuthData();
      
      // إعادة توجيه المستخدم إلى الصفحة الرئيسية
      navigate('/');
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
      throw error;
    }
  },

  // التحقق من حالة المصادقة
  checkAuth: () => {
    return storageService.hasActiveSession();
  },

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: (): UserDTO | null => {
    return storageService.getUser();
  },

  // الحصول على دور المستخدم الحالي
  getCurrentRole: (): string | null => {
    return storageService.getUserRole();
  },

  // تسجيل مستخدم جديد
  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: 'Owner' | 'Admin' | 'Student';
  }) => {
    try {
      let endpoint = '/api/Students/add';
      
      if (data.role === 'Owner') {
        endpoint = '/api/owners';
      } else if (data.role === 'Admin') {
        endpoint = '/api/users';
      }
      
      const response = await api.post(endpoint, {
        ...data,
        roleId: data.role === 'Owner' ? 1 : data.role === 'Admin' ? 2 : 3,
      });
      
      storageService.setAuthData({
        token: response.data.token,
        user: response.data,
        role: data.role,
        id: response.data.studentId || response.data.ownerId || response.data.userId
      });
      redirectBasedOnRole(data.role);
      
      return {
        ...response.data,
        userData: response.data,
        token: response.data.token
      };
    } catch (error) {
      console.error('فشل التسجيل:', error);
      storageService.clearAuthData();
      throw error;
    }
  },

  // تحديث كلمة المرور
  updatePassword: async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/auth/password', data);
      return response.data;
    } catch (error) {
      console.error('فشل تحديث كلمة المرور:', error);
      throw error;
    }
  },

  // طلب إعادة تعيين كلمة المرور
  requestPasswordReset: async (email: string) => {
    try {
      const response = await api.post('/auth/reset-password-request', { email });
      return response.data;
    } catch (error) {
      console.error('فشل طلب إعادة تعيين كلمة المرور:', error);
      throw error;
    }
  },

  // تأكيد إعادة تعيين كلمة المرور
  confirmPasswordReset: async (data: { token: string; newPassword: string }) => {
    try {
      const response = await api.post('/auth/reset-password-confirm', data);
      return response.data;
    } catch (error) {
      console.error('فشل تأكيد إعادة تعيين كلمة المرور:', error);
      throw error;
    }
  },
}; 