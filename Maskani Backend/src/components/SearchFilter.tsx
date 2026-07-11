import { useState, useEffect, useCallback } from "react";
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
import { SearchDormParams, UniversityDTO, DormData } from "@/lib/api/types";
import { dormAPI } from "@/lib/api/dorm";
import { universityService } from "@/lib/api/universityService";
import { motion, AnimatePresence } from "framer-motion";

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
  const [searchResults, setSearchResults] = useState<DormData[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

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

  const performSearch = useCallback(async (currentFilters: SearchDormParams) => {
    try {
      setSearchError(null);
      // Clean filters
      const cleanFilters: SearchDormParams = {
        university: currentFilters.university || undefined,
        maxDistance: typeof currentFilters.maxDistance === 'number' && currentFilters.maxDistance > 0 ? currentFilters.maxDistance : undefined,
        furnished: typeof currentFilters.furnished === 'boolean' ? currentFilters.furnished : undefined,
        address: currentFilters.address?.trim() || undefined,
        dormName: currentFilters.dormName?.trim() || undefined,
      };

      Object.keys(cleanFilters).forEach(key => {
        const filterKey = key as keyof SearchDormParams;
        if (cleanFilters[filterKey] === undefined) {
          delete cleanFilters[filterKey];
        }
      });

      const results = await dormAPI.searchDorms(cleanFilters);

      // No local filtering here — assume backend handles all filters
      setSearchResults(results);
      onSearch(cleanFilters);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching. Please try again.');
      return [];
    }
  }, [onSearch]);

  // Remove the debounced useEffect here (no auto search on dormName change)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(filters);
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
    setSearchResults([]);
    setSearchError(null);
    onSearch(emptyFilters);
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-lg p-8 transition-all duration-300",
      "hover:shadow-xl border border-gray-200",
      className
    )}>
      <form onSubmit={handleSearch} className="space-y-8">
        {/* Main Search Bar */}
        <div className="relative group">
          <Input
            type="text"
            placeholder="Search for dorm name..."
            value={filters.dormName || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, dormName: e.target.value }))}
            className={cn(
              "w-full pl-12 pr-4 h-14 text-lg",
              "border-2 border-gray-300 focus:border-green-500 rounded-xl",
              "transition-all duration-300",
              "placeholder:text-gray-500 focus:ring-2 focus:ring-green-100",
              "group-hover:border-gray-400 text-black font-medium"
            )}
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 h-6 w-6 transition-colors group-hover:text-green-600" />
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="text-red-500 text-sm font-medium">{searchError}</div>
        )}

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-6">
          <Select
            value={filters.university || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, university: value }))}
            disabled={isLoading}
          >
            <SelectTrigger className={cn(
              "w-full md:w-[250px] h-12",
              "border-2 border-gray-300 focus:border-green-500 rounded-xl",
              "transition-all duration-300 hover:border-gray-400",
              "focus:ring-2 focus:ring-green-100 text-black font-medium"
            )}>
              <SelectValue placeholder="Select University" />
            </SelectTrigger>
            <SelectContent className="border-2 border-gray-200 rounded-lg">
              <SelectGroup>
                {universities.map((uni) => (
                  <SelectItem key={uni.id} value={uni.name} className="hover:bg-green-50 transition-colors text-black">
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
            placeholder="Max Distance (m)"
            value={filters.maxDistance || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setFilters(prev => ({ ...prev, maxDistance: value }));
            }}
            className={cn(
              "w-full md:w-[200px] h-12",
              "border-2 border-gray-300 focus:border-green-500 rounded-xl",
              "transition-all duration-300 hover:border-gray-400",
              "focus:ring-2 focus:ring-green-100 text-black font-medium"
            )}
            disabled={isLoading}
          />

          <Select
            value={filters.furnished?.toString() || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, furnished: value === 'true' }))}
            disabled={isLoading}
          >
            <SelectTrigger className={cn(
              "w-full md:w-[200px] h-12",
              "border-2 border-gray-300 focus:border-green-500 rounded-xl",
              "transition-all duration-300 hover:border-gray-400",
              "focus:ring-2 focus:ring-green-100 text-black font-medium"
            )}>
              <SelectValue placeholder="Furnished Status" />
            </SelectTrigger>
            <SelectContent className="border-2 border-gray-200 rounded-lg">
              <SelectGroup>
                <SelectItem value="true" className="hover:bg-green-50 transition-colors text-black">Furnished</SelectItem>
                <SelectItem value="false" className="hover:bg-green-50 transition-colors text-black">Unfurnished</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t-2 border-gray-200">
                <div className="space-y-6">
                  <div>
                    <Label className="text-black mb-3 block text-lg font-bold">Address</Label>
                    <Input
                      type="text"
                      placeholder="Enter address..."
                      value={filters.address || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
                      className={cn(
                        "w-full h-12",
                        "border-2 border-gray-300 focus:border-green-500 rounded-xl",
                        "transition-all duration-300 hover:border-gray-400",
                        "focus:ring-2 focus:ring-green-100 text-black font-medium"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setExpanded(!expanded)}
              className={cn(
                "flex items-center gap-2 h-12 px-6",
                "text-black border-2 border-gray-300",
                "hover:bg-green-50 hover:border-green-400 transition-all duration-300",
                "focus:ring-2 focus:ring-green-100 font-medium"
              )}
              disabled={isLoading}
            >
              <Sliders className="h-5 w-5" />
              {expanded ? "Less Options" : "More Options"}
            </Button>

            {Object.values(filters).some(value => value !== "" && value !== undefined) && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                className={cn(
                  "flex items-center gap-2 h-12",
                  "text-black hover:bg-green-50",
                  "transition-all duration-300 font-medium"
                )}
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
                Clear Filters
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className={cn(
              "bg-green-600 hover:bg-green-700 text-white",
              "min-w-[140px] h-12 px-8",
              "flex items-center gap-3 text-lg font-medium",
              "transition-all duration-300 transform hover:scale-105",
              "focus:ring-4 focus:ring-green-200"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Search
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;
