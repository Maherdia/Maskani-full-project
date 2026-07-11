import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  PlusCircle,
  Search,
  Users,
  CreditCard,
  Activity,
  Home,
  Trash2,
  Edit,
  EyeOff,
  Calendar as CalendarIcon,
  Check,
  X,
  MapPin,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/use-auth";
import { bookingAPI } from "@/lib/api/booking";
import { dormAPI } from "@/lib/api/dorm";
import { roomAPI } from "@/lib/api/room";
import { BookingData, DormData, RoomDTO, UpdateBookingDTO } from "@/lib/api/types";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_IMAGES_PER_DORM = 15; // Maximum number of images allowed per dorm listing

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [rooms, setRooms] = useState<{ [dormId: string]: RoomDTO[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [dormId: string]: number }>({});

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.ownerID) {
          throw new Error("Owner ID not found");
        }

        const ownerId = user.ownerID;
        setLoading(true);
        
        // Fetch owner's bookings
        const bookingsData = await bookingAPI.getOwnerBookings(ownerId);
        setBookings(bookingsData);

        // Fetch owner's dorms
        const dormsData = await dormAPI.getDormsByOwnerId(ownerId);
        setDorms(dormsData);

        // Fetch rooms for each dorm
        const roomsData: { [dormId: string]: RoomDTO[] } = {};
        for (const dorm of dormsData) {
          if (dorm.dormID) {
            const dormRooms = await roomAPI.getRoomsByDormId(dorm.dormID);
            roomsData[dorm.dormID] = dormRooms;
          }
        }
        setRooms(roomsData);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.ownerID]);

  // Handle booking status update
  const handleBookingStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      const booking = bookings.find(b => b.bookID === bookingId);
      if (!booking || !booking.bookID) {
        toast({
          title: "Error",
          description: "Booking not found",
          variant: "destructive",
        });
        return;
      }

      // Try to find the dormID from the room if it's missing in the booking
      let dormID = booking.dormID;
      if (!dormID && booking.roomID) {
        // Look through all dorms and their rooms to find the matching roomID
        for (const dorm of dorms) {
          if (dorm.dormID && rooms[dorm.dormID]) {
            const room = rooms[dorm.dormID].find(r => r.roomID === booking.roomID);
            if (room) {
              dormID = dorm.dormID;
              break;
            }
          }
        }
      }

      // Log the data being sent for debugging
      console.log('Updating booking with data:', {
        bookID: booking.bookID,
        studentID: booking.studentID,
        dormID: dormID,
        roomID: booking.roomID,
        bookingDate: booking.bookingDate,
        period: booking.period,
        status: newStatus,
        totalAmount: booking.totalAmount
      });

      // Create the update payload - ensure all required fields are present and properly formatted
      const updatedBooking: UpdateBookingDTO = {
        bookID: booking.bookID,
        studentID: booking.studentID,
        dormID: dormID,
        roomID: booking.roomID,
        bookingDate: booking.bookingDate || new Date(), // Ensure proper date format
        period: booking.period || 1,
        status: newStatus,
        totalAmount: booking.totalAmount || 0
      };

      // Validate all required fields with specific error messages
      const validationErrors = [];
      if (!updatedBooking.studentID) validationErrors.push("Student ID is missing");
      if (!updatedBooking.dormID) validationErrors.push("Dorm ID is missing");
      if (!updatedBooking.roomID) validationErrors.push("Room ID is missing");
      if (!updatedBooking.bookingDate) validationErrors.push("Booking date is missing");
      if (!updatedBooking.period || updatedBooking.period < 1) validationErrors.push("Invalid booking period");
      if (!updatedBooking.totalAmount || updatedBooking.totalAmount < 0) validationErrors.push("Invalid total amount");

      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(", "),
          variant: "destructive",
        });
        console.error("Booking validation errors:", validationErrors);
        return;
      }

      const response = await bookingAPI.updateBooking(updatedBooking);
      
      // Log successful response
      console.log('Booking update successful:', response);
      
      // Update local state only after successful API call
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.bookID === bookingId ? { ...b, status: newStatus } : b
        )
      );

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`,
      });
    } catch (err) {
      // Enhanced error logging
      console.error('Error updating booking:', err);
      
      // More specific error handling
      let errorMessage = "Failed to update booking status";
      
      if (err.response?.status === 400) {
        errorMessage = "Invalid booking data provided";
        console.error('400 Error details:', err.response?.data);
      } else if (err.response?.status === 404) {
        errorMessage = "Booking not found";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error occurred";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Stats calculation
  const stats = {
    totalDorms: dorms.length,
    totalRooms: Object.values(rooms).reduce((acc, dormRooms) => acc + dormRooms.length, 0),
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    activeBookings: bookings.filter(b => b.status === "active").length,
  };

  // Function to get images array from localStorage
  const getDormImages = (dormName: string): string[] => {
    const imagesJson = localStorage.getItem(`dorm_images_${dormName}`);
    return imagesJson ? JSON.parse(imagesJson) : [];
  };

  // تحسين وظيفة حفظ الصور مع إضافة التحقق من الحجم
  const saveDormImages = (dormName: string, images: string[]) => {
    try {
      const imagesJson = JSON.stringify(images);
      const storageSize = new Blob([imagesJson]).size;
      
      // التحقق من حجم التخزين
      if (storageSize > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "خطأ في الحفظ",
          description: "حجم الصور الإجمالي كبير جداً. يرجى حذف بعض الصور أولاً.",
          variant: "destructive",
        });
        return false;
      }

      localStorage.setItem(`dorm_images_${dormName}`, imagesJson);
      
      // عرض رسالة نجاح مع معلومات التخزين
      toast({
        title: "تم الحفظ بنجاح",
        description: `تم حفظ ${images.length} صور (${(storageSize / 1024).toFixed(1)} KB)`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الصور. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return false;
    }
  };

  // تحسين وظيفة معالجة الصور
  const handleImageUpload = async (file: File, dormName: string) => {
    // التحقق من حجم الملف
    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "حجم الملف كبير جداً",
        description: "يجب أن يكون حجم الصورة أقل من 2MB",
        variant: "destructive",
      });
      return;
    }

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast({
        title: "نوع الملف غير صحيح",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    const currentImages = getDormImages(dormName);
    
    // التحقق من عدد الصور
    if (currentImages.length >= MAX_IMAGES_PER_DORM) {
      toast({
        title: "تم الوصول للحد الأقصى",
        description: "يمكنك إضافة 15 صور كحد أقصى لكل سكن",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const success = saveDormImages(dormName, [...currentImages, base64String]);
        if (success) {
          setDorms([...dorms]); // تحديث الواجهة
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "خطأ في معالجة الصورة",
        description: "حدث خطأ أثناء معالجة الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  // Function to handle image navigation
  const handleImageNavigation = (dormId: string, direction: 'prev' | 'next') => {
    const dorm = dorms.find(d => d.dormID === dormId);
    if (!dorm) return;

    const images = getDormImages(dorm.dormName);
    if (images.length === 0) return;

    setCurrentImageIndexes(prev => {
      const currentIndex = prev[dormId] || 0;
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
      return { ...prev, [dormId]: newIndex };
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-6">
        {/* Stats Overview */}
        <div className="container mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Dorms</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDorms}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRooms}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeBookings}</div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const dorm = dorms.find(d => d.dormID === booking.dormID);
                  const room = rooms[booking.dormID]?.find(r => r.roomID === booking.roomID);

                  return (
                    <div
                      key={booking.bookID}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{booking.studentName || "Student"}</h3>
                        <p className="text-sm text-gray-500">
                          {dorm?.dormName} - Room {room?.roomNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Period: {booking.period} months - ${booking.totalAmount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100"
                              onClick={() => handleBookingStatusUpdate(booking.bookID!, "confirmed")}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-50 hover:bg-red-100"
                              onClick={() => handleBookingStatusUpdate(booking.bookID!, "cancelled")}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dorms and Rooms Section - Updated with Multiple Images */}
          <Card>
            <CardHeader>
              <CardTitle>My Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dorms.map((dorm) => {
                  const images = getDormImages(dorm.dormName);
                  const currentIndex = currentImageIndexes[dorm.dormID] || 0;

                  return (
                    <div key={dorm.dormID} className="border rounded-lg overflow-hidden">
                      {/* Image Carousel Section */}
                      <div className="relative w-full h-[300px]">
                        {images.length > 0 ? (
                          <>
                            <img
                              src={images[currentIndex]}
                              alt={`${dorm.dormName} - Image ${currentIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={() => handleImageNavigation(dorm.dormID, 'prev')}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                  <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                  onClick={() => handleImageNavigation(dorm.dormID, 'next')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                  <ChevronRight className="w-6 h-6" />
                                </button>
                              </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                              {currentIndex + 1} / {images.length}
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-2 flex gap-2 overflow-x-auto">
                              {images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndexes(prev => ({ ...prev, [dorm.dormID]: idx }))}
                                  className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                                    idx === currentIndex ? 'border-white' : 'border-transparent'
                                  }`}
                                >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">لا تتوفر صور للسكن</p>
                            </div>
                          </div>
                        )}

                        {/* Add Image Button */}
                        <div className="absolute top-2 right-2">
                          <label 
                            htmlFor={`image-upload-${dorm.dormID}`}
                            className="cursor-pointer bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-colors"
                          >
                            <input
                              id={`image-upload-${dorm.dormID}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, dorm.dormName);
                                }
                              }}
                            />
                            <PlusCircle className="w-6 h-6" />
                          </label>
                        </div>
                      </div>

                      <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{dorm.dormName}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {dorm.address}
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {rooms[dorm.dormID]?.map((room) => (
                        <Card key={room.roomID}>
                          <CardContent className="p-4">
                            <h4 className="font-medium">Room {room.roomNumber}</h4>
                            <p className="text-sm text-gray-500">{room.description}</p>
                            <p className="text-sm font-medium mt-2">${room.price}/month</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OwnerDashboard;
