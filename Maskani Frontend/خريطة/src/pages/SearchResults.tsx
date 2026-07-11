import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchFilter from '@/components/SearchFilter';
import type { SearchDormParams } from '@/lib/api/types';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // استخراج المعايير الأولية من URL
  const initialFilters: SearchDormParams = {
    university: searchParams.get('university') || '',
    maxDistance: searchParams.get('maxDistance') ? Number(searchParams.get('maxDistance')) : undefined,
    furnished: searchParams.get('furnished') ? searchParams.get('furnished') === 'true' : undefined,
    address: searchParams.get('address') || '',
    dormName: searchParams.get('dormName') || '',
  };

  const handleSearch = async (filters: SearchDormParams) => {
    setLoading(true);
    try {
      // تحويل المعايير إلى معلمات URL
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, value.toString());
        }
      });

      // التوجيه إلى صفحة Apartments مع معايير البحث
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

      {loading && (
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-4">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-green-600">جاري البحث...</p>
          </div>
        </div>
      )}
    </div>
  );
} 