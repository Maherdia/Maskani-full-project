import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDormById } from "../api/dormApi";
import { getDormImages } from "../api/dormImageApi";
import { getRoomsByDormId } from "../../rooms/api/roomApi";
import type { DormData, DormImage, RoomData } from "../types/dorm.types";

export default function DormDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [dorm, setDorm] = useState<DormData | null>(null);
  const [images, setImages] = useState<DormImage[]>([]);
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const [dormData, imageData, roomData] = await Promise.all([
          getDormById(id!),
          getDormImages(id!),
          getRoomsByDormId(id!),
        ]);

        setDorm(dormData);
        setImages(imageData);
        setRooms(roomData);
      } catch (err) {
        setError("Failed to load dorm details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;
  if (!dorm) return <p style={{ padding: "24px" }}>Dorm not found.</p>;

  return (
    <div style={{ padding: "24px" }}>
      <Link to="/">&larr; Back to map</Link>

      <h1 style={{ marginTop: "12px" }}>{dorm.dormName}</h1>
      <p>{dorm.address}</p>
      <p>University: {dorm.universityName}</p>
      <p>Distance: {dorm.distance} km</p>
      <p>Furnished: {dorm.furnishedOrNot ? "Yes" : "No"}</p>
      {dorm.ownerName && <p>Owner: {dorm.ownerName}</p>}
      {dorm.phone && <p>Phone: {dorm.phone}</p>}
      {dorm.email && <p>Email: {dorm.email}</p>}

      <h2 style={{ marginTop: "24px" }}>Photos</h2>
      {images.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {images.map((img) => (
            <img
              key={img.imageID}
              src={img.imageUrl}
              alt={dorm.dormName}
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
            />
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "24px" }}>Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms listed yet.</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.roomID}>
              Room {room.roomNumber} — {room.price} SAR — {room.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}