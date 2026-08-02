import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDormImages } from "../api/dormImageApi";
import type { DormData } from "../types/dorm.types";

interface DormCardProps {
  dorm: DormData;
}

export default function DormCard({ dorm }: DormCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getDormImages(dorm.dormID)
      .then((images) => {
        if (!cancelled && images.length > 0) {
          setThumbnailUrl(images[0].imageUrl);
        }
      })
      .catch((err) => console.error("Failed to load dorm thumbnail:", err));

    return () => {
      cancelled = true;
    };
  }, [dorm.dormID]);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
        display: "flex",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "90px",
          flexShrink: 0,
          borderRadius: "6px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={dorm.dormName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "12px", color: "#999" }}>No photo</span>
        )}
      </div>

      <div>
        <h3 style={{ margin: "0 0 8px 0" }}>{dorm.dormName}</h3>
        <p style={{ margin: "4px 0" }}>{dorm.address}</p>
        <p style={{ margin: "4px 0" }}>University: {dorm.universityName}</p>
        <p style={{ margin: "4px 0" }}>Distance: {dorm.distance} km</p>
        <p style={{ margin: "4px 0" }}>
          {dorm.furnishedOrNot ? "Furnished" : "Unfurnished"}
        </p>
        <Link to={`/dorms/${dorm.dormID}`}>View Details</Link>
      </div>
    </div>
  );
}