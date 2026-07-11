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
import { ChevronLeft } from 'lucide-react';

import { studentAPI, bookingAPI } from '@/lib/api';
import { roomAPI } from '@/lib/api/room';
import { dormAPI } from '@/lib/api/dorm';
import type { BookingData, RoomDTO, AddBookingDTO, DormData } from '@/lib/api/types';
import { AxiosError } from 'axios';

// Booking form validation schema using Zod
const bookingSchema = z.object({
  duration: z.number().min(1, 'Duration is required').max(12, 'Maximum duration is 12 months')
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
      duration: 1
    }
  });

  // Validate booking requirements
  const validateBookingRequirements = useCallback(async (): Promise<boolean> => {
    try {
      // Validate basic IDs
      if (!dormId || !roomId || typeof roomId !== 'number' || !Number.isInteger(roomId)) {
        throw new Error(!dormId ? "Dorm ID is missing" : "Room ID is missing or invalid");
      }

      // Check login and permissions
      if (!isAuthenticated || !user) {
        throw new Error('Please login to continue');
      }

      // Check user role
      if (user.role !== 'Student') {
        throw new Error('You must be a student to make a booking');
      }

      // Check for student ID
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        try {
          const userStr = localStorage.getItem('user');
          console.log('User data from localStorage:', userStr);
          
          if (userStr) {
            const userData = JSON.parse(userStr);
            console.log('Parsed user data:', userData);
            
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
              try {
                const studentDetails = await studentAPI.getStudentByEmail(userData.email);
                if (studentDetails?.studentID) {
                  localStorage.setItem('studentId', studentDetails.studentID.toString());
                } else {
                  throw new Error('Student ID not found');
                }
              } catch (apiError) {
                console.error('Error fetching student data:', apiError);
                throw new Error('Please logout and login again');
              }
            }
          } else {
            throw new Error('User data not found');
          }
        } catch (error) {
          console.error('Error retrieving user data:', error);
          throw new Error('Please logout and login again');
        }
      }

      // Validate dorm and room existence
      try {
        let dormToValidate: DormData | undefined;

        if (passedDormData && String(passedDormData.dormID) === dormId) {
          dormToValidate = passedDormData;
        } else {
          dormToValidate = await dormAPI.getDormById(dormId!);
        }

        if (!dormToValidate || !dormToValidate.dormID) {
          throw new Error('Dorm not found');
        }
        setFetchedDormId(dormToValidate.dormID);

        const roomExists = await roomAPI.roomExists(roomId);
        if (!roomExists) {
          throw new Error('Room not found');
        }
      } catch (apiError) {
        console.error('Error validating dorm and room:', apiError);
        throw new Error('Server connection error. Please try again');
      }

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      setLoadingState(prev => ({ ...prev, error: errorMessage }));
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });

      if (errorMessage.includes('login') || errorMessage.includes('logout')) {
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
      navigate(`/student-booking`);
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
       
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading information...</p>
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
        
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-lg font-medium">
                  {loadingState.error}
                </div>
                <Button onClick={() => navigate(-1)} variant="outline">
                  Go Back
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/dorms/${dormId}`)}
            className="text-gray-600 hover:text-green-500 flex items-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Apartment Details
          </button>
        </div>
        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <Card className="border-green-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Personal Information</h2>
                  {studentData ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Full Name:</span>
                        <span className="text-black">{`${studentData.firstName} ${studentData.lastName}`}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Email:</span>
                        <span className="text-black">{studentData.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Phone:</span>
                        <span className="text-black">{studentData.phone || 'Not available'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-black">Loading personal information...</div>
                  )}
                </CardContent>
              </Card>

              {/* Booking Details Section */}
              <Card className="border-green-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Booking Details</h2>
                  <div className="space-y-4">
                    {/* Duration Selection */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Rental Duration</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {[1, 2, 3, 4].map((months) => (
                                <Button
                                  key={months}
                                  type="button"
                                  variant={field.value === months ? "default" : "outline"}
                                  className={cn(
                                    "w-full border-green-200",
                                    field.value === months ? "bg-green-600 hover:bg-green-700 text-white" : "text-black hover:bg-green-50"
                                  )}
                                  onClick={() => field.onChange(months)}
                                  disabled={loadingState.isSubmitting}
                                >
                                  {months} {months === 1 ? 'Month' : 'Months'}
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary Section */}
              <Card className="border-green-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Booking Summary</h2>
                  <div className="space-y-2">
                    {/* Room Details */}
                    {roomDetails && (
                      <div className="flex justify-between">
                        <span className="text-black">Room Number:</span>
                        <span className="text-black">{roomDetails.roomNumber}</span>
                      </div>
                    )}
                    {/* Duration */}
                    <div className="flex justify-between">
                      <span className="text-black">Duration:</span>
                      <span className="text-black">
                        {form.watch('duration')} {form.watch('duration') === 1 ? 'Month' : 'Months'}
                      </span>
                    </div>
                    {/* Monthly Price */}
                    <div className="flex justify-between">
                      <span className="text-black">Monthly Price:</span>
                      <span className="text-black">{roomDetails?.price || 0} JD</span>
                    </div>
                    {/* Total Price */}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-green-100">
                      <span className="text-black">Total Price:</span>
                      <span className="text-black">{totalPrice} JD</span>
                    </div>
                    <p className="text-sm text-black mt-2">
                      * Price includes all utilities and services
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Error Message */}
              {loadingState.error && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="text-red-600 text-center">
                      {loadingState.error}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loadingState.isSubmitting || !!loadingState.error}
              >
                {loadingState.isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      
    </div>
  );
};

export default Booking;