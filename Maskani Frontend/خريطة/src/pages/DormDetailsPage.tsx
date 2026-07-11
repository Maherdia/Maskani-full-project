import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { dormAPI } from '../lib/api/dorm';
import { DormData } from '../lib/api/types';
import { Loader2, MapPin, University, Phone, Mail, ChevronLeft } from 'lucide-react';
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
      setRoomsError("الرجاء اختيار غرفة للحجز");
      toast({
        title: "تحديد الغرفة مطلوب",
        description: "يرجى اختيار غرفة من القائمة أدناه للمتابعة مع الحجز",
        variant: "destructive",
      });
      return;
    }

    if (!dorm || !dorm.dormID) {
      setError("معرف السكن غير متوفر أو غير صالح.");
      return;
    }

    // التحقق من تسجيل دخول المستخدم
    if (!user) {
      // إذا لم يكن المستخدم مسجل الدخول، توجيهه إلى صفحة تسجيل الدخول
      navigate('/login', { 
        state: { 
          from: `/dorms/${dorm.dormID}`,
          message: 'يرجى تسجيل الدخول للمتابعة مع عملية الحجز'
        } 
      });
      return;
    }

    // Validate that we have a proper dormId before navigating
    if (!isValidDormId(String(dorm.dormID))) {
      setError("معرف السكن غير صالح. يرجى المحاولة مرة أخرى.");
      return;
    }

    // إذا كان المستخدم مسجلاً، انتقل إلى صفحة الحجز
    navigate(`/booking/${dorm.dormID}`, {
      state: {
        roomId: selectedRoomId,
        dormData: dorm // Pass dorm data to avoid re-fetching
      }
    });
  };
////////////////////////
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
              onClick={() => navigate('/dorms')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Back to Dorms List
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
            onClick={() => navigate('/dorms')} 
            className="text-gray-600 hover:text-blue-500 flex items-center transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> العودة إلى قائمة السكنات
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-800">
              {dorm.dormName}
            </h1>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" />
              <span>{dorm.address}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <University className="h-5 w-5 mr-2 text-blue-500" />
              <span>بالقرب من {dorm.universityName}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <span className="font-semibold ml-2">المسافة:</span>
              <span>{dorm.distance} كم من الجامعة</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <span className="font-semibold ml-2">مفروش:</span>
              <span>{dorm.furnishedOrNot ? "نعم" : "لا"}</span>
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-bold mb-4">الموقع على الخريطة</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <DormMap selectedDormId={dorm.dormID} dorms={[dorm]} />
              </div>
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">معلومات الاتصال</h2>
              <div className="space-y-3">
                {dorm.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 ml-2" />
                    <span>{dorm.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 ml-2" />
                  <span>{dorm.ownerName || 'تواصل مع المالك عبر النظام'}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <button 
                  onClick={handleBooking}
                  className={`w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
                    selectedRoomId 
                      ? 'bg-blue-500 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={!selectedRoomId}
                >
                  {selectedRoomId ? 'احجز الآن' : 'اختر غرفة للحجز'}
                </button>
                {!selectedRoomId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    يرجى اختيار غرفة من القائمة أدناه
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Dorms Section */}
        {similarDorms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">سكنات مشابهة قد تعجبك</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarDorms.map((similarDorm) => (
                <DormCard key={similarDorm.dormID} dorm={similarDorm} />
              ))}
            </div>
          </div>
        )}

        {/* Rooms Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">الغرف المتوفرة</h2>
          {roomsError ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>خطأ في تحميل الغرف</AlertTitle>
              <AlertDescription>
                {roomsError}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={handleRetryRooms}
                >
                  إعادة المحاولة
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
        </div>
      </main>
    </div>
  );
};

export default DormDetailsPage;