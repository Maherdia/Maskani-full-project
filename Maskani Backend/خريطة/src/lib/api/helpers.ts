/**
 * أدوات مساعدة لنظام API
 * هذا الملف يحتوي على وظائف مساعدة مثل التخزين المؤقت، التتبع، وغيرها
 */

import { navigate } from '../navigation';

/**
 * نظام التخزين المؤقت
 * يستخدم لتخزين البيانات مؤقتاً وتقليل عدد الطلبات للخادم
 */
interface CacheEntry<T> {
  /** البيانات المخزنة */
  data: T;
  /** وقت تخزين البيانات (timestamp) */
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
/** مدة صلاحية البيانات المخزنة مؤقتاً (5 دقائق) */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * استرجاع البيانات المخزنة مؤقتاً
 * @param key مفتاح البيانات المخزنة
 * @returns البيانات المخزنة أو null إذا لم تكن موجودة أو منتهية الصلاحية
 */
export const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

/**
 * تخزين البيانات مؤقتاً
 * @param key مفتاح البيانات
 * @param data البيانات المراد تخزينها
 */
export const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * نظام التتبع
 * يستخدم لتسجيل المعلومات والأخطاء والتحذيرات
 */
interface LogData {
  [key: string]: unknown;
}

export const logger = {
  /**
   * تسجيل معلومات
   * @param message الرسالة
   * @param data البيانات الإضافية (اختياري)
   */
  info: (message: string, data?: LogData): void => {
    console.log(`[INFO] ${message}`, data || '');
  },

  /**
   * تسجيل خطأ
   * @param message رسالة الخطأ
   * @param error كائن الخطأ (اختياري)
   */
  error: (message: string, error?: unknown): void => {
    console.error(`[ERROR] ${message}`, error || '');
  },

  /**
   * تسجيل تحذير
   * @param message رسالة التحذير
   * @param data البيانات الإضافية (اختياري)
   */
  warn: (message: string, data?: LogData): void => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

/**
 * نظام إعادة المحاولة
 * يقوم بإعادة محاولة تنفيذ الطلب في حالة الفشل
 * @param fn الدالة المراد تنفيذها
 * @param retries عدد مرات إعادة المحاولة
 * @param delay التأخير بين المحاولات (بالميلي ثانية)
 */
export const retryRequest = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

/**
 * نظام التحكم في الطلبات المتزامنة
 * يمنع تكرار الطلبات المتزامنة للخادم
 */
const requestQueue = new Map<string, Promise<unknown>>();

/**
 * إضافة طلب إلى قائمة الانتظار
 * @param key مفتاح الطلب
 * @param request الدالة التي تنفذ الطلب
 * @returns نتيجة الطلب
 */
export const queueRequest = async <T>(key: string, request: () => Promise<T>): Promise<T> => {
  if (requestQueue.has(key)) {
    return requestQueue.get(key) as Promise<T>;
  }
  
  const promise = request();
  requestQueue.set(key, promise);
  
  try {
    const result = await promise;
    return result;
  } finally {
    requestQueue.delete(key);
  }
};

// دالة توجيه المستخدم حسب الدور (Role)
export const redirectBasedOnRole = (role: string) => {
    if (!role) return;
    
    // تحويل الدور إلى حالة موحدة للمقارنة (حروف صغيرة)
    const normalizedRole = role.toLowerCase();
    
    switch (normalizedRole) {
      case 'owner':
        navigate('/owner-dashboard');
        break;
      case 'student':
        navigate('/');
        break;
      case 'admin':
      case 'user': // إضافة حالة 'user' لضمان توجيه المستخدمين إلى لوحة التحكم
        navigate('/admin-dashboard');
        break;
      default:
        // في حالة عدم التعرف على الدور، توجيه إلى الصفحة الرئيسية
        navigate('/');
    }
  };
  
  export const clearCache = (key?: string) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  }; 