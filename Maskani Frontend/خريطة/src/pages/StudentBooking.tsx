import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaUsers, FaClock, FaArrowRight } from 'react-icons/fa';
import { bookingAPI } from '@/lib/api';
import { dormAPI } from '@/lib/api/dorm';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import type { BookingData, DormData } from '@/lib/api/types';
import { Button } from '@/components/ui/button';

interface BookingStatus {
  status: 'pending' | 'accepted' | 'rejected';
  color: string;
  text: string;
}

// Helper function to get status style
const getStatusStyle = (status: string): BookingStatus => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        status: 'pending',
        color: 'bg-yellow-100 text-yellow-800',
        text: 'قيد الانتظار'
      };
    case 'accepted':
      return {
        status: 'accepted',
        color: 'bg-green-100 text-green-800',
        text: 'تمت الموافقة'
      };
    case 'rejected':
      return {
        status: 'rejected',
        color: 'bg-red-100 text-red-800',
        text: 'مرفوض'
      };
    default:
      return {
        status: 'pending',
        color: 'bg-gray-100 text-gray-800',
        text: 'غير معروف'
      };
  }
};

const StudentBooking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [dormDetails, setDormDetails] = useState<DormData | null>(null);

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!bookingId || isNaN(parseInt(bookingId))) {
        toast({
          title: 'خطأ',
          description: 'معرف الحجز غير صالح',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        // Fetch booking details
        const bookingData = await bookingAPI.getBookingById(parseInt(bookingId, 10));
        if (!bookingData) {
          throw new Error('لم يتم العثور على الحجز');
        }
        setBooking(bookingData);

        // Fetch dorm details
        const dorm = await dormAPI.getDormById(bookingData.dormID);
        setDormDetails(dorm);
      } catch (error) {
        console.error('خطأ في تحميل تفاصيل الحجز:', error);
        toast({
          title: 'خطأ',
          description: error instanceof Error ? error.message : 'فشل في تحميل تفاصيل الحجز',
          variant: 'destructive',
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingDetails();
  }, [bookingId, toast, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mr-2">جاري تحميل التفاصيل...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !dormDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">لم يتم العثور على تفاصيل الحجز</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(booking.status);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FaArrowRight />
              العودة للخلف
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white px-6 py-4">
              <h1 className="text-2xl font-bold">تفاصيل الحجز</h1>
              <p className="text-sm opacity-90">رقم الحجز: {booking.bookID}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">معلومات السكن</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{dormDetails.dormName}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>{dormDetails.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FaClock className="text-blue-600" />
                      <span>مدة الحجز: {booking.period} {booking.period === 1 ? 'شهر' : 'أشهر'}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      السعر الكلي: {booking.totalAmount} دينار
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusStyle.color}`}>
                      {statusStyle.text}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">تفاصيل الحجز</h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <FaCalendar className="text-blue-600" />
                        <span>تاريخ الحجز: {new Date(booking.bookingDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <FaUsers className="text-blue-600" />
                        <span>رقم الغرفة: {booking.roomID}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <FaUser className="text-blue-600" />
                        <span>اسم الطالب: {booking.studentName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">معلومات المالك</h2>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <FaUser className="text-blue-600" />
                        <span>{dormDetails.ownerName}</span>
                      </div>
                      {dormDetails.phone && (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FaPhone className="text-blue-600" />
                          <span>{dormDetails.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => navigate('/my-bookings')}
                >
                  عرض جميع حجوزاتي
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBooking; 