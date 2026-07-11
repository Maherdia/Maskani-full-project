import { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/use-geolocation';
import { DormData } from '@/lib/api/types';
import { dormAPI } from '@/lib/api/dorm';
import DormCard from '@/components/DormCard';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NearbyDormsProps {
  title?: string;
  maxDorms?: number;
}

const NearbyDorms = ({ 
  title = "السكنات القريبة من موقعك", 
  maxDorms = 3 
}: NearbyDormsProps) => {
  const { position, loading: locationLoading, error: locationError, requestLocation } = useGeolocation();
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchNearbyDorms() {
      if (!position) return;
      
      setLoading(true);
      try {
        // Get dorms within 10km radius
        const nearbyDorms = await dormAPI.searchDorms({
          maxDistance: 10
        });
        setDorms(nearbyDorms.slice(0, maxDorms));
        setError(null);
      } catch (err) {
        setError('فشل في جلب السكنات القريبة');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNearbyDorms();
  }, [position, maxDorms]);
  
  // Show location request UI if no position yet
  if (!position && !locationLoading && !locationError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <div className="text-center py-8">
          <Navigation className="h-12 w-12 text-maskani-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">ابحث عن السكنات القريبة منك</h3>
          <p className="text-gray-600 mb-4">
            اسمح بالوصول إلى موقعك لاكتشاف خيارات السكن الطلابي القريبة من موقعك الحالي.
          </p>
          <Button 
            onClick={requestLocation}
            className="bg-maskani-primary hover:bg-maskani-primary/90 text-white"
          >
            <MapPin className="h-4 w-4 ml-2" /> 
            استخدم موقعي الحالي
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
            {locationError || error || 'فشل في الوصول إلى موقعك'}
          </p>
          <Button 
            onClick={requestLocation}
            className="bg-maskani-primary hover:bg-maskani-primary/90 text-white"
          >
            <MapPin className="h-4 w-4 ml-2" /> 
            حاول مرة أخرى
          </Button>
        </div>
      </div>
    );
  }
  
  // Show dorms or empty state
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
            <Navigation className="h-3 w-3 ml-1" /> 
            تحديث الموقع
          </Button>
        )}
      </div>
      
      {dorms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dorms.map(dorm => (
            <DormCard key={dorm.dormID} dorm={dorm} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            لم يتم العثور على سكنات قريبة من موقعك الحالي.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyDorms; 