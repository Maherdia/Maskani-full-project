import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

interface BookingStatus {
  status: 'pending' | 'accepted' | 'rejected';
  color: string;
  text: string;
}

const getStatusStyle = (status: string): BookingStatus => {
  switch (status) {
    case 'accepted':
      return { status: 'accepted', color: 'bg-green-100 text-green-800', text: 'مقبول' };
    case 'rejected':
      return { status: 'rejected', color: 'bg-red-100 text-red-800', text: 'مرفوض' };
    default:
      return { status: 'pending', color: 'bg-yellow-100 text-yellow-800', text: 'قيد الانتظار' };
  }
};

const StudentBooking: React.FC = () => {
  // Example booking data - replace with actual data from your backend
  const booking = {
    property: {
      name: 'شقة الطالب المميزة',
      image: 'https://example.com/property-image.jpg',
      location: 'شارع الجامعة، المدينة الجامعية',
      duration: '3 أشهر',
      guests: 2,
      totalPrice: 3000,
      status: 'pending',
    },
    owner: {
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966 50 123 4567',
    },
    details: {
      requestDate: '2024-03-15',
      ownerNotes: 'الشقة متاحة للسكن من بداية الشهر القادم',
    },
  };

  const statusStyle = getStatusStyle(booking.property.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">تفاصيل الحجز</h1>
          </div>

          {/* Property Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">معلومات العقار</h2>
                
                {/* Property Image */}
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={booking.property.image}
                    alt={booking.property.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Property Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{booking.property.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{booking.property.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaClock className="text-blue-600" />
                    <span>مدة الحجز: {booking.property.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaUsers className="text-blue-600" />
                    <span>عدد الضيوف: {booking.property.guests}</span>
                  </div>
                  <div className="text-lg font-semibold">
                    السعر الكلي: {booking.property.totalPrice} ريال
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusStyle.color}`}>
                    {statusStyle.text}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">معلومات المالك</h2>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaUser className="text-blue-600" />
                    <span>{booking.owner.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaEnvelope className="text-blue-600" />
                    <span>{booking.owner.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaPhone className="text-blue-600" />
                    <span>{booking.owner.phone}</span>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">تفاصيل إضافية</h2>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <FaCalendar className="text-blue-600" />
                      <span>تاريخ الطلب: {booking.details.requestDate}</span>
                    </div>
                    {booking.details.ownerNotes && (
                      <div className="mt-2">
                        <p className="font-semibold">ملاحظات المالك:</p>
                        <p className="text-gray-600">{booking.details.ownerNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.history.back()}
              >
                العودة
              </button>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => {/* Add contact owner logic */}}
              >
                تواصل مع المالك
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentBooking; 