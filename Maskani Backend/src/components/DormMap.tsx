import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DormData } from '../lib/api/types';
import { useNavigate } from 'react-router-dom';
import { dormAPI } from '../lib/api/dorm';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  className: 'marker-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper function to parse dormId as coordinates
const parseDormIdAsCoords = (dormId: string): [number, number] | null => {
  try {
    const [lat, lng] = dormId.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return null;
  } catch {
    return null;
  }
};

interface DormMapProps {
  selectedDormId?: string;
  onMarkerMove?: (newPosition: { lat: number; lng: number }) => void;
  dorms?: DormData[];
}

const DormMap: React.FC<DormMapProps> = ({ selectedDormId, onMarkerMove, dorms }) => {
  const [selectedDorm, setSelectedDorm] = useState<DormData | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Helper function to parse coordinates from address string
  const parseCoordinates = useCallback((address: string): [number, number] => {
    try {
      // First, check if the address itself is a coordinate pair
      const coordsPattern = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
      const coordsMatch = address.match(coordsPattern);
      
      if (coordsMatch) {
        const lat = parseFloat(coordsMatch[1]);
        const lng = parseFloat(coordsMatch[3]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }

      // If not direct coordinates, try splitting by comma and handle potential spaces
      const parts = address.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }

      console.warn('Invalid coordinates format:', address);
      return [31.9539, 35.9106]; // Default to Jordan's center
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return [31.9539, 35.9106]; // Default to Jordan's center
    }
  }, []);

  // Function to update marker position and popup
  const updateMarkerPosition = useCallback(async (dormId: string) => {
    try {
      if (!mapRef.current || !markerRef.current) return;

      // Check if dormId is actually coordinates
      const coords = parseDormIdAsCoords(dormId);
      if (coords) {
        const [lat, lng] = coords;
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], 16);
        return;
      }

      const dormData = await dormAPI.getDormById(dormId);
      if (dormData) {
        setSelectedDorm(dormData);
        const position = parseCoordinates(dormData.address);
        
        // Update marker position
        markerRef.current.setLatLng(position);
        
        // Update popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-2';
        popupContent.innerHTML = `
          <h3 class="font-bold text-gray-900 mb-2">${dormData.dormName}</h3>
          <p class="text-sm text-gray-700 mb-1">الجامعة: ${dormData.universityName}</p>
          <p class="text-sm text-gray-700 mb-1">المسافة: ${dormData.distance} كم</p>
          <p class="text-sm text-gray-700 mb-1">${dormData.furnishedOrNot ? 'مفروش' : 'غير مفروش'}</p>
          ${dormData.phone ? `<p class="text-sm text-gray-700">للتواصل: ${dormData.phone}</p>` : ''}
        `;

        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.className = 'mt-2 bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors w-full';
        viewDetailsButton.textContent = 'عرض التفاصيل';
        viewDetailsButton.onclick = (e) => {
          e.preventDefault();
          navigate(`/dorms/${dormData.dormID}`);
        };
        popupContent.appendChild(viewDetailsButton);

        markerRef.current.bindPopup(popupContent);
        markerRef.current.openPopup();
        
        // Center map on the marker
        mapRef.current.setView(position, 16);
      }
    } catch (error) {
      console.error('Error updating marker position:', error);
    }
  }, [navigate, parseCoordinates]);

  // Effect to handle selectedDormId changes
  useEffect(() => {
    if (selectedDormId) {
      updateMarkerPosition(selectedDormId);
    }
  }, [selectedDormId, updateMarkerPosition]);

  // Initialize map and marker
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [31.9539, 35.9106], // Default center (Jordan)
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true
    });
    
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Create a single marker
    const marker = L.marker([31.9539, 35.9106], {
      icon: DefaultIcon,
      draggable: false // Set to true if you want the marker to be draggable
    }).addTo(map);

    markerRef.current = marker;

    // Optional: Handle marker drag events if marker is draggable
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onMarkerMove?.({ lat: position.lat, lng: position.lng });
    });

    // If we have a selectedDormId on init, update the marker position
    if (selectedDormId) {
      updateMarkerPosition(selectedDormId);
    }

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [selectedDormId, updateMarkerPosition, onMarkerMove]);

  return (
    <div className="h-full">
      {!selectedDormId && (
        <h2 className="text-xl font-semibold text-black-800 mb-4">Housing Locations</h2>
      )}
      <div 
        ref={mapContainerRef} 
        className="h-full min-h-[400px] rounded-xl"
        style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '0.75rem' }}
      />
    </div>
  );
};

export default DormMap; 