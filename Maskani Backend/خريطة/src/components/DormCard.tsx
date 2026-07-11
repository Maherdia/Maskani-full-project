import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Building2, Ruler, School, Phone, CurrencyIcon } from "lucide-react";
import { DormData } from "../lib/api/types";

type DormCardProps = {
  dorm: DormData;
  showPrice?: boolean;
  showContact?: boolean;
  imageUrl?: string;
  className?: string;
  compact?: boolean;
};

const DormCard = ({ 
  dorm, 
  showPrice = false, 
  showContact = true, 
  imageUrl = "/dorm-placeholder.jpg",
  className = "",
  compact = false
}: DormCardProps) => {
  return (
    <Link to={`/dorms/${dorm.dormID}`}>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 dorm-card bg-white ${className}`}>
        <div className="relative h-48 w-full">
          <img 
            src={imageUrl}
            alt={dorm.dormName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-green-600/90 text-white text-sm font-medium py-1 px-3 rounded-md">
            {dorm.universityName}
          </div>
          {showPrice && (
            <div className="absolute bottom-3 left-3 bg-green-700/70 text-white text-sm font-medium py-1 px-3 rounded-md flex items-center gap-1">
              <CurrencyIcon className="h-4 w-4" />
              <span>متاح للحجز</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-green-800">{dorm.dormName}</h3>
          
          <div className={`space-y-2 ${compact ? 'mb-2' : 'mb-4'}`}>
            {!compact && (
              <div className="flex items-center text-green-700">
                <School className="h-4 w-4 ml-2 text-green-600" />
                <span className="text-sm line-clamp-1">{dorm.universityName}</span>
              </div>
            )}
            
            <div className="flex items-center text-green-700">
              <MapPin className="h-4 w-4 ml-2 text-green-600" />
              <span className="text-sm line-clamp-1">{dorm.address}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-green-100">
              <div className="flex items-center text-sm text-green-600">
                <Ruler className="h-4 w-4 ml-1" />
                <span>{dorm.distance} كم</span>
              </div>
              
              <div className="flex items-center text-sm text-green-600">
                <Building2 className="h-4 w-4 ml-1" />
                <span>{dorm.furnishedOrNot ? 'مفروش' : 'غير مفروش'}</span>
              </div>

              {showContact && dorm.phone && (
                <div className="flex items-center text-sm text-green-600">
                  <Phone className="h-4 w-4 ml-1" />
                  <span className="line-clamp-1">{dorm.phone}</span>
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <div className="mt-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
                عرض التفاصيل
              </button>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DormCard; 