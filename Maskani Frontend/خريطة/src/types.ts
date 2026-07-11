
// تعريف واجهة البيانات للطالب
export interface StudentData {
  studentID: number;  // معرف الطالب الرئيسي (إلزامي)
  personID: number;   // معرف الشخص المرتبط بالطالب (إلزامي)
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  password?: string | null; // كلمة المرور (قد تكون مطلوبة في بعض الطلبات)
  [key: string]: unknown; // للسماح بوجود حقول إضافية
}

// تعريف واجهة البيانات للمالك
export interface OwnerData {
  ownerID: number;
  personID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  password?: string | null;
  [key: string]: unknown;
}

// تعريف واجهة البيانات للمدير
export interface AdminData {
  adminID: number;
  personID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  password?: string | null;
  [key: string]: unknown;
}
