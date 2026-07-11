/**
 * إعدادات التطبيق
 */

// عنوان الخادم الخلفي (API)
export const API_URL = 'http://localhost:5236';

// وقت انتهاء صلاحية التوكن (بالدقائق)
export const TOKEN_EXPIRY = 60;

// الإعدادات الأخرى
export const APP_SETTINGS = {
  defaultPageSize: 10,
  maxUploadSize: 5, // بالميجابايت
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

// إعدادات متنوعة
export const APP_CONFIG = {
  // مدة صلاحية الجلسة (بالدقائق)
  sessionTimeout: 60,
  
  // إعدادات تحميل الملفات
  upload: {
    // الحد الأقصى لحجم الملف (بالبايت) - 5 ميجابايت
    maxFileSize: 5 * 1024 * 1024,
    // أنواع الملفات المسموح بها
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  
  // إعدادات قائمة العقارات
  propertyList: {
    // عدد العناصر في الصفحة الواحدة
    itemsPerPage: 10,
  },
};

// الإصدار الحالي للتطبيق
export const APP_VERSION = '1.0.0';

// إعدادات البيئة
export const ENVIRONMENT = process.env.NODE_ENV || 'development';

// مفاتيح الميزات
export const FEATURE_FLAGS = {
  enableNewDashboard: true,
  enableAdvancedSearch: false,
};

// إعدادات الواجهة
export const THEME_SETTINGS = {
  defaultTheme: 'light', // 'light' or 'dark'
};

// إعدادات تسجيل الأخطاء
export const LOGGING_SETTINGS = {
  level: 'info', // 'error', 'warn', 'info', 'debug'
};

// Other configuration settings can be added here
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/Login/Login',
  REGISTER: '/Register',
  
  // Student endpoints
  STUDENTS: '/Students',
  STUDENTS_BY_ID: (id: string) => `/Students/${id}`,
  
  // Owner endpoints
  OWNERS: '/DormsOwners',
  OWNERS_BY_ID: (id: string) => `/DormsOwners/${id}`,
  
  // User/Admin endpoints
  USERS: '/Users',
  USERS_BY_ID: (id: string) => `/Users/${id}`,
  
  // Booking endpoints
  BOOKINGS: '/Booking',
  BOOKINGS_BY_ID: (id: string) => `/Booking/${id}`,
};

// Other configuration constants can be added here
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_COORDINATES = {
  lat: 31.9539,
  lng: 35.9106
}; 