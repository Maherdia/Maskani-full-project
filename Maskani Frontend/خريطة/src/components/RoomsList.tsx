import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomsByDorm } from '@/services/dormService';
import { RoomDTO } from '@/lib/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface RoomsListProps {
  dormId: string;
  onError: (error: string) => void;
  onRoomSelect?: (roomId: number) => void;
  selectedRoomId?: number | null;
}

export interface RoomsListRef {
  refresh: () => void;
}

export const RoomsList = forwardRef<RoomsListRef, RoomsListProps>(({ dormId, onError, onRoomSelect, selectedRoomId }, ref) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    if (!dormId) {
      const errorMsg = 'معرف السكن غير موجود';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching rooms for dorm:', dormId);
      const dormRooms = await getRoomsByDorm(dormId);
      console.log('Received rooms:', dormRooms);
      
      if (!Array.isArray(dormRooms)) {
        const errorMsg = 'البيانات المستلمة ليست بالتنسيق الصحيح';
        throw new Error(errorMsg);
      }
      
      setRooms(dormRooms);
    } catch (err) {
      console.error('Error details:', err);
      const errorMsg = err instanceof Error ? err.message : 'حدث خطأ أثناء جلب الغرف';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="mr-2">جاري تحميل الغرف...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={fetchRooms}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!Array.isArray(rooms)) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
        <p>خطأ في تنسيق البيانات</p>
        <button 
          onClick={fetchRooms}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">لا توجد غرف متاحة لهذا السكن</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div 
          key={room.roomID}
          className={`p-4 border rounded-lg shadow-sm cursor-pointer transition-all
            ${selectedRoomId === room.roomID ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}
          onClick={() => onRoomSelect?.(room.roomID)}
        >
          <h3 className="text-lg font-semibold">غرفة رقم {room.roomNumber}</h3>
          <p className="text-gray-600">{room.description}</p>
          <p className="text-lg font-bold mt-2">{room.price} JD/شهر</p>
        </div>
      ))}
    </div>
  );
}); 