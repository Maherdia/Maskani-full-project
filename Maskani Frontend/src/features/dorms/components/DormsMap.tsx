import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DormData } from "../types/dorm.types";

// Leaflet's default marker icons don't load correctly with bundlers like Vite
// unless we explicitly point them at the package's own asset URLs.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RIYADH_CENTER: [number, number] = [24.7136, 46.6753];

interface DormsMapProps {
  dorms: DormData[];
  height?: string;
  zoom?: number;
}

export default function DormsMap({ dorms, height = "500px", zoom = 12 }: DormsMapProps) {
  const navigate = useNavigate();

  const dormsWithCoords = dorms.filter(
    (d) => d.latitude !== null && d.longitude !== null
  );

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={RIYADH_CENTER}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {dormsWithCoords.map((dorm) => (
          <Marker key={dorm.dormID} position={[dorm.latitude!, dorm.longitude!]}>
            <Popup>
              <div style={{ minWidth: "150px" }}>
                <strong>{dorm.dormName}</strong>
                <p style={{ margin: "4px 0" }}>{dorm.address}</p>
                <button
                  onClick={() => {
                    console.log("View Details clicked, dormID:", dorm.dormID);
                    navigate(`/dorms/${dorm.dormID}`);
                  }}
                  style={{
                    background: "#0f766e",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}