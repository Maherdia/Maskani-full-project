import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/Navbar';

interface Booking {
  id: number;
  studentId: number;
  dormId: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

const OwnerBookings = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) return;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingAPI.getOwnerBookings(ownerId);
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch owner bookings.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [ownerId]);

  if (isLoading) {
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4"><p>Loading bookings...</p></div>
        </>
    );
  }

  if (error) {
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4"><p>{error}</p></div>
        </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dorm Bookings</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Dorm ID</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.studentId}</TableCell>
                    <TableCell>{booking.dormId}</TableCell>
                    <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default OwnerBookings; 