/**
 * ملف مساعد للتنقل بين الصفحات في التطبيق
 * يمكن استخدامه من أي مكان بدون الحاجة إلى الوصول إلى مكونات React
 */

let navigateFunction: (path: string) => void;

/**
 * تعيين دالة التنقل من React Router
 * يجب استدعاء هذه الدالة عند بدء التطبيق
 */
export const initNavigate = (navFn: (path: string) => void) => {
  navigateFunction = navFn;
};

/**
 * دالة للتنقل بين الصفحات
 * يمكن استخدامها من أي مكان في التطبيق
 */
export const navigate = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    // استخدام window.location كبديل إذا لم يتم تعيين دالة التنقل
    window.location.href = path;
  }
}; 
