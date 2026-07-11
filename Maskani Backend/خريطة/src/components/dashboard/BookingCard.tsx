import React from 'react';
import { Button } from "@/components/ui/button";

export interface BookingRequest {
    id: string;
    dormId: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    fullName: string;
    email: string;
    phoneNumber: string;
    duration: number;
    numberOfGuests: number;
    totalPrice: number;
    createdAt: string;
}

interface BookingCardProps {
  booking: BookingRequest;
  onAction: (bookingId: string, action: 'approve' | 'reject') => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onAction }) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{booking.fullName}</h3>
          <p className="text-sm text-gray-600">البريد الإلكتروني: {booking.email}</p>
          <p className="text-sm text-gray-600">رقم الهاتف: {booking.phoneNumber}</p>
          <p className="text-sm text-gray-600">المدة: {booking.duration} أشهر</p>
          <p className="text-sm text-gray-600">عدد الضيوف: {booking.numberOfGuests}</p>
          <p className="text-sm text-gray-600">السعر الإجمالي: ${booking.totalPrice}</p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-2 ${
            booking.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : booking.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            الحالة: {booking.status === 'pending' ? 'قيد الانتظار' :
                    booking.status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}
          </span>
        </div>
        {booking.status === 'pending' && (
          <div className="space-x-2">
            <Button
              onClick={() => onAction(booking.id, 'approve')}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              موافقة
            </Button>
            <Button
              onClick={() => onAction(booking.id, 'reject')}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              رفض
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard; 