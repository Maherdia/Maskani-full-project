import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getBookingsByStudentId, cancelBooking } from "../../bookings/api/bookingApi";
import type { BookingData } from "../../bookings/types/booking.types";

export default function StudentDashboard() {
  const auth = useAuth();
  const studentID = auth.user?.studentID;

  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!studentID) return;
    setLoading(true);
    try {
      const data = await getBookingsByStudentId(studentID);
      setBookings(data);
    } catch (err) {
      setError("Failed to load your bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [studentID]);

  useEffect(() => {
    if (!studentID) return;

    const timeoutId = window.setTimeout(() => {
      void loadBookings();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [studentID, loadBookings]);

  async function handleCancel(id: number) {
    setActionError(null);
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      setActionError("Failed to cancel booking.");
      console.error(err);
    }
  }

  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Student Dashboard</h1>

      <h2 style={{ marginTop: "24px" }}>Your Bookings</h2>
      {actionError && <p style={{ color: "red" }}>{actionError}</p>}
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.bookID} style={{ marginBottom: "8px" }}>
              {booking.dormName} (Room {booking.roomID}) — {booking.totalAmount} SAR
              — Status: {booking.status}
              {booking.status !== "Cancelled" && (
                <>
                  {" "}
                  <button onClick={() => handleCancel(booking.bookID)}>
                    Cancel
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}