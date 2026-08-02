import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RIYADH_CENTER: [number, number] = [24.7136, 46.6753];

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LocationPickerProps {
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  function handlePick(lat: number, lng: number) {
    setPosition([lat, lng]);
    onChange(lat, lng);
  }

  return (
    <div>
      <p style={{ fontSize: "14px", color: "#555" }}>
        Click on the map to drop a pin at your dorm's exact location.
      </p>
      <div style={{ height: "350px", width: "100%" }}>
        <MapContainer center={RIYADH_CENTER} zoom={11} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={handlePick} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      {position && (
        <p style={{ fontSize: "13px", color: "#333" }}>
          Selected: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      )}
    </div>
  );
}