import api from './axiosConfig';
import { redirectBasedOnRole } from './auth';
import { AddOwnerDTO, LoginRequestDTO, UpdateOwnerDTO } from './types';

export const ownerAPI = {
  // الحصول على قائمة كل المالكين
  getAllOwners: async () => {
    try {
      console.log("طلب جلب جميع المالكين");
      const response = await api.get('/api/owners');
      return response.data;
    } catch (error) {
      console.error('Error fetching all owners:', error);
      throw error;
    }
  },

  // الحصول على مالك محدد باستخدام المعرف
  getOwnerById: async (ownerId: string | number) => {
    try {
      console.log(`طلب جلب المالك بالمعرف: ${ownerId}`);
      const response = await api.get(`/api/owners/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching owner with ID ${ownerId}:`, error);
      throw error;
    }
  },

  // تسجيل مالك جديد
  register: async (data: AddOwnerDTO) => {
    try {
      console.log("طلب تسجيل مالك جديد:", data);
      
      const response = await api.post('/api/owners', data);
      console.log("استجابة تسجيل المالك:", response.data);
      
      // تخزين التوكن وبيانات المستخدم
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // حفظ دور المستخدم
      localStorage.setItem('userRole', 'Owner');
      
      // إنشاء كائن المستخدم الكامل من البيانات المرسلة والاستجابة
      const userData = {
        id: response.data.id || response.data.ownerID || response.data.ownerId,
        firstName: response.data.firstName || data.firstName,
        lastName: response.data.lastName || data.lastName,
        email: response.data.email || data.email,
        phone: response.data.phone || data.phone,
        role: 'Owner',
        ...response.data
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // حفظ معرف المالك
      const ownerId = response.data.id || response.data.ownerID || response.data.ownerId;
      if (ownerId) {
        localStorage.setItem('ownerId', String(ownerId));
      }
      
      // توجيه المستخدم إلى لوحة تحكم المالك
      redirectBasedOnRole('Owner');
      
      return response.data;
    } catch (error) {
      console.error('Error registering owner:', error);
      throw error;
    }
  },

  // تسجيل دخول مالك
  login: async (data: LoginRequestDTO) => {
    try {
      console.log("طلب تسجيل دخول مالك:", data);
      const response = await api.post('/api/owners/login', data);
      console.log("استجابة تسجيل دخول المالك:", response.data);
      
      // تخزين التوكن وبيانات المستخدم
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // حفظ بيانات المستخدم
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ role: 'Owner' }));
      }
      
      // حفظ معرف المالك
      if (response.data.ownerId) {
        localStorage.setItem('ownerId', response.data.ownerId);
      } else if (response.data.id) {
        localStorage.setItem('ownerId', response.data.id);
      }
      
      // توجيه المستخدم إلى لوحة تحكم المالك
      redirectBasedOnRole('Owner');
      
      return response.data;
    } catch (error) {
      console.error('Error logging in owner:', error);
      throw error;
    }
  },

  // تحديث بيانات مالك
  updateOwner: async (ownerId: string | number, data: Partial<UpdateOwnerDTO>) => {
    try {
      console.log(`طلب تحديث المالك بالمعرف ${ownerId}:`, data);
      
      // Get current owner data first to ensure we have all required fields
      let currentData;
      try {
        const currentOwner = await api.get(`/api/owners/${ownerId}`);
        currentData = currentOwner.data;
        console.log("البيانات الحالية للمالك:", currentData);
      } catch (error) {
        console.error("فشل في جلب البيانات الحالية:", error);
        throw new Error("Unable to fetch current owner data");
      }
      
      // Prepare the update data
      const updateData: UpdateOwnerDTO = {
        ownerID: parseInt(String(ownerId)),
        firstName: data.firstName !== undefined ? data.firstName : currentData.firstName,
        lastName: data.lastName !== undefined ? data.lastName : currentData.lastName,
        email: data.email !== undefined ? data.email : currentData.email,
        phone: data.phone !== undefined ? data.phone : currentData.phone,
      };

      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }
      
      console.log("بيانات التحديث النهائية:", updateData);
      
      const response = await api.put(`/DormsOwners/${ownerId}`, updateData);
      console.log("نجح تحديث المالك:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating owner with ID ${ownerId}:`, error);
      throw error;
    }
  },

  // حذف حساب مالك
  deleteOwner: async (ownerId: string | number) => {
    try {
      console.log(`طلب حذف المالك بالمعرف: ${ownerId}`);
      const response = await api.delete(`/api/owners/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting owner with ID ${ownerId}:`, error);
      throw error;
    }
  },
  
  // الحصول على الملف الشخصي للمالك الحالي
  getProfile: async () => {
    // الحصول على معرف المالك من localStorage
    const ownerId = localStorage.getItem('ownerId');
    
    if (!ownerId) {
      throw new Error('معرف المالك غير متوفر، يرجى تسجيل الدخول أولاً');
    }
    
    try {
      const response = await api.get(`/api/owners/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner profile:', error);
      throw error;
    }
  },

  getOwnerByEmail: async (email: string) => {
    try {
      const response = await api.get(`/api/owners/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching owner by email: ${email}`, error);
      throw error;
    }
  },
}; 