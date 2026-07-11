import { UserDTO } from '../api/types';

// المفاتيح المستخدمة في التخزين المحلي
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ROLE: 'userRole',
  STUDENT_ID: 'studentId',
  OWNER_ID: 'ownerId',
  USER_ID: 'userId'
} as const;

// واجهة للتعامل مع التخزين المحلي
export const storageService = {
  // حفظ التوكن
  setToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  // الحصول على التوكن
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // حفظ بيانات المستخدم
  setUser(user: UserDTO & { role?: string }) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // الحصول على بيانات المستخدم
  getUser(): (UserDTO & { role?: string }) | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // حفظ دور المستخدم
  setUserRole(role: string) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  // الحصول على دور المستخدم
  getUserRole(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  },

  // حفظ معرف الطالب
  setStudentId(id: string | number) {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, String(id));
  },

  // الحصول على معرف الطالب
  getStudentId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
  },

  // حفظ معرف المالك
  setOwnerId(id: string | number) {
    localStorage.setItem(STORAGE_KEYS.OWNER_ID, String(id));
  },

  // الحصول على معرف المالك
  getOwnerId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.OWNER_ID);
  },

  // حفظ معرف المستخدم
  setUserId(id: string | number) {
    localStorage.setItem(STORAGE_KEYS.USER_ID, String(id));
  },

  // الحصول على معرف المستخدم
  getUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ID);
  },

  // حفظ بيانات المصادقة كاملة
  setAuthData(data: { 
    token: string; 
    user: UserDTO & { role?: string }; 
    role: string;
    id?: string | number;
  }) {
    this.setToken(data.token);
    this.setUser(data.user);
    this.setUserRole(data.role);

    // حفظ المعرف المناسب حسب نوع المستخدم
    switch (data.role.toLowerCase()) {
      case 'student':
        if (data.id) this.setStudentId(data.id);
        break;
      case 'owner':
        if (data.id) this.setOwnerId(data.id);
        break;
      case 'user':
      case 'admin':
        if (data.id) this.setUserId(data.id);
        break;
    }
  },

  // مسح جميع بيانات المصادقة
  clearAuthData() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.OWNER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  },

  // التحقق من وجود جلسة مصادقة نشطة
  hasActiveSession(): boolean {
    return !!(this.getToken() && this.getUser() && this.getUserRole());
  }
}; 