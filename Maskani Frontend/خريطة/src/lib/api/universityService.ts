import api from './axiosConfig';
import { UniversityDTO, AddUniversityDTO, UpdateUniversityDTO } from './types';

export const universityService = {
  // Get all universities
  async getAllUniversities(): Promise<UniversityDTO[]> {
    const response = await api.get('/api/universities');
    return response.data;
  },

  // Get university by ID
  async getUniversityById(id: number): Promise<UniversityDTO | null> {
    try {
      const response = await api.get(`/api/universities/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Add new university
  async addUniversity(university: AddUniversityDTO): Promise<number> {
    const response = await api.post('/api/universities', university);
    return response.data.id;
  },

  // Update university
  async updateUniversity(university: UpdateUniversityDTO): Promise<boolean> {
    try {
      await api.put('/api/universities', university);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // Delete university
  async deleteUniversity(id: number): Promise<boolean> {
    try {
      await api.delete(`/api/universities/${id}`);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}; 