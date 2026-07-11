import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Property } from "@/types";

type PropertyCardProps = {
  property: Property;
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/property/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 property-card">
        <div className="relative h-48 w-full">
          <img 
            src={property.image} 
            alt={property.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-maskani-primary/90 text-white text-sm font-medium py-1 px-3 rounded-md">
            {property.university}
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm font-medium py-1 px-3 rounded-md">
            {property.price} {property.currency}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{property.name}</h3>
          {property.location && (
            <div className="flex items-center text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            {property.bedrooms !== undefined && (
              <div className="flex items-center text-sm text-gray-500">
                <BedDouble className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center text-sm text-gray-500">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.area !== undefined && (
              <div className="flex items-center text-sm text-gray-500">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area} m²</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
