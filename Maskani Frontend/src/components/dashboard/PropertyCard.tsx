import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, BedDouble, Bath, Square } from "lucide-react";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card key={property.id} className="overflow-hidden">
      <img
        src={property.image}
        alt={property.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{property.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{property.location}</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="h-4 w-4 mr-2" />
            <span>{property.bedrooms} غرف نوم</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-2" />
            <span>{property.bathrooms} حمام</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-2" />
            <span>{property.area} متر مربع</span>
          </div>
          <div className="font-semibold text-blue-600 mt-2">
            {property.price} {property.currency} / شهرياً
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard; 