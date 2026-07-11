import api from './axiosConfig';

// واجهة التعامل مع المراجعات والتقييمات
export const reviewAPI = {
  // إضافة مراجعة لعقار
  addReview: async (data: {
    propertyId: string;
    rating: number;
    comment: string;
  }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // جلب مراجعات عقار معين
  getPropertyReviews: async (propertyId: string) => {
    const response = await api.get(`/reviews/property/${propertyId}`);
    return response.data;
  },

  // جلب مراجعات المستخدم
  getUserReviews: async () => {
    const response = await api.get('/reviews/user');
    return response.data;
  },

  // حذف مراجعة
  deleteReview: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
}; 