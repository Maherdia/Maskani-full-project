# واجهة برمجة التطبيقات (API)

هذا الملف يوضح كيفية استخدام واجهة برمجة التطبيقات (API) للاتصال بالخادم الخلفي (Backend) في تطبيق Maskani.

## ضبط الإعدادات

قبل استخدام الـ API، يجب عليك تحديث عنوان الخادم الخلفي في ملف `api.ts`:

```typescript
const API_URL = 'http://your-backend-url.com/api';
```

استبدل `http://your-backend-url.com/api` بعنوان الخادم الخلفي الحقيقي الخاص بك.

## الخدمات المتاحة

### خدمات المصادقة (authAPI)

```typescript
import { authAPI } from '@/lib/api';

// تسجيل الدخول
const loginUser = async () => {
  try {
    const response = await authAPI.login({
      email: 'user@example.com',
      password: 'password123',
      role: 'tenant' // or 'owner' or 'admin'
    });
    console.log('تم تسجيل الدخول بنجاح:', response);
  } catch (error) {
    console.error('فشل تسجيل الدخول:', error);
  }
};

// تسجيل مستخدم جديد
const registerUser = async () => {
  try {
    const response = await authAPI.register({
      firstName: 'محمد',
      lastName: 'أحمد',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'tenant'
    });
    console.log('تم التسجيل بنجاح:', response);
  } catch (error) {
    console.error('فشل التسجيل:', error);
  }
};

// طلب إعادة تعيين كلمة المرور
const resetPassword = async (email) => {
  try {
    await authAPI.requestPasswordReset(email);
    console.log('تم إرسال طلب إعادة تعيين كلمة المرور');
  } catch (error) {
    console.error('فشل طلب إعادة تعيين كلمة المرور:', error);
  }
};
```

### خدمات المستخدم (userAPI)

```typescript
import { userAPI } from '@/lib/api';

// جلب بيانات الملف الشخصي
const getProfile = async () => {
  try {
    const profile = await userAPI.getProfile();
    console.log('بيانات الملف الشخصي:', profile);
  } catch (error) {
    console.error('فشل جلب بيانات الملف الشخصي:', error);
  }
};

// تحديث بيانات الملف الشخصي
const updateProfile = async () => {
  try {
    const updatedProfile = await userAPI.updateProfile({
      firstName: 'الاسم الجديد',
      lastName: 'اللقب الجديد',
      phone: '0123456789'
    });
    console.log('تم تحديث الملف الشخصي:', updatedProfile);
  } catch (error) {
    console.error('فشل تحديث الملف الشخصي:', error);
  }
};
```

### خدمات العقارات (propertyAPI)

```typescript
import { propertyAPI } from '@/lib/api';

// جلب قائمة العقارات
const getProperties = async () => {
  try {
    const properties = await propertyAPI.getProperties({
      page: 1,
      limit: 10,
      location: 'الرياض'
    });
    console.log('قائمة العقارات:', properties);
  } catch (error) {
    console.error('فشل جلب قائمة العقارات:', error);
  }
};

// جلب تفاصيل عقار معين
const getPropertyDetails = async (propertyId) => {
  try {
    const property = await propertyAPI.getPropertyById(propertyId);
    console.log('تفاصيل العقار:', property);
  } catch (error) {
    console.error('فشل جلب تفاصيل العقار:', error);
  }
};

// إضافة عقار جديد (للمالك)
const addNewProperty = async () => {
  try {
    const propertyData = {
      title: 'شقة فاخرة',
      description: 'شقة حديثة بإطلالة رائعة',
      price: 1500,
      location: 'الرياض',
      address: 'حي الملقا، شارع التخصصي',
      propertyType: 'شقة',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      amenities: ['مكيف', 'انترنت', 'مسبح'],
      available: true
    };
    
    const newProperty = await propertyAPI.addProperty(propertyData);
    console.log('تمت إضافة العقار بنجاح:', newProperty);
  } catch (error) {
    console.error('فشل إضافة العقار:', error);
  }
};
```

### خدمات الحجوزات (bookingAPI)

```typescript
import { bookingAPI } from '@/lib/api';

// إنشاء حجز جديد
const createBooking = async (propertyId) => {
  try {
    const bookingData = {
      propertyId: propertyId,
      checkIn: new Date('2023-12-01'),
      checkOut: new Date('2023-12-10'),
      guests: 2,
      message: 'أتطلع للإقامة في هذا المكان الرائع'
    };
    
    const booking = await bookingAPI.createBooking(bookingData);
    console.log('تم إنشاء الحجز بنجاح:', booking);
  } catch (error) {
    console.error('فشل إنشاء الحجز:', error);
  }
};

// جلب حجوزات المستخدم
const getUserBookings = async () => {
  try {
    const bookings = await bookingAPI.getUserBookings();
    console.log('حجوزات المستخدم:', bookings);
  } catch (error) {
    console.error('فشل جلب حجوزات المستخدم:', error);
  }
};
```

### خدمات المراجعات (reviewAPI)

```typescript
import { reviewAPI } from '@/lib/api';

// إضافة مراجعة لعقار
const addReview = async (propertyId) => {
  try {
    const reviewData = {
      propertyId: propertyId,
      rating: 5,
      comment: 'تجربة رائعة! المكان نظيف ومريح والموقع ممتاز.'
    };
    
    const review = await reviewAPI.addReview(reviewData);
    console.log('تمت إضافة المراجعة بنجاح:', review);
  } catch (error) {
    console.error('فشل إضافة المراجعة:', error);
  }
};

// جلب مراجعات عقار معين
const getPropertyReviews = async (propertyId) => {
  try {
    const reviews = await reviewAPI.getPropertyReviews(propertyId);
    console.log('مراجعات العقار:', reviews);
  } catch (error) {
    console.error('فشل جلب مراجعات العقار:', error);
  }
};
```

## التعامل مع الملفات

عند تحميل الملفات مثل صور المستخدم أو صور العقارات، يجب استخدام `FormData`:

```typescript
const uploadProfilePicture = async (imageFile) => {
  try {
    const updatedProfile = await userAPI.updateProfile({
      avatar: imageFile // ملف الصورة
    });
    console.log('تم تحديث صورة الملف الشخصي:', updatedProfile);
  } catch (error) {
    console.error('فشل تحديث صورة الملف الشخصي:', error);
  }
};
```

## التعامل مع الأخطاء

جميع طلبات API تستخدم try/catch للتعامل مع الأخطاء. سيتم تلقائيًا التعامل مع أخطاء انتهاء صلاحية التوكن (401) وإعادة توجيه المستخدم إلى صفحة تسجيل الدخول.

```typescript
try {
  // استدعاء API
} catch (error) {
  if (error.response) {
    // الخطأ مع استجابة من الخادم
    console.error('رسالة الخطأ:', error.response.data.message);
    console.error('حالة الخطأ:', error.response.status);
  } else if (error.request) {
    // الخطأ بدون استجابة من الخادم
    console.error('لم يتم استلام استجابة من الخادم');
  } else {
    // خطأ في إعداد الطلب
    console.error('خطأ في إعداد الطلب:', error.message);
  }
}
``` 