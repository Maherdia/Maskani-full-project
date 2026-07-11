import api from './axiosConfig';
import { PropertyData } from './types';

// واجهة التعامل مع العقارات
export const propertyAPI = {
  // جلب قائمة العقارات
  getProperties: async (params?: {
    page?: number;
    limit?: number;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    bedrooms?: number;
    propertyType?: string;
  }) => {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  // جلب تفاصيل عقار معين
  getPropertyById: async (id: string) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // إضافة عقار جديد (للمالك)
  addProperty: async (data: PropertyData) => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  // تحديث بيانات عقار (للمالك)
  updateProperty: async (id: string, data: Partial<PropertyData>) => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  // حذف عقار (للمالك)
  deleteProperty: async (id: string) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  }
}; 