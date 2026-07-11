import { useEffect, useState, ReactNode } from "react";
import { Property } from "@/types";

type PropertyMapProps = {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  dormId?: string;
};

// This is a placeholder component that will be replaced with the actual map on the client side
export const PropertyMap = ({ 
  properties, 
  center = [31.1829, 35.7046], // Default to Jordan
  zoom = 10,
  height = "600px",
  dormId
}: PropertyMapProps) => {
  const [isClient, setIsClient] = useState(false);
  const [MapComponent, setMapComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Import the client-only component
      import('./PropertyMapClient').then(module => {
        const ClientMap = module.default;
        setMapComponent(
          <ClientMap 
            properties={properties} 
            center={center} 
            zoom={zoom} 
            height={height}
            dormId={dormId}
          />
        );
      }).catch(error => {
        console.error("Failed to load map component:", error);
      });
    }
  }, [isClient, properties, center, zoom, height, dormId]);

  // Display loading state until client-side code is ready
  if (!isClient || !MapComponent) {
    return (
      <div 
        style={{ height, width: "100%" }} 
        className="bg-gray-100 rounded-lg overflow-hidden shadow-md flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return <>{MapComponent}</>;
};
