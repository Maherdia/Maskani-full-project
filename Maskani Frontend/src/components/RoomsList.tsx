import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomsByDorm, getAvailableRooms } from '@/services/dormService';
import { useAuth } from '@/lib/use-auth';
import { RoomDTO } from '@/lib/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BedDouble, Check, DoorClosed, Loader2 } from 'lucide-react';

export interface RoomsListRef {
  refresh: () => Promise<void>;
}

interface RoomsListProps {
  dormId: string;
  onError?: (error: string) => void;
  onRoomSelect?: (roomId: number) => void;
  selectedRoomId?: number;
}

export const RoomsList = forwardRef<RoomsListRef, RoomsListProps>(({ dormId, onError, onRoomSelect, selectedRoomId }, ref) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!dormId) {
      const errorMsg = 'Dorm ID is missing';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching rooms for dorm:', dormId);
      const [dormRooms, availableRoomsList] = await Promise.all([
        getRoomsByDorm(dormId),
        getAvailableRooms(dormId)
      ]);
      
      if (!Array.isArray(dormRooms)) {
        const errorMsg = 'Received data is not in the correct format';
        throw new Error(errorMsg);
      }
      
      setRooms(dormRooms);
      setAvailableRooms(availableRoomsList.map(room => room.roomID));
    } catch (err) {
      console.error('Error details:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error fetching rooms';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [dormId, onError]);

  useImperativeHandle(ref, () => ({
    refresh: fetchRooms
  }));

  useEffect(() => {
    console.log('RoomsList mounted/updated with dormId:', dormId);
    fetchRooms();
  }, [fetchRooms, dormId]);

  const handleBooking = (roomId: number) => {
    if (!user) {
      navigate('/login', { 
        state: { 
          from: `/dorms/${dormId}`,
          message: 'Please login to continue with the booking process'
        } 
      });
      return;
    }

    navigate(`/booking/${dormId}`, {
      state: {
        roomId: roomId,
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading rooms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        <p>{error}</p>
        <Button 
          onClick={fetchRooms}
          variant="destructive"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!Array.isArray(rooms)) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        <p>Data format error</p>
        <Button 
          onClick={fetchRooms}
          variant="destructive"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No rooms available for this dorm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const isAvailable = availableRooms.includes(room.roomID);
        
        return (
          <Card 
            key={room.roomID}
            className={`overflow-hidden transition-all duration-200 hover:shadow-lg
              ${selectedRoomId === room.roomID ? 'ring-2 ring-blue-500' : ''}
              ${!isAvailable ? 'opacity-75' : ''}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BedDouble className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-semibold">Room {room.roomNumber}</h3>
                </div>
                {selectedRoomId === room.roomID && (
                  <div className="bg-blue-100 text-green-700 p-1 rounded-full">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <DoorClosed className="h-4 w-4 mr-2" />
                  <p className="text-sm">{room.description}</p>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {room.price} JOD/month
                </div>
                {!isAvailable && (
                  <div className="text-sm text-red-600 font-medium">
                    This room is currently unavailable
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  className={`flex-1 ${
                    isAvailable 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => isAvailable && handleBooking(room.roomID)}
                  disabled={!isAvailable}
                >
                  {isAvailable ? 'Book Now' : 'Unavailable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}); 