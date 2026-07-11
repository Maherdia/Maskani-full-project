import api from './axiosConfig';
import { AddUserDTO, LoginRequestDTO, UpdateUserDTO, UserDTO } from './types';

export const usersAPI = {
  getAllUsers: async (): Promise<UserDTO[]> => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  getUserById: async (userId: string | number): Promise<UserDTO> => {
    try {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  createUser: async (data: AddUserDTO): Promise<{ userId: number }> => {
    try {
      const response = await api.post('/api/users', data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId: string | number, data: UpdateUserDTO): Promise<void> => {
    try {
      await api.put(`/api/users/${userId}`, data);
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId: string | number): Promise<void> => {
    try {
      await api.delete(`/api/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },

  changePassword: async (userId: string | number, newPassword: string): Promise<void> => {
    try {
      await api.post(`/api/users/change-password/${userId}`, JSON.stringify(newPassword), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(`Error changing password for user with ID ${userId}:`, error);
      throw error;
    }
  },

  login: async (credentials: LoginRequestDTO): Promise<UserDTO> => {
    try {
      const response = await api.post('/api/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
}; 