import { UserDTO } from '../api/types';

// المفاتيح المستخدمة في التخزين المحلي
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ROLE: 'userRole',
  STUDENT_ID: 'studentId',
  OWNER_ID: 'ownerId',
  USER_ID: 'userId',
  PERSON_ID: 'personId',
  DORM_ID: 'dormID',
  REFRESH_TOKEN: 'refreshToken'
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
  setUser(user: UserDTO & { role?: string; dormID?: string }) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (user.dormID) {
      localStorage.setItem(STORAGE_KEYS.DORM_ID, user.dormID);
    }
  },

  // الحصول على بيانات المستخدم
  getUser(): (UserDTO & { role?: string; dormID?: string }) | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      if (userStr) {
        const userData = JSON.parse(userStr);
        // تحقق من وجود dormID في التخزين المنفصل
        const dormID = localStorage.getItem(STORAGE_KEYS.DORM_ID);
        if (dormID) {
          userData.dormID = dormID;
        }
        return userData;
      }
      return null;
    } catch {
      return null;
    }
  },

  // حفظ دور المستخدم بشكل مباشر
  setUserRole(role: string) {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  // الحصول على دور المستخدم
  getUserRole(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  },

  // حفظ معرف الطالب
  setStudentId(id: number) {
    localStorage.setItem(STORAGE_KEYS.STUDENT_ID, String(id));
  },

  // الحصول على معرف الطالب
  getStudentId(): number | null {
    const id = localStorage.getItem(STORAGE_KEYS.STUDENT_ID);
    return id ? Number(id) : null;
  },

  // حفظ معرف المالك
  setOwnerId(id: number) {
    localStorage.setItem(STORAGE_KEYS.OWNER_ID, String(id));
  },

  // الحصول على معرف المالك
  getOwnerId(): number | null {
    const id = localStorage.getItem(STORAGE_KEYS.OWNER_ID);
    return id ? Number(id) : null;
  },

  // حفظ معرف المستخدم
  setUserId(id: number) {
    localStorage.setItem(STORAGE_KEYS.USER_ID, String(id));
  },

  // الحصول على معرف المستخدم
  getUserId(): number | null {
    const id = localStorage.getItem(STORAGE_KEYS.USER_ID);
    return id ? Number(id) : null;
  },

  // حفظ بيانات المصادقة كاملة
  setAuthData(data: { 
    token: string; 
    user: UserDTO & { role?: string }; 
    role: string;
    id?: number;
  }) {
    this.setToken(data.token);
    this.setUser(data.user);
    this.setUserRole(data.role);

    // حفظ المعرف المناسب حسب نوع المستخدم
    const role = data.role || data.user.role;
    if (!role) return;

    switch (role.toLowerCase()) {
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
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // التحقق من وجود جلسة نشطة
  hasActiveSession(): boolean {
    return Boolean(
      localStorage.getItem(STORAGE_KEYS.TOKEN) &&
      localStorage.getItem(STORAGE_KEYS.USER)
    );
  }
}; 