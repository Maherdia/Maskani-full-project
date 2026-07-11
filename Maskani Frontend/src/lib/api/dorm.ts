import api from './axiosConfig';
import { DormData, AddDormDTO, UpdateDormDTO, SearchDormParams, PagedResult } from './types';
import { AxiosError } from 'axios';

// واجهة التعامل مع السكنات (Dorms)
export const dormAPI = {
  // Get all dorms
  getAllDorms: async () => {
    const response = await api.get('/api/Dorms/all');
    return response.data;
  },

  // Get dorm by ID
  getDormById: async (dormId: string) => {
    const response = await api.get(`/api/Dorms/${dormId}`, {
      params: {
        includeOwnerEmail: true
      }
    });
    return response.data;
  },

  // Add new dorm
  addDorm: async (data: AddDormDTO) => {
    const response = await api.post('/api/Dorms/add', data);
    return response.data;
  },

  // Update dorm
  updateDorm: async (data: UpdateDormDTO) => {
    const response = await api.put('/api/Dorms/update', data);
    return response.data;
  },

  // Delete dorm
  deleteDorm: async (dormId: string) => {
    const response = await api.delete(`/api/Dorms/${dormId}`);
    return response.data;
  },

  // Search dorms - محسن للبحث بـ اسم السكن
  searchDorms: async (params: SearchDormParams) => {
    try {
      console.log('البحث في السكنات مع المعاملات:', params);
      const queryParams = new URLSearchParams();
      
      // إضافة المعاملات فقط إذا كانت موجودة وصحيحة
      if (params.university?.trim()) {
        queryParams.append('university', params.university.trim());
      }
      
      if (typeof params.maxDistance === 'number' && !isNaN(params.maxDistance) && params.maxDistance > 0) {
        queryParams.append('maxDistance', Math.max(0, params.maxDistance).toString());
      }
      
      if (typeof params.furnished === 'boolean') {
        queryParams.append('furnished', params.furnished.toString());
      }
      
      if (params.address?.trim()) {
        queryParams.append('address', params.address.trim());
      }
      
      if (params.dormName?.trim()) {
        queryParams.append('dormName', params.dormName.trim());
      }

      const url = `/api/Dorms/search?${queryParams.toString()}`;
      console.log('رابط البحث المنشأ:', url);
      
      const response = await api.get(url);
      const results = response.data || [];
      
      console.log(`تم العثور على ${results.length} سكن من الخادم`);
      
      // تطبيق فلترة إضافية على اسم السكن إذا لزم الأمر
      if (params.dormName?.trim()) {
        const filteredResults = results.filter((dorm: DormData) => 
          (dorm?.dormName ?? "").toLowerCase().includes(params.dormName!.toLowerCase())
        );
        console.log(`بعد الفلترة المحلية: ${filteredResults.length} سكن`);
        return filteredResults;
      }
      
      return results;
    } catch (error: unknown) {
      console.error('خطأ في البحث عن السكنات:', error);
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          console.error('تفاصيل خطأ الخادم:', error.response.data);
          throw new Error('خطأ في الخادم. يرجى المحاولة لاحقاً.');
        } else if (error.response?.status === 404) {
          console.log('لم يتم العثور على سكنات مطابقة');
          return [];
        } else if (error.response?.status === 400) {
          console.error('معاملات البحث غير صحيحة:', error.response.data);
          throw new Error('معاملات البحث غير صحيحة');
        }
        
        if (!error.response) {
          throw new Error('فشل في الاتصال بالخادم');
        }
      }
      
      return []; // إرجاع مصفوفة فارغة في حالة الأخطاء الأخرى
    }
  },

  // البحث السريع بـ اسم السكن فقط
  searchDormsByName: async (dormName: string) => {
    if (!dormName.trim()) {
      return [];
    }
    
    return await dormAPI.searchDorms({ dormName: dormName.trim() });
  },

  // Get paged dorms
  getDormsPaged: async (pageIndex: number, pageSize: number): Promise<PagedResult<DormData>> => {
    const response = await api.get('/api/Dorms/paged', {
      params: { pageIndex, pageSize }
    });
    return response.data;
  },

  // Get dorms by university
  getDormsByUniversity: async (name: string) => {
    const response = await api.get(`/api/Dorms/by-university/${encodeURIComponent(name)}`);
    return response.data;
  },

  // Get dorms by owner
  getDormsByOwner: async (name: string) => {
    const response = await api.get(`/api/Dorms/by-owner/${encodeURIComponent(name)}`);
    return response.data;
  },

  // Get dorms by owner ID
  getDormsByOwnerId: async (id: number) => {
    const response = await api.get(`/api/Dorms/by-owner-id/${id}`);
    return response.data;
  },

  // Get dorms by address
  getDormsByAddress: async (address: string) => {
    const response = await api.get('/api/Dorms/by-address', {
      params: { address }
    });
    return response.data;
  },

  // Get dorms by furnishing status
  getDormsByFurnishing: async (furnished: boolean) => {
    const response = await api.get('/api/Dorms/by-furnishing', {
      params: { furnished }
    });
    return response.data;
  },

  // Get dorms by distance
  getDormsByDistance: async (maxDistance: number) => {
    const response = await api.get('/api/Dorms/by-distance', {
      params: { maxDistance }
    });
    return response.data;
  },

  // Check if dorm exists by ID
  dormExists: async (id: string) => {
    const response = await api.get(`/api/Dorms/exists/${id}`);
    return response.data;
  },

  // Check if dorm name exists
  dormNameExists: async (name: string) => {
    const response = await api.get('/api/Dorms/name-exists', {
      params: { name }
    });
    return response.data;
  },

  // Get dorm count by university
  getDormCountByUniversity: async (universityName: string) => {
    const response = await api.get('/api/Dorms/count/by-university', {
      params: { universityName }
    });
    return response.data;
  }
};