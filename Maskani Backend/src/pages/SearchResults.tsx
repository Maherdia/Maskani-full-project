import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchFilter from '@/components/SearchFilter';
import type { SearchDormParams, DormData, PagedResult } from '@/lib/api/types';
import { dormAPI } from '@/lib/api/dorm';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DormData[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // استخراج المعايير الأولية من URL
  const initialFilters: SearchDormParams = {
    university: searchParams.get('university') || '',
    maxDistance: searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined,
    furnished: searchParams.get('furnished') ? searchParams.get('furnished') === 'true' : undefined,
    address: searchParams.get('address') || '',
    dormName: searchParams.get('dormName') || '',
  };

  // جلب النتائج عند تغيير الصفحة
  useEffect(() => {
    const fetchPagedResults = async () => {
      try {
        const pagedData = await dormAPI.getDormsPaged(pageIndex, pageSize);
        setResults(pagedData.data);
        setTotalResults(pagedData.data.length);
      } catch (error) {
        console.error('خطأ في جلب النتائج:', error);
      }
    };

    fetchPagedResults();
  }, [pageIndex, pageSize]);

  const handleSearch = async (filters: SearchDormParams) => {
    setLoading(true);
    try {
      let searchResults: DormData[] = [];

      // البحث باستخدام المعايير المختلفة
      if (filters.university) {
        const uniResults = await dormAPI.getDormsByUniversity(filters.university);
        searchResults = [...searchResults, ...uniResults];
      }

      if (filters.maxDistance !== undefined) {
        const distanceResults = await dormAPI.getDormsByDistance(filters.maxDistance);
        searchResults = [...searchResults, ...distanceResults];
      }

      if (filters.furnished !== undefined) {
        const furnishedResults = await dormAPI.getDormsByFurnishing(filters.furnished);
        searchResults = [...searchResults, ...furnishedResults];
      }

      if (filters.address) {
        const addressResults = await dormAPI.getDormsByAddress(filters.address);
        searchResults = [...searchResults, ...addressResults];
      }

      if (filters.dormName) {
        const dormNameResults = await dormAPI.searchDorms({ dormName: filters.dormName });
        searchResults = [...searchResults, ...dormNameResults];
      }

      // إزالة التكرارات
      const uniqueResults = Array.from(new Set(searchResults.map(r => r.dormID)))
        .map(id => searchResults.find(r => r.dormID === id));

      setResults(uniqueResults || []);
      setTotalResults(uniqueResults?.length || 0);

      // تحديث URL
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, value.toString());
        }
      });

      navigate(`/apartments?${searchParams.toString()}`);
    } catch (err) {
      console.error('خطأ في البحث:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">البحث عن سكن</h1>
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

      {loading ? (
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-green-600">جاري البحث...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-green-700">
              تم العثور على {totalResults} نتيجة
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                disabled={pageIndex === 0}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg disabled:opacity-50"
              >
                السابق
              </button>
              <button
                onClick={() => setPageIndex(prev => prev + 1)}
                disabled={results.length < pageSize}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((dorm) => (
              <div key={dorm.dormID} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">{dorm.dormName}</h3>
                <p className="text-gray-600 mb-2">{dorm.address}</p>
                <p className="text-gray-600 mb-2">المسافة: {dorm.distance} متر</p>
                <p className="text-gray-600">{dorm.furnishedOrNot ? 'مفروش' : 'غير مفروش'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 