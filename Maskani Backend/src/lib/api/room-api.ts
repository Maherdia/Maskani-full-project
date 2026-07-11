import api from './axiosConfig';
import { RoomDTO, AddRoomDTO, UpdateRoomDTO } from './types';

export const roomAPI = {
  // Get all rooms
  getAllRooms: async () => {
    const response = await api.get<RoomDTO[]>('/api/Rooms');
    return response.data;
  },

  // Get room by ID
  getRoomById: async (id: number) => {
    const response = await api.get<RoomDTO>(`/api/Rooms/${id}`);
    return response.data;
  },

  // Add new room
  addRoom: async (data: AddRoomDTO) => {
    const response = await api.post<number>('/api/Rooms', data);
    return response.data;
  },

  // Update room
  updateRoom: async (data: UpdateRoomDTO) => {
    const response = await api.put('/api/Rooms', data);
    return response.status === 200;
  },

  // Delete room
  deleteRoom: async (id: number) => {
    const response = await api.delete(`/api/Rooms/${id}`);
    return response.status === 200;
  },

  // Get rooms by dorm ID
  getRoomsByDormId: async (dormId: string) => {
    const response = await api.get<RoomDTO[]>(`/api/Rooms/dorm/${dormId}`);
    return response.data;
  },

  // Get rooms by price range
  getRoomsByPriceRange: async (min: number, max: number) => {
    const response = await api.get<RoomDTO[]>('/api/Rooms/price-range', {
      params: { min, max }
    });
    return response.data;
  },

  // Check if room exists
  roomExists: async (roomId: number) => {
    const response = await api.get<boolean>(`/api/Rooms/exists/${roomId}`);
    return response.data;
  }
}; 