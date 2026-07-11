import api from './axiosConfig';
import { navigate } from '../navigation';
import { storageService } from '../services/storage';
import type { UserDTO } from './types';
import { updateUserProfile } from '.';
import { ownerAPI } from './owner';
import { studentAPI } from './student';

export type UserRole = 'User' | 'Student' | 'Owner' | 'admin';

export interface LoginRequestDTO {
  Email: string;
  Password: string;
  Role: UserRole;
}

export interface UnifiedRegisterDTO {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  Password: string;
  Role: UserRole;
}

export interface UnifiedUpdateDTO {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  Password: string;
  newPassword: string;
}

// دالة توجيه المستخدم حسب الدور
export const redirectBasedOnRole = (role: UserRole | string) => {
  if (!role) return;
  
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
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
      
      let role = response.data.role as UserRole || '';      
      // تحديد الدور
      if (!role) {
        if (response.data.studentId || response.data.studentID) {
          role = 'Student';
        } else if (response.data.ownerId || response.data.ownerID) {
          role = 'Owner';
        } else if (response.data.userId || response.data.userID) {
          role = 'User';
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
      
      return { ...response.data, role};
      
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
  register: async (data: UnifiedRegisterDTO) => {
    try {
      switch (data.Role) {
        case 'Owner':
            {
              // معالجة تسجيل المالك
              const endpoint = '/api/LoginAndSignin/register';
              const roleId = 3;
              
              const registerPayload = {
                FirstName: data.FirstName,
                LastName: data.LastName,
                Phone: data.Phone,
                Email: data.Email,
                Password: data.Password,
                roleId: roleId,
                Role: data.Role,
              };
    
              const response = await api.post(endpoint, registerPayload);
    
              if (!response.data) {
                throw new Error('No response data received from server');
              }
    
              const role = response.data.role || data.Role;
              const userId = response.data.ownerId || response.data.id;
    
              // توجيه المستخدم إلى صفحة تسجيل الدخول
              navigate('/login');
              
              return {
                ...response.data,
                userData: response.data,
                token: response.data.token,
              };
            }

        case 'Student':
        
            {
              // 3. معالجة تسجيل المستخدم والمسؤول
              const endpoint = '/api/LoginAndSignin/register';
              const roleId = 4; // User and Admin share the same roleId
              
              const registerPayload = {
                FirstName: data.FirstName,
                LastName: data.LastName,
                Phone: data.Phone,
                Email: data.Email,
                Password: data.Password,
                roleId: roleId,
                Role: data.Role,
              };
    
              console.log("Sending User/Admin registration payload:", registerPayload);
              const response = await api.post(endpoint, registerPayload);
    
              if (!response.data) {
                throw new Error('No response data received from server');
              }
              console.log("Registration response:", response.data);
    
              const role = response.data.role || data.Role;
              const userId = response.data.studentId || response.data.ownerId || response.data.userId || response.data.id;
    
              // توجيه المستخدم إلى صفحة تسجيل الدخول
              navigate('/login');
              
              return {
                ...response.data,
                userData: response.data,
                token: response.data.token,
              };
            }

        case 'User':
        {
          // 3. معالجة تسجيل المستخدم والمسؤول
          const endpoint = '/api/LoginAndSignin/register';
          const roleId = 2; // User and Admin share the same roleId
          
          const registerPayload = {
            FirstName: data.FirstName,
            LastName: data.LastName,
            Phone: data.Phone,
            Email: data.Email,
            Password: data.Password,
            roleId: roleId,
            Role: data.Role,
          };

          console.log("Sending User/Admin registration payload:", registerPayload);
          const response = await api.post(endpoint, registerPayload);

          if (!response.data) {
            throw new Error('No response data received from server');
          }
          console.log("Registration response:", response.data);

          const role = response.data.role || data.Role;
          const userId = response.data.studentId || response.data.ownerId || response.data.userId || response.data.id;

          // توجيه المستخدم إلى صفحة تسجيل الدخول
          navigate('/login');
          
          return {
            ...response.data,
            userData: response.data,
            token: response.data.token,
          };
        }

        default:
          throw new Error(`Invalid role provided for registration: ${data.Role}`);
      }
    } catch (error) {
      console.error('فشل التسجيل:', error);
      if (error.response?.data) {
        console.error('Server error details:', JSON.stringify(error.response.data, null, 2));
      }
      storageService.clearAuthData();
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
  
  updateUserProfile: async (data: UnifiedUpdateDTO, personID: number) => {
    try {
      const user = storageService.getUser();
      if (!user) {
        throw new Error('No user data found');
      }

      const role = user.role || storageService.getUserRole();

      // تنسيق موحد للبيانات لجميع أنواع المستخدمين
      const updatePayload = {
        FirstName: data.FirstName,
        LastName: data.LastName,
        Phone: data.Phone,
        Email: data.Email,
        Password: data.Password,
        newPassword: data.newPassword || "",
        Role: role
      };

      console.log("Sending update request with payload:", updatePayload);

      // استخدام طريقة PUT بدلاً من POST
      const response = await api.put(`/api/LoginAndSignin/Update/${user.personID}`, updatePayload);

      console.log("Update response:", response.data);

      if (!response.data) {
        throw new Error('No response data received from server');
      }

      // تحديث البيانات المحلية
      const updatedUserData = {
        ...user,
        firstName: data.FirstName,
        lastName: data.LastName,
        email: data.Email,
        phone: data.Phone,
        role: role
      };

      // تحديث التخزين المحلي
      storageService.setAuthData({
        token: response.data.token || storageService.getToken() || '',
        user: updatedUserData,
        role: role,
        id: user.personID
      });

      return {
        userData: updatedUserData,
        token: response.data.token || storageService.getToken()
      };
    } catch (error) {
      console.error('فشل التحديث:', error);
      throw error;
    }
  },
}; 