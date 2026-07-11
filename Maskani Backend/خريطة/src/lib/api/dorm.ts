import api from './axiosConfig';
import { DormData, AddDormDTO, UpdateDormDTO, SearchDormParams, PagedResult } from './types';

// واجهة التعامل مع السكنات (Dorms)
export const dormAPI = {
  // Get all dorms
  getAllDorms: async () => {
    const response = await api.get('/api/Dorms/all');
    return response.data;
  },

  // Get dorm by ID
  getDormById: async (dormId: string) => {
    const response = await api.get(`/api/Dorms/${dormId}`);
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

  // Search dorms
  searchDorms: async (params: SearchDormParams) => {
    try {
      console.log('Searching dorms with params:', params);
      const queryParams = new URLSearchParams();
      
      if (params.university) {
        queryParams.append('university', params.university);
      }
      if (typeof params.maxDistance === 'number' && !isNaN(params.maxDistance)) {
        queryParams.append('maxDistance', Math.max(0, params.maxDistance).toString());
      }
      if (typeof params.furnished === 'boolean') {
        queryParams.append('furnished', params.furnished.toString());
      }
      if (params.address) {
        queryParams.append('address', params.address);
      }
      if (params.dormName) {
        queryParams.append('dormName', params.dormName);
      }

      const url = `/api/Dorms/search?${queryParams.toString()}`;
      console.log('Constructed URL:', url);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching dorms:', error);
      if (error.response?.status === 500) {
        console.error('Server error details:', error.response.data);
      }
      return []; // Return empty array instead of throwing
    }
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