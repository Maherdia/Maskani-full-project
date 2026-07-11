import React from "react";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Property } from "@/types";
import { Link } from "react-router-dom";

// Fix Leaflet marker icon issues
delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;

// Create custom icons
const defaultIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyMapClientProps {
  properties: Property[];
  center?: LatLngExpression;
  zoom?: number;
  height?: string;
  dormId?: string;
  onMarkerDrag?: (lat: number, lng: number) => void;
  draggable?: boolean;
}

const PropertyMapClient: React.FC<PropertyMapClientProps> = ({ 
  properties, 
  center = [31.1829, 35.7046],
  zoom = 10,
  height = "600px",
  dormId,
  onMarkerDrag,
  draggable = false
}) => {
  useEffect(() => {
    console.log('PropertyMapClient - Props:', { properties, center, zoom, dormId });
  }, [properties, center, zoom, dormId]);

  if (!properties || properties.length === 0) {
    return (
      <div style={{ height, width: "100%" }} className="bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">لا توجد معلومات للموقع</p>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {properties.map((property) => (
          property.lat && property.lng && (
            <Marker 
              key={property.id} 
              position={[property.lat, property.lng]}
              icon={property.id === dormId ? highlightedIcon : defaultIcon}
              draggable={draggable}
              eventHandlers={
                draggable ? {
                  dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onMarkerDrag?.(position.lat, position.lng);
                  },
                } : {}
              }
            >
              <Popup>
                <div className={`flex flex-col ${property.id === dormId ? 'border-2 border-maskani-primary rounded-lg' : ''}`}>
                  <img 
                    src={property.image} 
                    alt={property.name} 
                    className="w-full h-28 object-cover rounded-t-md"
                  />
                  <div className="p-2">
                    <h3 className={`font-bold text-sm ${property.id === dormId ? 'text-maskani-primary' : ''}`}>
                      {property.name}
                    </h3>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-maskani-primary font-semibold">
                        {property.price} {property.currency}
                      </span>
                      <Link 
                        to={`/property/${property.id}`}
                        className="bg-maskani-primary text-white text-xs px-2 py-1 rounded hover:bg-maskani-primary/90"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMapClient;