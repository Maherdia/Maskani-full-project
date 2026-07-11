import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { dormAPI } from '../lib/api/dorm';
import { DormData } from '../lib/api/types';
import { 
  Loader2, 
  MapPin, 
  University, 
  Phone, 
  Mail, 
  ChevronLeft, 
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  User,
  Building2
} from 'lucide-react';
import DormMap from '../components/DormMap';
import DormCard from '../components/DormCard';
import { RoomsList } from '@/components/RoomsList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getRoomsByDorm } from '@/services/dormService';
import { useAuth } from '@/lib/use-auth';
import { roomAPI } from '../lib/api/room';
import { bookingAPI } from '../lib/api/booking';
import { toast } from "@/components/ui/use-toast";
import { AddBookingDTO } from '../lib/api/types';
import { ownerAPI } from '../lib/api/owner';

const DormDetailsPage = () => {
  const { dormId } = useParams<{ dormId: string }>();
  const location = useLocation();
  const [dorm, setDorm] = useState<DormData | null>(null);
  const [similarDorms, setSimilarDorms] = useState<DormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  // Helper function to validate if dormId is a valid ID (can be either numeric or coordinates)
  const isValidDormId = (id: string): boolean => {
    // Check if it's coordinates (two decimal numbers separated by comma)
    const coordsPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (coordsPattern.test(id)) {
      return true;
    }
    // Check if it's a valid integer
    const parsed = parseInt(id, 10);
    return !isNaN(parsed) && parsed > 0;
  };

  useEffect(() => {
    const fetchDormDetails = async () => {
      if (!dormId) {
        setError("No dorm ID provided.");
        setLoading(false);
        return;
      }

      // Validate dormId format
      if (!isValidDormId(dormId)) {
        console.error("Invalid dormId format:", dormId);
        setError("Invalid dorm ID format. Please check the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching dorm details for ID:", dormId);
        
        const dormData = await dormAPI.getDormById(dormId);
        if (dormData) {
          setDorm(dormData);
          setOwnerEmail(dormData.email);
          
          // Load images from localStorage
          const storedImages = localStorage.getItem(`dorm_images_${dormData.dormName}`);
          const parsedImages = storedImages ? JSON.parse(storedImages) : [];
          setImages(parsedImages);
          console.log("Dorm data loaded:", dormData);
          
          // Fetch similar dorms based on university
          const distanceValue = typeof dormData.distance === 'number' 
            ? dormData.distance 
            : typeof dormData.distance === 'string'
              ? parseFloat(dormData.distance)
              : 500; // Default fallback

          console.log("Original dormData.distance:", dormData.distance);
          console.log("Parsed distanceValue for API:", distanceValue);

          if (!isNaN(distanceValue)) {
            try {
              const searchResults = await dormAPI.searchDorms({
                university: dormData.universityName,
                maxDistance: distanceValue
              });
              // Filter out the current dorm and limit to 3 similar dorms
              const similar = searchResults
                .filter(d => d.dormID !== dormData.dormID)
                .slice(0, 3);
              setSimilarDorms(similar);
            } catch (searchError) {
              console.warn("Error fetching similar dorms:", searchError);
              setSimilarDorms([]);
            }
          } else {
            console.error("Could not parse a valid distance from:", dormData.distance);
            setSimilarDorms([]);
          }
        } else {
          setError(`No dorm found with ID ${dormId}`);
        }
      } catch (err) {
        console.error("Error loading dorm details:", err);
        setError("Error loading dorm details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchDormDetails();
  }, [dormId]);

  // Clear rooms error when selectedRoomId changes
  useEffect(() => {
    if (selectedRoomId && roomsError) {
      setRoomsError(null);
    }
  }, [selectedRoomId, roomsError]);

  const handleBooking = () => {
    if (!selectedRoomId) {
      setRoomsError("Please select a room to book");
      toast({
        title: "Room Selection Required",
        description: "Please select a room from the list below to proceed with booking",
        variant: "destructive",
      });
      return;
    }

    if (!dorm || !dorm.dormID) {
      setError("Dorm ID is not available or invalid.");
      return;
    }

    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/dorms/${dorm.dormID}`,
          message: 'Please login to continue with the booking process'
        } 
      });
      return;
    }

    if (!isValidDormId(String(dorm.dormID))) {
      setError("Invalid dorm ID. Please try again.");
      return;
    }

    navigate(`/booking/${dorm.dormID}`, {
      state: {
        roomId: selectedRoomId,
        dormData: dorm
      }
    });
  };

  const handleRoomSelect = (roomId: number | null) => {
    setSelectedRoomId(roomId);
    if (roomsError) {
      setRoomsError(null);
    }
  };

  const handleRetryRooms = () => {
    setRoomsError(null);
    // RoomsList will re-fetch when roomsError is cleared
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !dorm) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <p className="text-2xl font-semibold mb-4 text-red-500">
              {error || 'Dorm not found'}
            </p>
            <p className="text-gray-600 mb-4">
              {dormId && !isValidDormId(dormId) 
                ? "The dorm ID format is invalid. Please check the URL."
                : "The requested dorm could not be found."}
            </p>
            <button
              onClick={() => navigate('/apartments')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Back to Apartments List
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/apartments')} 
            className="text-gray-600 hover:text-green-500 flex items-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Apartments List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Gallery Section */}
            <div className="relative w-full h-[400px]">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${dorm?.dormName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                  {/* Thumbnails */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
                    <div className="flex gap-2 bg-black/50 p-2 rounded-lg overflow-x-auto max-w-full">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                            currentImageIndex === index 
                              ? 'border-white opacity-100' 
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-800">
              {dorm.dormName}
            </h1>
            <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
              <span>{dorm.address}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
                <University className="h-5 w-5 mr-2 text-green-500" />
                <span>Near {dorm.universityName}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
                <span className="font-semibold mr-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Distance:
                </span>
                <span>{dorm.distance} meters from university</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
                <span className="font-semibold mr-2 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-500" />
                  Furnished:
                </span>
                <span>{dorm.furnishedOrNot ? "Yes" : "No"}</span>
            </div>

            <div className="mt-8 border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Location on Map</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <DormMap selectedDormId={dorm.dormID} />
              </div>
            </div>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-3">
                {dorm.ownerName && (
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2 text-green-500" />
                    <span>{dorm.ownerName}</span>
                  </div>
                )}
                {dorm.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-green-500" />
                    <span>{dorm.phone}</span>
                  </div>
                )}
                {ownerEmail && (
                <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-green-500" />
                    <span>{ownerEmail}</span>
              </div>
                )}
              </div>
            </div>
          </div>
        </div>

      

        {/* Rooms Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Available Rooms</h2>
          {roomsError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error Loading Rooms</AlertTitle>
              <AlertDescription>
                {roomsError}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={handleRetryRooms}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <RoomsList 
              dormId={isValidDormId(dormId || '') ? dormId : undefined} 
              onError={setRoomsError}
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoomId}
            />
          )}
            {/* Similar Dorms Section */}
        {similarDorms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Dorms You May Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarDorms.map((similarDorm) => (
                <DormCard 
                  key={similarDorm.dormID} 
                  dorm={similarDorm}
                />
              ))}
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DormDetailsPage;