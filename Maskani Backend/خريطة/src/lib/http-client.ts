import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from './config';
import { handleApiError, ErrorMessage } from './error-utils';

// واجهة نتيجة الطلب
export interface RequestResult<T> {
  data?: T;
  error?: ErrorMessage;
  status?: number;
  isSuccess: boolean;
}

// إعداد الـ axios client
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// إضافة اعتراض الطلبات لإضافة التوكن تلقائيًا
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * تنفيذ طلب HTTP
 * @param config ضبط الطلب
 * @returns نتيجة الطلب
 */
export async function request<T = unknown>(config: AxiosRequestConfig): Promise<RequestResult<T>> {
  try {
    const response: AxiosResponse<T> = await axiosClient(config);
    return {
      data: response.data,
      status: response.status,
      isSuccess: true,
    };
  } catch (error) {
    const parsedError = handleApiError(error, {
      onAuthError: () => {
        // تنفيذ عملية تسجيل الخروج عند انتهاء صلاحية التوكن
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      },
    });

    return {
      error: parsedError,
      status: (error as AxiosError)?.response?.status,
      isSuccess: false,
    };
  }
}

// واجهة HTTP للطلبات الشائعة
const httpClient = {
  /**
   * طلب GET
   * @param url مسار الطلب
   * @param params معلمات الاستعلام (query parameters)
   * @param config ضبط إضافي
   * @returns نتيجة الطلب
   */
  get: <T = unknown>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  },

  /**
   * طلب POST
   * @param url مسار الطلب
   * @param data البيانات المرسلة
   * @param config ضبط إضافي
   * @returns نتيجة الطلب
   */
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  },

  /**
   * طلب PUT
   * @param url مسار الطلب
   * @param data البيانات المرسلة
   * @param config ضبط إضافي
   * @returns نتيجة الطلب
   */
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  },

  /**
   * طلب PATCH
   * @param url مسار الطلب
   * @param data البيانات المرسلة
   * @param config ضبط إضافي
   * @returns نتيجة الطلب
   */
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  },

  /**
   * طلب DELETE
   * @param url مسار الطلب
   * @param config ضبط إضافي
   * @returns نتيجة الطلب
   */
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  },

  /**
   * تحميل ملف
   * @param url مسار الطلب
   * @param formData بيانات الملف
   * @param onProgress دالة لمتابعة تقدم التحميل
   * @returns نتيجة الطلب
   */
  upload: <T = unknown>(
    url: string, 
    formData: FormData, 
    onProgress?: (progress: number) => void
  ): Promise<RequestResult<T>> => {
    return request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  },
};

export default httpClient; 