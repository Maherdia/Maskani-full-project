import { useEffect, useState } from "react";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { universityService } from "@/lib/api/universityService";
import { UniversityDTO } from "@/lib/api/types";

interface UniversityComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function UniversityCombobox({
  value,
  onValueChange,
  placeholder = "Select University",
  className
}: UniversityComboboxProps) {
  const [universities, setUniversities] = useState<ComboboxOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const data = await universityService.getAllUniversities();
        const options: ComboboxOption[] = data.map((university: UniversityDTO) => ({
          value: university.id.toString(),
          label: university.name
        }));
        setUniversities(options);
      } catch (error) {
        console.error("Failed to load universities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUniversities();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md">
        <span className="sr-only">Loading universities...</span>
      </div>
    );
  }

  return (
    <Combobox
      options={universities}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      className={className}
      emptyText="No universities found"
    />
  );
}

export default UniversityCombobox;
