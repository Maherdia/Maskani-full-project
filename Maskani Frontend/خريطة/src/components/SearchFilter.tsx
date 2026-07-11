import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Sliders, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchDormParams, UniversityDTO } from "@/lib/api/types";
import { dormAPI } from "@/lib/api/dorm";
import { universityService } from "@/lib/api/universityService";

interface SearchFilterProps {
  onSearch: (filters: SearchDormParams) => void;
  className?: string;
  isLoading?: boolean;
  initialFilters?: SearchDormParams;
}

const SearchFilter = ({ onSearch, className, isLoading = false, initialFilters }: SearchFilterProps) => {
  const [expanded, setExpanded] = useState(false);
  const [universities, setUniversities] = useState<UniversityDTO[]>([]);
  const [filters, setFilters] = useState<SearchDormParams>(initialFilters || {
    university: "",
    maxDistance: undefined,
    furnished: undefined,
    address: "",
    dormName: "",
  });

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universityService.getAllUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // تنظيف وتحقق من صحة المعايير
      const cleanFilters: SearchDormParams = {
        university: filters.university || undefined,
        maxDistance: typeof filters.maxDistance === 'number' && !isNaN(filters.maxDistance) 
          ? Math.max(0, filters.maxDistance) 
          : undefined,
        furnished: typeof filters.furnished === 'boolean' 
          ? filters.furnished 
          : undefined,
        address: filters.address || undefined,
        dormName: filters.dormName || undefined
      };

      // إزالة الحقول الفارغة
      Object.keys(cleanFilters).forEach(key => {
        if (cleanFilters[key as keyof SearchDormParams] === undefined || 
            cleanFilters[key as keyof SearchDormParams] === '') {
          delete cleanFilters[key as keyof SearchDormParams];
        }
      });

      onSearch(cleanFilters);
    } catch (error) {
      console.error('خطأ في معالجة معايير البحث:', error);
    }
  };

  const resetFilters = () => {
    const emptyFilters: SearchDormParams = {
      university: "",
      maxDistance: undefined,
      furnished: undefined,
      address: "",
      dormName: "",
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-lg p-6", className)}>
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Main Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="ابحث عن اسم السكن..."
            value={filters.dormName || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dormName: e.target.value }))}
            className="w-full pl-12 pr-4 h-12 text-lg border-2 border-green-100 focus:border-green-500 rounded-xl"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-4">
          <Select
            value={filters.university || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, university: value }))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full md:w-[200px] border-2 border-green-100 focus:border-green-500 rounded-xl">
              <SelectValue placeholder="اختر الجامعة" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.name}>
                    {uni.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="number"
            min="0"
            step="0.1"
            placeholder="أقصى مسافة (كم)"
            value={filters.maxDistance || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setFilters(prev => ({ ...prev, maxDistance: value }));
            }}
            className="w-full md:w-[150px] border-2 border-green-100 focus:border-green-500 rounded-xl"
            disabled={isLoading}
          />

          <Select
            value={filters.furnished?.toString() || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, furnished: value === 'true' }))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full md:w-[150px] border-2 border-green-100 focus:border-green-500 rounded-xl">
              <SelectValue placeholder="مفروش/غير مفروش" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="true">مفروش</SelectItem>
                <SelectItem value="false">غير مفروش</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        {expanded && (
          <div className="pt-4 border-t border-green-100">
            <div className="space-y-4">
              <div>
                <Label className="text-green-700 mb-2 block">العنوان</Label>
                <Input
                  type="text"
                  placeholder="ادخل العنوان..."
                  value={filters.address || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full border-2 border-green-100 focus:border-green-500 rounded-xl"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-green-600 border-2 border-green-100 hover:bg-green-50"
              disabled={isLoading}
            >
              <Sliders className="h-4 w-4" />
              {expanded ? "خيارات أقل" : "خيارات أكثر"}
            </Button>

            {Object.values(filters).some(value => value !== "" && value !== undefined) && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                className="flex items-center gap-2 text-green-600 hover:bg-green-50"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                مسح الفلاتر
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px] flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري البحث...
              </>
            ) : (
              'بحث'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;
