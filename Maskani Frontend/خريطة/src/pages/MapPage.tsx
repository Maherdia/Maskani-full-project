import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DormData } from '@/lib/api/types';
import { getDorms } from '@/services/dormService';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

// Default coordinates for Amman, Jordan
const DEFAULT_LAT = 31.9454;
const DEFAULT_LNG = 35.9284;

const MapPage = () => {
  const [properties, setProperties] = useState<DormData[]>([]);
  const { position, error, requestLocation, loading } = useGeolocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        if (position) {
          const nearby = await getDorms();
          setProperties(nearby);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [position]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={requestLocation} className="flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!position && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="mb-4">Please enable location services to view nearby properties</p>
        <Button onClick={requestLocation} className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Enable Location
        </Button>
      </div>
    );
  }

  // Calculate center coordinates
  const centerLat = position ? position.latitude : DEFAULT_LAT;
  const centerLng = position ? position.longitude : DEFAULT_LNG;

  return (
    <div className="h-screen w-full">
      {position ? (
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Current location marker */}
          <Marker position={[centerLat, centerLng]}>
            <Popup>
              Your Location
            </Popup>
          </Marker>

          {/* Property markers - For now, we'll place them in a circle around the center */}
          {properties.map((property, index) => {
            // Place markers in a circle around the center point
            const angle = (index / properties.length) * 2 * Math.PI;
            const radius = 0.01; // Approximately 1km
            const lat = centerLat + radius * Math.cos(angle);
            const lng = centerLng + radius * Math.sin(angle);

            return (
              <Marker
                key={property.dormID}
                position={[lat, lng]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{property.dormName}</h3>
                    <p className="text-sm text-gray-600">{property.address}</p>
                    <p className="text-sm text-gray-500">Distance: {property.distance}km</p>
                    <a
                      href={`/dorms/${property.dormID}`}
                      className="text-blue-500 hover:text-blue-700 text-sm mt-2 block"
                    >
                      View Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maskani-primary"></div>
        </div>
      )}
    </div>
  );
};

export default MapPage; 