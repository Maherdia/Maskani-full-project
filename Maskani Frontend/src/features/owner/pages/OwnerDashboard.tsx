import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getDormsByOwnerId } from "../../dorms/api/dormApi";
import {
  getBookingsByOwnerId,
  confirmBooking,
  cancelBooking,
} from "../../bookings/api/bookingApi";
import { getDormImages, deleteDormImage } from "../../dorms/api/dormImageApi";
import type { DormData, DormImage } from "../../dorms/types/dorm.types";
import type { BookingData } from "../../bookings/types/booking.types";

export default function OwnerDashboard() {
  const auth = useAuth();
  const ownerID = auth.user?.ownerID;

  const [dorms, setDorms] = useState<DormData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [dormImages, setDormImages] = useState<Record<string, DormImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!ownerID) return;
    setLoading(true);
    try {
      const [dormData, bookingData] = await Promise.all([
        getDormsByOwnerId(ownerID),
        getBookingsByOwnerId(ownerID),
      ]);
      setDorms(dormData);
      setBookings(bookingData);

      const imageEntries = await Promise.all(
        dormData.map(async (dorm) => {
          const images = await getDormImages(dorm.dormID);
          return [dorm.dormID, images] as const;
        })
      );
      setDormImages(Object.fromEntries(imageEntries));
    } catch (err) {
      setError("Failed to load dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerID]);

  useEffect(() => {
    if (!ownerID) return;

    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [ownerID, loadData]);

  async function handleConfirm(id: number) {
    setActionError(null);
    try {
      await confirmBooking(id);
      await loadData();
    } catch (err) {
      setActionError("Failed to confirm booking.");
      console.error(err);
    }
  }

  async function handleCancel(id: number) {
    setActionError(null);
    try {
      await cancelBooking(id);
      await loadData();
    } catch (err) {
      setActionError("Failed to cancel booking.");
      console.error(err);
    }
  }

  async function handleImageDelete(dormId: string, imageId: number) {
    setActionError(null);
    try {
      await deleteDormImage(imageId);
      setDormImages((prev) => ({
        ...prev,
        [dormId]: (prev[dormId] || []).filter((img) => img.imageID !== imageId),
      }));
    } catch (err) {
      setActionError("Failed to delete image.");
      console.error(err);
    }
  }

  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>Owner Dashboard</h1>

      {actionError && <p style={{ color: "red" }}>{actionError}</p>}

      <h2 style={{ marginTop: "24px" }}>Your Dorms</h2>
      {dorms.length === 0 ? (
        <p>You haven't listed any dorms yet.</p>
      ) : (
        dorms.map((dorm) => (
          <div
            key={dorm.dormID}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <strong>{dorm.dormName}</strong> — {dorm.address}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {(dormImages[dorm.dormID] || []).length === 0 ? (
                <p style={{ fontSize: "13px", color: "#888", margin: "4px 0" }}>
                  No photos yet.
                </p>
              ) : (
                (dormImages[dorm.dormID] || []).map((image) => (
                  <div key={image.imageID} style={{ position: "relative" }}>
                    <img
                      src={image.imageUrl}
                      alt={dorm.dormName}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                    />
                    <button
                      onClick={() => handleImageDelete(dorm.dormID, image.imageID)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(0,0,0,0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}

      <h2 style={{ marginTop: "24px" }}>Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.bookID} style={{ marginBottom: "8px" }}>
              {booking.studentName} — {booking.dormName} (Room {booking.roomID}) —{" "}
              {booking.totalAmount} SAR — Status: {booking.status}
              {booking.status === "Pending" && (
                <>
                  {" "}
                  <button onClick={() => handleConfirm(booking.bookID)}>
                    Confirm
                  </button>{" "}
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