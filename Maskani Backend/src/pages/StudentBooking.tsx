import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import type { BookingData } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { storageService } from '@/lib/services/storage';
import Footer from '@/components/Footer';

const StudentBooking: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    const loadStudentBookings = async () => {
      // Check login status
      if (!storageService.hasActiveSession()) {
        toast({
          title: 'Alert',
          description: 'Please login first',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Get student ID
      const studentId = storageService.getStudentId();
      if (!studentId) {
        toast({
          title: 'Error',
          description: 'Student ID not found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching bookings for student:', studentId);
        const response = await bookingAPI.getStudentBookings(studentId);
        console.log('Student bookings received:', response);
        setBookings(response);
      } catch (error) {
        console.error('Error loading student bookings:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load bookings',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentBookings();
  }, [toast, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Loading bookings...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
          
          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <p className="text-gray-500">You don't have any bookings yet</p>
              <Button
                onClick={() => navigate('/apartments')}
                className="mt-4"
              >
                Explore Available Apartments
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.bookID} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-green-600 text-white px-6 py-3">
                    <p className="text-sm opacity-90">Booking ID: {booking.bookID}</p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold">Room Number:</span>
                        <span className="ml-2">{booking.roomID}</span>
                      </div>
                      
                      <div>
                        <span className="font-semibold">Booking Date:</span>
                        <span className="ml-2">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US')}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold">Duration:</span>
                        <span className="ml-2">
                          {booking.period} {booking.period === 1 ? 'month' : 'months'}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'pending' ? 'Pending' :
                           booking.status === 'confirmed' ? 'Confirmed' :
                           booking.status === 'cancelled' ? 'Cancelled' :
                           booking.status}
                        </span>
                      </div>

                      {booking.totalAmount && (
                        <div>
                          <span className="font-semibold">Total Price:</span>
                          <span className="ml-2">{booking.totalAmount} JD</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentBooking; 