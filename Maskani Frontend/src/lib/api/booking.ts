import api from './axiosConfig';
import { BookingData, AddBookingDTO, UpdateBookingDTO } from './types';

// واجهة التعامل مع الحجوزات
export const bookingAPI = {
  // جلب جميع الحجوزات
  getAllBookings: async () => {
    try {
      const response = await api.get('/api/Booking');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  // إضافة حجز جديد
  addBooking: async (data: AddBookingDTO) => {
    try {
      const response = await api.post('/api/Booking', data);
      return response.data;
    } catch (error) {
      console.error('Error adding new booking:', error);
      throw error;
    }
  },

  // تحديث بيانات حجز
  updateBooking: async (data: UpdateBookingDTO) => {
    try {
      const response = await api.put('/api/Booking', data);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // جلب حجز بالمعرف
  getBookingById: async (bookingId: string | number) => {
    try {
      const response = await api.get(`/api/Booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking by ID:', error);
      throw error;
    }
  },

  // حذف حجز
  deleteBooking: async (bookingId: string | number) => {
    try {
      const response = await api.delete(`/api/Booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // جلب حجوزات المالك
  getOwnerBookings: async (ownerId: string | number) => {
    try {
      const response = await api.get(`/api/Booking/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      throw error;
    }
  },

  // جلب حجوزات الطالب
  getStudentBookings: async (studentId: string | number) => {
    try {
      const response = await api.get(`/api/Booking/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student bookings:', error);
      throw error;
    }
  },

  // جلب الحجوزات حسب الحالة
  getBookingsByStatus: async (status: string) => {
    try {
      const response = await api.get(`/api/Booking/status/${encodeURIComponent(status)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw error;
    }
  },

  // التحقق من وجود حجز
  checkBookingExists: async (studentId: number, roomId: number, bookId: number) => {
    try {
      const response = await api.get('/api/Booking/exists', {
        params: { studentId, roomId, bookID: bookId }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking booking existence:', error);
      throw error;
    }
  },

  // جلب عدد الحجوزات
  getBookingCount: async () => {
    try {
      const response = await api.get('/api/Booking/count');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking count:', error);
      throw error;
    }
  },

  // التحقق من وجود حجز مكرر
  checkDuplicateBooking: async (studentId: number, roomId: number, bookingId?: number) => {
    try {
      const response = await api.get('/api/Booking/exists', {
        params: { studentId, roomId, bookingId }
      });
      return response.data; // should be boolean
    } catch (error) {
      console.error('Error checking for duplicate booking:', error);
      throw error;
    }
  }
}; 