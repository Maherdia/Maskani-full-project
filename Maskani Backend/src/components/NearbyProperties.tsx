import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getNearbyProperties } from '@/services/propertyService';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NearbyPropertiesProps {
  title?: string;
  maxProperties?: number;
}

const NearbyProperties = ({ 
  title = "Properties Near Your Location", 
  maxProperties = 3 
}: NearbyPropertiesProps) => {
  const { position, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchNearbyProperties() {
      if (!position) return;
      
      setLoading(true);
      try {
        const nearbyProps = await getNearbyProperties(
          position.latitude,
          position.longitude,
          10 // 10km radius
        );
        setProperties(nearbyProps.slice(0, maxProperties));
        setError(null);
      } catch (err) {
        setError('Failed to fetch nearby properties');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNearbyProperties();
  }, [position, maxProperties]);
  
  // Show location request UI if no position yet
  if (!position && !locationLoading && !locationError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <div className="text-center py-8">
          <Navigation className="h-12 w-12 text-maskani-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Find Housing Near You</h3>
          <p className="text-gray-600 mb-4">
            Allow location access to discover student housing options near your current location.
          </p>
          <Button 
            onClick={requestLocation}
            className="bg-maskani-primary hover:bg-maskani-primary/90 text-white"
          >
            <MapPin className="h-4 w-4 mr-2" /> 
            Use My Current Location
          </Button>
        </div>
      </div>
    );
  }
  
  // Show loading state
  if (locationLoading || loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (locationError || error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">
            {locationError || error || 'Failed to access your location'}
          </p>
          <Button 
            onClick={requestLocation}
            className="bg-maskani-primary hover:bg-maskani-primary/90 text-white"
          >
            <MapPin className="h-4 w-4 mr-2" /> 
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Show properties or empty state
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {position && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestLocation}
            className="text-xs flex items-center"
          >
            <Navigation className="h-3 w-3 mr-1" /> 
            Update Location
          </Button>
        )}
      </div>
      
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No properties found near your current location.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyProperties; 