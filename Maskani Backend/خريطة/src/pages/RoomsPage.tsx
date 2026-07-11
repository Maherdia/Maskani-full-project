import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '@/lib/api/room';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import type { RoomDTO } from '@/lib/api/types';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const response = await roomAPI.getAllRooms();
        setRooms(response);
      } catch (error) {
        console.error('Error loading rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleBookRoom = (dormId: string, roomId: number) => {
    navigate(`/booking/${dormId}`, { state: { roomId } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="mr-2">جاري تحميل الغرف...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">الغرف المتاحة للحجز</h1>
        
        {rooms.length === 0 ? (
          <div className="text-center text-gray-500">
            لا توجد غرف متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.roomID} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{room.dormName}</h2>
                  <p className="text-gray-600 mb-4">غرفة رقم {room.roomNumber}</p>
                  <p className="text-gray-700 mb-4">{room.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">{room.price} دينار/شهر</span>
                    <Button 
                      onClick={() => handleBookRoom(room.dormID, room.roomID)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      احجز الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage; 