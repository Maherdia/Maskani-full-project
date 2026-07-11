import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { roomAPI } from '@/lib/api/room';
import { dormAPI } from '@/lib/api/dorm';
import { RoomDTO, DormData } from '@/lib/api/types';
import { RoomDelete } from '@/components/RoomDelete';
import { useToast } from "@/components/ui/use-toast";
import { Building2, BedDouble, ArrowLeft } from 'lucide-react';
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoomsManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlDormId = searchParams.get('dormId');

  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [dorms, setDorms] = useState<DormData[]>([]);
  const [selectedDormId, setSelectedDormId] = useState<string>(urlDormId || "");
  const [currentDorm, setCurrentDorm] = useState<DormData | null>(null);

  const loadDorms = useCallback(async () => {
    try {
      const result = await dormAPI.getAllDorms();
      setDorms(result);
      if (urlDormId) {
        const dorm = result.find(d => d.dormID === urlDormId);
        if (dorm) {
          setCurrentDorm(dorm);
        }
      }
    } catch (error) {
      console.error("Error loading dorms:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل السكنات",
        variant: "destructive",
      });
    }
  }, [toast, urlDormId]);

  const loadRooms = useCallback(async (dormId?: string) => {
    try {
      let result: RoomDTO[];
      if (dormId) {
        result = await roomAPI.getRoomsByDormId(dormId);
      } else {
        result = await roomAPI.getAllRooms();
      }
      setRooms(result);
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الغرف",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadDorms();
  }, [loadDorms]);

  useEffect(() => {
    if (selectedDormId) {
      const dorm = dorms.find(d => d.dormID === selectedDormId);
      setCurrentDorm(dorm || null);
    } else {
      setCurrentDorm(null);
    }
    loadRooms(selectedDormId);
  }, [selectedDormId, dorms, loadRooms]);

  const handleRoomDeleted = () => {
    loadRooms(selectedDormId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-700"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              عودة للوحة التحكم
            </Button>
            <h1 className="text-2xl font-bold text-green-800">
              {currentDorm ? `إدارة غرف ${currentDorm.dormName}` : 'إدارة الغرف'}
            </h1>
          </div>
          <div className="w-72">
            <Select
              value={selectedDormId}
              onValueChange={setSelectedDormId}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر السكن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع السكنات</SelectItem>
                {dorms.map((dorm) => (
                  <SelectItem key={dorm.dormID} value={dorm.dormID || ""}>
                    {dorm.dormName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room.roomID} className="overflow-hidden border border-green-100 hover:border-green-200 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <BedDouble className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="font-semibold text-lg text-green-800">
                      غرفة رقم {room.roomNumber}
                    </h3>
                  </div>
                  <span className="text-sm text-green-600">ID: {room.roomID}</span>
                </div>
                
                <div className="space-y-2 text-sm text-green-600 mt-4">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-green-500" />
                    <span>{room.dormName}</span>
                  </div>
                  <div className="text-sm text-green-600">
                    السعر: {room.price.toLocaleString()} دينار/شهر
                  </div>
                  <div className="text-sm text-green-600">
                    {room.description}
                  </div>
                  
                  <div className="mt-4">
                    <RoomDelete
                      roomId={room.roomID}
                      roomNumber={room.roomNumber}
                      onSuccess={handleRoomDeleted}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            {selectedDormId ? 'لا توجد غرف متاحة في هذا السكن' : 'لا توجد غرف متاحة حالياً'}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsManagement; 