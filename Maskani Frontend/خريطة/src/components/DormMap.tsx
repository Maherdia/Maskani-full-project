import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { DormData } from '../lib/api/types';

interface DormMapProps {
  selectedDormId?: string;
  dorms: DormData[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  borderRadius: '0.75rem'
};

const center = {
  lat: 31.9539,  // Jordan's approximate center
  lng: 35.9106
};

const DormMap: React.FC<DormMapProps> = ({ selectedDormId, dorms }) => {
  const [selectedDorm, setSelectedDorm] = useState<DormData | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-white rounded-xl border-2 border-green-100">
        <p className="text-green-600 text-center px-4">
          يرجى تكوين مفتاح Google Maps API للوصول إلى الخريطة
        </p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-white rounded-xl border-2 border-green-100">
        <p className="text-green-600 text-center px-4">{mapError}</p>
      </div>
    );
  }

  // Helper function to parse coordinates from address string
  const parseCoordinates = (address: string) => {
    try {
      const [lat, lng] = address.split(',').map(coord => parseFloat(coord.trim()));
      if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid coordinates');
      }
      return { lat, lng };
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return center; // Fall back to default center
    }
  };

  // Calculate map center based on selected dorm or average of all dorms
  const mapCenter = selectedDorm ? 
    parseCoordinates(selectedDorm.address) : 
    dorms.length > 0 ? {
      lat: dorms.reduce((sum, dorm) => {
        const coords = parseCoordinates(dorm.address);
        return sum + coords.lat;
      }, 0) / dorms.length,
      lng: dorms.reduce((sum, dorm) => {
        const coords = parseCoordinates(dorm.address);
        return sum + coords.lng;
      }, 0) / dorms.length
    } : center;

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-full">
        {!selectedDormId && (
          <h2 className="text-xl font-semibold text-green-800 mb-4">مواقع السكنات</h2>
        )}
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={selectedDorm ? 15 : dorms.length > 0 ? 13 : 10}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [
              {
                featureType: "all",
                elementType: "labels.text",
                stylers: [{ color: "#444444" }]
              },
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ]
          }}
        >
          {dorms.map((dorm) => {
            const position = parseCoordinates(dorm.address);
            return (
              <Marker
                key={dorm.dormID}
                position={position}
                onClick={() => setSelectedDorm(dorm)}
                icon={{
                  url: '/marker-home.png',
                  scaledSize: new window.google.maps.Size(32, 32)
                }}
              />
            );
          })}

          {selectedDorm && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedDorm.address.split(',')[0]),
                lng: parseFloat(selectedDorm.address.split(',')[1])
              }}
              onCloseClick={() => setSelectedDorm(null)}
            >
              <div className="p-2">
                <h3 className="font-bold text-green-800 mb-2">{selectedDorm.dormName}</h3>
                <p className="text-sm text-green-600 mb-1">الجامعة: {selectedDorm.universityName}</p>
                <p className="text-sm text-green-600 mb-1">المسافة: {selectedDorm.distance} كم</p>
                <p className="text-sm text-green-600 mb-1">
                  {selectedDorm.furnishedOrNot ? 'مفروش' : 'غير مفروش'}
                </p>
                {selectedDorm.phone && (
                  <p className="text-sm text-green-600">
                    للتواصل: {selectedDorm.phone}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default DormMap; 