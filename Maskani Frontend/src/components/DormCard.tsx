import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Building2, Ruler, School, Phone, CurrencyIcon, Image as ImageIcon } from "lucide-react";
import { DormData } from "../lib/api/types";
import { useState } from "react";

// Constants for image handling
const MAX_IMAGES = 1;
const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 1000MB

type DormCardProps = {
  dorm: DormData;
  showPrice?: boolean;
  showContact?: boolean;
  className?: string;
  compact?: boolean;
};

const DormCard = ({ 
  dorm, 
  showPrice = false, 
  showContact = true, 
  className = "",
  compact = false
}: DormCardProps) => {
  // Get images from localStorage with size validation
  const storedImages = localStorage.getItem(`dorm_images_${dorm.dormName}`);
  const images = storedImages ? JSON.parse(storedImages).slice(0, MAX_IMAGES) : [];
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageError = () => {
    setImageError("Failed to load image");
    setIsImageLoaded(true); // Show fallback
  };

  return (
    <Link to={`/dorms/${dorm.dormID}`}>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 dorm-card bg-white ${className}`}>
        <div className="relative h-48 w-full">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <img 
                src={images[0]}
                alt={dorm.dormName} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={handleImageError}
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-3 rounded-full flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>{images.length} {images.length > 1 ? 'Photos' : 'Photo'}</span>
                  {images.length === MAX_IMAGES && (
                    <span className="text-xs opacity-75">(Max)</span>
                  )}
                </div>
              )}
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 animate-pulse" />
                </div>
              )}
              {imageError && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <span className="text-sm text-red-500">Error loading image</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-500">No Photos</span>
              </div>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-3 rounded-full">
            {dorm.universityName}
          </div>
          {showPrice && (
            <div className="absolute bottom-3 left-3 bg-green-700/70 backdrop-blur-sm text-white text-sm font-medium py-1.5 px-3 rounded-full flex items-center gap-2">
              <CurrencyIcon className="h-4 w-4" />
              <span>Available for Booking</span>
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900">{dorm.dormName}</h3>
          
          <div className={`space-y-2 ${compact ? 'mb-2' : 'mb-4'}`}>
            {!compact && (
              <div className="flex items-center text-gray-800">
                <School className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm line-clamp-1">{dorm.universityName}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-800">
              <MapPin className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm line-clamp-1">{dorm.address}</span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                <Ruler className="h-4 w-4 mr-1 text-green-600" />
                <span>{dorm.distance} meters</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-700">
                <Building2 className="h-4 w-4 mr-1 text-green-600" />
                <span>{dorm.furnishedOrNot ? 'Furnished' : 'Unfurnished'}</span>
              </div>

              {showContact && dorm.phone && (
                <div className="flex items-center text-sm text-gray-700">
                  <Phone className="h-4 w-4 mr-1 text-green-600" />
                  <span className="line-clamp-1">{dorm.phone}</span>
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <div className="mt-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
                View Details
              </button>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

export default DormCard; 