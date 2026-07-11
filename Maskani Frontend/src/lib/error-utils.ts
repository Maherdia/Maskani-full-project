import { AxiosError } from 'axios';

/**
 * أنواع رسائل الخطأ
 */
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTH = 'auth',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

/**
 * واجهة رسالة الخطأ
 */
export interface ErrorMessage {
  type: ErrorType;
  message: string;
  details?: string | Record<string, string[]>;
  status?: number;
}

/**
 * تحليل خطأ axios وإرجاع رسالة خطأ منسقة
 */
export const parseApiError = (error: unknown): ErrorMessage => {
  if (error instanceof AxiosError) {
    // خطأ الشبكة (عدم اتصال بالخادم)
    if (error.code === 'ECONNABORTED' || !error.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'لا يمكن الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
      };
    }

    const status = error.response?.status;
    const data = error.response?.data;

    // خطأ المصادقة
    if (status === 401) {
      return {
        type: ErrorType.AUTH,
        message: 'انتهت صلاحية الجلسة أو المستخدم غير مصرح له. يرجى تسجيل الدخول مرة أخرى.',
        status
      };
    }

    // خطأ التحقق من الصحة
    if (status === 400 || status === 422) {
      return {
        type: ErrorType.VALIDATION,
        message: data?.message || 'بيانات غير صالحة. يرجى التحقق من المدخلات.',
        details: data?.errors || data?.details,
        status
      };
    }

    // خطأ الخادم
    if (status >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.',
        status
      };
    }

    // أي خطأ آخر من الخادم
    return {
      type: ErrorType.UNKNOWN,
      message: data?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      status
    };
  }

  // خطأ غير معروف
  return {
    type: ErrorType.UNKNOWN,
    message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
  };
};

/**
 * استخدام هذه الدالة في معالجة أخطاء API
 */
export const handleApiError = (error: unknown, callbacks?: {
  onNetworkError?: () => void;
  onAuthError?: () => void;
  onValidationError?: (details?: string | Record<string, string[]>) => void;
  onServerError?: () => void;
}): ErrorMessage => {
  const parsedError = parseApiError(error);
  
  // تشغيل معالج الخطأ المناسب
  switch (parsedError.type) {
    case ErrorType.NETWORK:
      callbacks?.onNetworkError?.();
      break;
    case ErrorType.AUTH:
      callbacks?.onAuthError?.();
      break;
    case ErrorType.VALIDATION:
      callbacks?.onValidationError?.(parsedError.details);
      break;
    case ErrorType.SERVER:
      callbacks?.onServerError?.();
      break;
  }
  
  return parsedError;
}; 