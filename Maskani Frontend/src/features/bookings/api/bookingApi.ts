import api from "../../../lib/api/apiClient";
import type { BookingData } from "../types/booking.types";

export async function getBookingsByOwnerId(ownerId: number): Promise<BookingData[]> {
  const response = await api.get<BookingData[]>(`/Booking/owner/${ownerId}`);
  return response.data;
}

export async function getBookingsByStudentId(studentId: number): Promise<BookingData[]> {
  const response = await api.get<BookingData[]>(`/Booking/student/${studentId}`);
  return response.data;
}

export async function confirmBooking(id: number): Promise<void> {
  await api.put(`/Booking/${id}/confirm`);
}

export async function cancelBooking(id: number): Promise<void> {
  await api.put(`/Booking/${id}/cancel`);
}