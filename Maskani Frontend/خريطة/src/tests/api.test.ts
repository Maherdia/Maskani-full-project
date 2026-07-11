import { describe, it, expect } from 'vitest';
import { dormAPI, bookingAPI, updateUserProfile, authAPI, checkConnection } from '../lib/api';

// ملاحظة: بعض الاختبارات قد تحتاج بيانات حقيقية أو صلاحيات مناسبة

describe('API Connection', () => {
  it('should check connection using checkConnection function', async () => {
    const isConnected = await checkConnection();
    expect(isConnected).toBe(true);
  });

  it('should check connection (health endpoint)', async () => {
    // نعتبر أن الاتصال ناجح إذا لم يحدث خطأ
    let error = null;
    try {
      const dorms = await dormAPI.getAllDorms();
      expect(Array.isArray(dorms)).toBe(true);
    } catch (err) {
      error = err;
    }
    expect(error).toBeNull();
  });
});

describe('Dorm API', () => {
  let dormId: number | string;
  const testDorm = {
    name: 'اختبار سكن',
    address: 'عنوان الاختبار',
    universityName: 'جامعة الاختبار',
    ownerId: 1,
    roomsCount: 10,
    price: 500,
    description: 'سكن للاختبار فقط',
    amenities: ['WiFi', 'مطبخ']
  };

  it('should add a new dorm', async () => {
    const dorm = await dormAPI.addDorm(testDorm);
    expect(dorm).toBeDefined();
    expect(dorm.id || dorm.dormId).toBeDefined();
    dormId = dorm.id || dorm.dormId;
  });

  it('should get dorm by id', async () => {
    const dorm = await dormAPI.getDormById(dormId);
    expect(dorm).toBeDefined();
    expect(dorm.name).toBe(testDorm.name);
  });

  it('should update dorm', async () => {
    const updated = await dormAPI.updateDorm(dormId, { name: 'سكن محدث' });
    expect(updated).toBeDefined();
    expect(updated.name).toBe('سكن محدث');
  });

  it('should delete dorm', async () => {
    const res = await dormAPI.deleteDorm(dormId);
    expect(res).toBeDefined();
  });
});

describe('Booking API', () => {
  let bookingId: number | string;
  // يجب أن يكون لديك studentId و dormId صالحين في قاعدة البيانات
  const testBooking = {
    studentId: 1,
    dormId: 1,
    checkIn: new Date().toISOString(),
    checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    notes: 'حجز اختبار'
  };

  it('should add a booking', async () => {
    const booking = await bookingAPI.addBooking(testBooking);
    expect(booking).toBeDefined();
    expect(booking.id || booking.bookingId).toBeDefined();
    bookingId = booking.id || booking.bookingId;
  });

  it('should get booking by id', async () => {
    const booking = await bookingAPI.getBookingById(bookingId);
    expect(booking).toBeDefined();
    expect(booking.studentId).toBe(testBooking.studentId);
  });

  it('should update booking', async () => {
    const updated = await bookingAPI.updateBooking(bookingId, { status: 'approved' });
    expect(updated).toBeDefined();
    expect(updated.status).toBe('approved');
  });

  it('should delete booking', async () => {
    const res = await bookingAPI.deleteBooking(bookingId);
    expect(res).toBeDefined();
  });
});

describe('User Profile', () => {
  it('should update user profile (if logged in)', async () => {
    // يجب أن يكون المستخدم مسجلاً الدخول مسبقاً
    const userData = {
      firstName: 'اسم',
      lastName: 'تجريبي',
      phone: '123456789',
      email: 'testuser@example.com',
      password: 'test1234'
    };
    let error = null;
    try {
      const res = await updateUserProfile(userData);
      expect(res).toBeDefined();
    } catch (err) {
      error = err;
    }
    // إذا لم يكن هناك مستخدم مسجل دخول سيظهر خطأ
    expect(error).toBeNull();
  });
});

describe('Auth API', () => {
  it('should get current user (if logged in)', async () => {
    let error = null;
    try {
      const user = await authAPI.getCurrentUser();
      expect(user).toBeDefined();
    } catch (err) {
      error = err;
    }
    // إذا لم يكن هناك مستخدم مسجل دخول سيظهر خطأ
    expect(error).toBeNull();
  });
}); 