import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { dormAPI } from '../lib/api/dorm';
import { DormData, SearchDormParams } from '../lib/api/types';
import DormMap from '../components/DormMap';
import DormCard from '../components/DormCard';
import SearchFilter from '../components/SearchFilter';
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, X } from "lucide-react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Apartments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const isMobile = useIsMobile();

  const initialFilters = useMemo<SearchDormParams>(() => ({
    university: searchParams.get('university') || '',
    maxDistance: searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined,
    furnished: searchParams.get('furnished') ? searchParams.get('furnished') === 'true' : undefined,
    address: searchParams.get('address') || '',
    dormName: searchParams.get('dormName') || '',
  }), [searchParams]);

  const handleSearch = useCallback(async (filters: SearchDormParams) => {
    setLoading(true);
    try {
      const results = await dormAPI.searchDorms(filters);
      setDorms(results);

      const newSearchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newSearchParams.set(key, String(value));
        }
      });
      setSearchParams(newSearchParams);

    } catch (error) {
      console.error("Error fetching dorms:", error);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    handleSearch(initialFilters);
  }, [handleSearch, initialFilters]);

  return (
    <div className="min-h-screen bg-green-50/50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">سكنات الطلاب</h1>
          <p className="text-green-600">
            ابحث عن السكن المناسب بالقرب من جامعتك
          </p>
        </div>

        <div className="mb-8">
          <SearchFilter 
            onSearch={handleSearch} 
            isLoading={loading}
            initialFilters={initialFilters}
          />
        </div>

        {isMobile && (
          <Button
            onClick={() => setShowMap(!showMap)}
            variant="outline"
            className="mb-4 w-full flex items-center justify-center gap-2 bg-white border-2 border-green-100 text-green-700 hover:bg-green-50"
          >
            <MapPin className="h-4 w-4" />
            {showMap ? "عرض القائمة" : "عرض الخريطة"}
          </Button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 ${showMap && isMobile ? 'hidden' : 'block'}`}>
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  <p className="text-green-600">جاري تحميل السكنات...</p>
                </div>
              </div>
            ) : dorms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-green-600 mb-4">لم يتم العثور على سكنات تطابق معايير البحث.</p>
                <Button 
                  onClick={() => handleSearch({})} 
                  variant="outline"
                  className="text-green-600 border-2 border-green-100 hover:bg-green-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  مسح عوامل التصفية
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dorms.map((dorm) => (
                  <DormCard key={dorm.dormID} dorm={dorm} />
                ))}
              </div>
            )}
          </div>

          <div className={`${isMobile && !showMap ? 'hidden' : 'block'} h-[600px] lg:h-auto lg:sticky lg:top-6`}>
            <div className="bg-white rounded-xl shadow-lg p-4 h-full">
              <DormMap dorms={dorms} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Apartments;
