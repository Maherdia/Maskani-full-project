import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import { studentAPI, bookingAPI } from '@/lib/api';
import { roomAPI } from '@/lib/api/room';
import { dormAPI } from '@/lib/api/dorm';
import type { BookingData, RoomDTO, AddBookingDTO, DormData } from '@/lib/api/types';
import { AxiosError } from 'axios';

// مخطط التحقق من صحة نموذج الحجز باستخدام Zod
const bookingSchema = z.object({
  duration: z.number().min(1, 'المدة مطلوبة').max(12, 'الحد الأقصى 12 شهر'),
  numberOfGuests: z.number().min(1, 'يجب أن يكون هناك ضيف واحد على الأقل').max(10, 'الحد الأقصى 10 ضيوف')
});

// تعريف نوع البيانات للنموذج
type BookingFormValues = z.infer<typeof bookingSchema>;

// تعريف نوع بيانات الطالب
interface StudentData {
  personID: number;
  studentID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

// تعريف حالة التحميل
interface LoadingState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// مكون صفحة الحجز الرئيسي
const Booking: React.FC = () => {
  // استخدام خدمة المصادقة للتحقق من تسجيل دخول المستخدم
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const params = useParams<{ dormId: string }>();
  const location = useLocation();
  
  // الحصول على المعرفات من URL وstate
  const dormId = params.dormId;
  const { roomId, dormData: passedDormData } = (location.state as { roomId?: number, dormData?: DormData }) || {};
  
  // حالة المكون المحسنة
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    isSubmitting: false,
    error: null
  });
  
  const [roomDetails, setRoomDetails] = useState<RoomDTO | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [fetchedDormId, setFetchedDormId] = useState<string | null>(null);

  // تهيئة نموذج الحجز
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 1,
      numberOfGuests: 1,
    },
  });

  // التحقق من صحة المعرفات المطلوبة
  const validateBookingRequirements = useCallback(async (): Promise<boolean> => {
    try {
      // التحقق من المعرفات الأساسية
      if (!dormId || !roomId || typeof roomId !== 'number' || !Number.isInteger(roomId)) {
        throw new Error(!dormId ? "معرف السكن مفقود" : "معرف الغرفة مفقود أو غير صالح");
      }

      // التحقق من تسجيل الدخول والصلاحيات
      if (!isAuthenticated || !user) {
        throw new Error('يرجى تسجيل الدخول للمتابعة');
      }

      // التحقق من دور المستخدم
      if (user.role !== 'Student') {
        throw new Error('يجب أن تكون طالباً للقيام بالحجز');
      }

      // التحقق من وجود معرف الطالب
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        // محاولة إعادة تحميل بيانات المستخدم
        try {
          const userStr = localStorage.getItem('user');
          console.log('User data from localStorage:', userStr);
          
          if (userStr) {
            const userData = JSON.parse(userStr);
            console.log('Parsed user data:', userData);
            
            // البحث عن معرف الطالب في جميع الحقول المحتملة
            const possibleId = 
              userData.studentId || 
              userData.studentID || 
              userData.student_id || 
              (userData.role === 'Student' ? userData.id : null);

            if (possibleId) {
              console.log('Found student ID:', possibleId);
              localStorage.setItem('studentId', possibleId.toString());
            } else {
              console.log('Available fields in user data:', Object.keys(userData));
              // محاولة جلب بيانات الطالب من الخادم
              try {
                const studentDetails = await studentAPI.getStudentByEmail(userData.email);
                if (studentDetails?.studentID) {
                  localStorage.setItem('studentId', studentDetails.studentID.toString());
                } else {
                  throw new Error('لم يتم العثور على معرف الطالب');
                }
              } catch (apiError) {
                console.error('خطأ في جلب بيانات الطالب:', apiError);
                throw new Error('يرجى تسجيل الخروج وإعادة تسجيل الدخول');
              }
            }
          } else {
            throw new Error('بيانات المستخدم غير موجودة');
          }
        } catch (error) {
          console.error('خطأ في استرجاع بيانات المستخدم:', error);
          throw new Error('يرجى تسجيل الخروج وإعادة تسجيل الدخول');
        }
      }

      // التحقق من وجود السكن والغرفة
      try {
        let dormToValidate: DormData | undefined;

        // إذا تم تمرير بيانات السكن وكانت متطابقة، استخدمها مباشرة
        if (passedDormData && String(passedDormData.dormID) === dormId) {
          dormToValidate = passedDormData;
        } else {
          // وإلا، قم بجلبها من الخادم
          dormToValidate = await dormAPI.getDormById(dormId!);
        }

        if (!dormToValidate || !dormToValidate.dormID) {
          throw new Error('السكن غير موجود');
        }
        setFetchedDormId(dormToValidate.dormID);

        // التحقق من وجود الغرفة
        const roomExists = await roomAPI.roomExists(roomId);
        if (!roomExists) {
          throw new Error('الغرفة غير موجودة');
        }
      } catch (apiError) {
        console.error('خطأ في التحقق من السكن والغرفة:', apiError);
        throw new Error('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى');
      }

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
      
      setLoadingState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "خطأ في التحقق",
        description: errorMessage,
        variant: "destructive"
      });

      // إعادة التوجيه حسب نوع الخطأ
      if (errorMessage.includes('تسجيل الدخول') || errorMessage.includes('الخروج')) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: errorMessage
          } 
        });
      } else {
        navigate(-1);
      }
      return false;
    }
  }, [dormId, roomId, isAuthenticated, user, toast, navigate, location.pathname, passedDormData]);

  // تحميل بيانات الطالب
  const loadStudentData = useCallback(async (): Promise<void> => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
      setLoadingState(prev => ({ 
        ...prev, 
        error: 'معرف الطالب غير موجود' 
      }));
      return;
    }

    try {
      const student = await studentAPI.getStudentById(parseInt(studentId, 10));
      if (student) {
        setStudentData(student);
      } else {
        throw new Error('لم يتم العثور على بيانات الطالب');
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات الطالب:', error);
      setLoadingState(prev => ({ 
        ...prev, 
        error: 'فشل في تحميل بيانات الطالب' 
      }));
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات الطالب',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // تحميل تفاصيل الغرفة
  const loadRoomDetails = useCallback(async (): Promise<void> => {
    if (!roomId) return;

    try {
      const room = await roomAPI.getRoomById(roomId);
      setRoomDetails(room);
    } catch (error) {
      console.error('خطأ في تحميل تفاصيل الغرفة:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل تفاصيل الغرفة',
        variant: 'destructive',
      });
    }
  }, [roomId, toast]);

  // التحقق من الحجوزات المكررة
  const checkDuplicateBooking = useCallback(async (): Promise<boolean> => {
    if (!roomId || !studentData?.studentID) return false;

    try {
      return await bookingAPI.checkDuplicateBooking(
        studentData.studentID,
        roomId
      );
    } catch (error) {
      console.error('خطأ في التحقق من الحجوزات المكررة:', error);
      return false;
    }
  }, [roomId, studentData?.studentID]);

  // تهيئة المكون عند التحميل
  useEffect(() => {
    const initializeBooking = async () => {
      setLoadingState(prev => ({ ...prev, isLoading: true, error: null }));

      // التحقق من تسجيل الدخول
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: location.pathname,
            message: 'يرجى تسجيل الدخول للمتابعة مع عملية الحجز'
          } 
        });
        return;
      }

      // التحقق من المتطلبات الأساسية
      const isValid = await validateBookingRequirements();
      if (!isValid) {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // تحميل البيانات بشكل متوازي
        const [, , hasDuplicate] = await Promise.all([
          loadStudentData(),
          loadRoomDetails(),
          checkDuplicateBooking()
        ]);

        if (hasDuplicate) {
          setLoadingState(prev => ({ 
            ...prev, 
            error: 'لديك حجز مسبق لهذه الغرفة' 
          }));
        }
      } catch (error) {
        console.error('خطأ في تهيئة الحجز:', error);
        setLoadingState(prev => ({ 
          ...prev, 
          error: 'فشل في تحميل بيانات الحجز' 
        }));
      } finally {
        setLoadingState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeBooking();
  }, [
    isAuthenticated, 
    validateBookingRequirements, 
    loadStudentData, 
    loadRoomDetails, 
    checkDuplicateBooking, 
    navigate, 
    location.pathname
  ]);

  // معالجة تقديم النموذج
  const onSubmit = async (values: BookingFormValues) => {
    if (!studentData?.studentID || !roomId || !fetchedDormId || !roomDetails) {
      toast({
        title: 'خطأ',
        description: 'بيانات الحجز غير مكتملة',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingState(prev => ({ ...prev, isSubmitting: true, error: null }));

      // التحقق من الحجوزات المكررة مرة أخرى
      const hasDuplicateBooking = await checkDuplicateBooking();
      if (hasDuplicateBooking) {
        throw new Error('لديك حجز مسبق لهذه الغرفة');
      }

      // إعداد بيانات الحجز
      const bookingData: AddBookingDTO = {
        studentID: studentData.studentID,
        dormID: fetchedDormId!,
        roomID: roomId,
        bookingDate: new Date(),
        period: values.duration,
        status: 'pending',
        priceMonthly: roomDetails.price,
        totalAmount: roomDetails.price * values.duration
      };

      // حفظ الحجز في قاعدة البيانات
      const response = await bookingAPI.addBooking(bookingData);
      
      // عرض رسالة نجاح
      toast({
        title: 'تم إرسال طلب الحجز!',
        description: 'تم إرسال طلب الحجز إلى مالك السكن للموافقة عليه.',
      });
      
      // الانتقال إلى صفحة تفاصيل الحجز
      if (response && response.bookID) {
        navigate(`/student-booking/${response.bookID}`);
      } else {
        navigate('/my-bookings');
      }
    } catch (error) {
      console.error('خطأ في الحجز:', error);
      let errorMessage = 'فشل في معالجة الحجز';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          errorMessage = 'هذه الغرفة محجوزة مسبقاً. الرجاء اختيار غرفة أخرى أو تاريخ آخر.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setLoadingState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: 'فشل الحجز',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoadingState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // حساب السعر الإجمالي
  const duration = form.watch('duration');
  const totalPrice = useMemo(() => {
    return duration * (roomDetails?.price || 0);
  }, [duration, roomDetails?.price]);

  // عرض حالة التحميل
  if (loadingState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">جاري تحميل المعلومات...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // عرض خطأ إذا كان هناك خطأ في التحميل
  if (loadingState.error && !roomDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-lg font-medium">
                  {loadingState.error}
                </div>
                <Button onClick={() => navigate(-1)} variant="outline">
                  العودة للخلف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // عرض نموذج الحجز
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* قسم المعلومات الشخصية */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">المعلومات الشخصية</h2>
                  {studentData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">الاسم الكامل:</span>
                        <span>{`${studentData.firstName} ${studentData.lastName}`}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">البريد الإلكتروني:</span>
                        <span>{studentData.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">رقم الهاتف:</span>
                        <span>{studentData.phone || 'غير متوفر'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">جاري تحميل البيانات الشخصية...</div>
                  )}
                </CardContent>
              </Card>

              {/* قسم تفاصيل الحجز */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">تفاصيل الحجز</h2>
                  <div className="space-y-4">
                    {/* اختيار مدة الإيجار */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مدة الإيجار</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[1, 2, 3, 4].map((months) => (
                                <Button
                                  key={months}
                                  type="button"
                                  variant={field.value === months ? "default" : "outline"}
                                  className={cn(
                                    "w-full",
                                    field.value === months && "bg-blue-500 hover:bg-blue-600 text-white"
                                  )}
                                  onClick={() => field.onChange(months)}
                                  disabled={loadingState.isSubmitting}
                                >
                                  {months} {months === 1 ? 'شهر' : 'أشهر'}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* اختيار عدد النزلاء */}
                    <FormField
                      control={form.control}
                      name="numberOfGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد النزلاء</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              disabled={loadingState.isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* قسم ملخص الحجز */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">ملخص الحجز</h2>
                  <div className="space-y-2">
                    {/* عرض تفاصيل الغرفة */}
                    {roomDetails && (
                      <div className="flex justify-between">
                        <span>رقم الغرفة:</span>
                        <span>{roomDetails.roomNumber}</span>
                      </div>
                    )}
                    {/* عرض مدة الإقامة */}
                    <div className="flex justify-between">
                      <span>المدة:</span>
                      <span>
                        {form.watch('duration')} {form.watch('duration') === 1 ? 'شهر' : 'أشهر'}
                      </span>
                    </div>
                    {/* عرض السعر الشهري */}
                    <div className="flex justify-between">
                      <span>السعر شهرياً:</span>
                      <span>{roomDetails?.price || 0} دينار</span>
                    </div>
                    {/* عرض عدد النزلاء */}
                    <div className="flex justify-between">
                      <span>عدد النزلاء:</span>
                      <span>
                        {form.watch('numberOfGuests')} {form.watch('numberOfGuests') === 1 ? 'نزيل' : 'نزلاء'}
                      </span>
                    </div>
                    {/* عرض السعر الإجمالي */}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>السعر الإجمالي:</span>
                      <span>{totalPrice} دينار</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * السعر يشمل جميع المرافق والخدمات
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* عرض رسالة الخطأ إن وجدت */}
              {loadingState.error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="text-red-600 text-center">
                      {loadingState.error}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* زر تأكيد الحجز */}
              <Button
                type="submit"
                className="w-full bg-maskani-primary hover:bg-maskani-primary/90"
                disabled={loadingState.isSubmitting || !!loadingState.error}
              >
                {loadingState.isSubmitting ? 'جاري المعالجة...' : 'تأكيد الحجز'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Booking;