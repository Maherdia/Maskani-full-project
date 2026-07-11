import api from './axiosConfig';
import { navigate } from '../navigation';
import { redirectBasedOnRole } from './auth';
import { API_URL } from '../config';

interface StudentDTO {
  personID: number;
  studentID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
}

interface AddStudentDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

interface UpdateStudentDTO {
  studentID: number;
  personID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

interface LoginRequestDTO {
  email: string;
  password: string;
}

// واجهة التعامل مع الطلاب
export const studentAPI = {
  // الحصول على قائمة جميع الطلاب
  getAllStudents: async () => {
    try {
      console.log("طلب جلب جميع الطلاب");
      const response = await api.get('/api/Students/all');
      console.log("استجابة getAllStudents:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw new Error('فشل في جلب بيانات جميع الطلاب. يرجى التحقق من الاتصال بالخادم.');
    }
  },

  // الحصول على طالب محدد باستخدام المعرف
  getStudentById: async (studentId: number) => {
    try {
      console.log(`طلب جلب الطالب بالمعرف: ${studentId}`);
      const response = await api.get(`/api/Students/${studentId}`);
      console.log("استجابة getStudentById:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student with ID ${studentId}:`, error);
      throw new Error(`فشل في جلب بيانات الطالب رقم ${studentId}. يرجى التحقق من الاتصال بالخادم.`);
    }
  },

  // إضافة طالب جديد (التسجيل)
  addStudent: async (data: AddStudentDTO) => {
    try {
      console.log("طلب إضافة طالب جديد:", data);
      const response = await api.post('/api/Students/add', data);
      console.log("استجابة تسجيل الطالب:", response.data);
      
      // حفظ البيانات في التخزين المحلي
      if (response.data) {
        localStorage.setItem('studentId', response.data.toString());
        localStorage.setItem('userRole', 'Student');
        localStorage.setItem('user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: 'Student'
        }));
      }
      
      // توجيه الطالب إلى الصفحة الرئيسية
      redirectBasedOnRole('Student');
      
      return response.data;
    } catch (error) {
      console.error('Error adding new student:', error);
      throw error;
    }
  },

  // تسجيل دخول الطالب
  login: async (data: LoginRequestDTO) => {
    try {
      console.log("طلب تسجيل دخول الطالب:", data);
      const response = await api.post('/api/Students/login', data);
      console.log("استجابة تسجيل دخول الطالب:", response.data);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('userRole', 'Student');
        localStorage.setItem('studentId', response.data.studentID.toString());
      }
      
      redirectBasedOnRole('Student');
      return response.data;
    } catch (error) {
      console.error('Error logging in student:', error);
      throw error;
    }
  },

  // تحديث بيانات الطالب
  updateStudent: async (data: UpdateStudentDTO) => {
    try {
      console.log("طلب تحديث بيانات الطالب:", data);
      const response = await api.put('/api/Students/update', data);
      console.log("استجابة تحديث الطالب:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // تغيير كلمة المرور
  changePassword: async (studentId: number, newPassword: string) => {
    try {
      console.log("طلب تغيير كلمة المرور للطالب:", studentId);
      const response = await api.post(`/api/Students/change-password/${studentId}`, JSON.stringify(newPassword), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("استجابة تغيير كلمة المرور:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // حذف حساب الطالب
  deleteStudent: async (studentId: number) => {
    try {
      console.log(`طلب حذف الطالب بالمعرف: ${studentId}`);
      const response = await api.delete(`/api/Students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting student with ID ${studentId}:`, error);
      throw error;
    }
  },

  // الحصول على طالب باستخدام البريد الإلكتروني
  getStudentByEmail: async (email: string) => {
    try {
      console.log(`طلب جلب الطالب بالبريد الإلكتروني: ${email}`);
      const response = await api.get(`/api/Students/StudentBy/{email}`, { params: { email } });
      console.log("استجابة getStudentByEmail:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student by email: ${email}`, error);
      throw error;
    }
  },

  // الحصول على طالب باستخدام معرف الشخص
  getStudentByPersonId: async (personId: number) => {
    try {
      console.log(`طلب جلب الطالب بمعرف الشخص: ${personId}`);
      const response = await api.get(`/api/Students/person/${personId}`);
      console.log("استجابة getStudentByPersonId:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching student by person ID: ${personId}`, error);
      throw error;
    }
  }
};