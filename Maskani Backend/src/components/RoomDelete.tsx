import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { roomAPI } from '@/lib/api/room';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Room {
  roomID: number;
  roomNumber: number;
  // Add other room properties as needed
}

interface RoomDeleteProps {
  dormID: string; // This will be coordinates like "31.101236317542764, 35.7158795425267"
  onSuccess?: () => void;
}

export const RoomDelete: React.FC<RoomDeleteProps> = ({ dormID, onSuccess }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomID, setSelectedRoomID] = useState<string>('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getRoomsByDormId(dormID);
      setRooms(response || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room list",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [dormID]);

  useEffect(() => {
    if (isDialogOpen && dormID) {
      fetchRooms();
    }
  }, [isDialogOpen, dormID, fetchRooms]);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomID(roomId);
    const selectedRoom = rooms.find(room => room.roomID.toString() === roomId);
    setSelectedRoomNumber(selectedRoom?.roomNumber || null);
  };

  const handleDelete = async () => {
    try {
      // Debug logging
      console.log("DormID received:", dormID, "Type:", typeof dormID);
      console.log("Selected Room ID:", selectedRoomID);
      
      if (!dormID) {
        throw new Error("Dorm coordinates are required");
      }

      // Clean dormID - remove any extra whitespace but keep coordinates intact
      const cleanDormID = dormID.toString().trim();
      
      // Validate coordinates format (should contain exactly one comma for lat,lng)
      const coordinateParts = cleanDormID.split(',');
      if (coordinateParts.length !== 2) {
        console.error("Invalid coordinate format:", cleanDormID);
        throw new Error("Invalid dorm coordinate format");
      }

      // Validate that both parts are valid numbers
      const lat = parseFloat(coordinateParts[0].trim());
      const lng = parseFloat(coordinateParts[1].trim());
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinate values:", lat, lng);
        throw new Error("Invalid coordinate values");
      }

      if (!selectedRoomID) {
        throw new Error("Please select a room to delete");
      }

      const roomID = parseInt(selectedRoomID);
      console.log("Attempting to delete room:", roomID, "from dorm at coordinates:", cleanDormID);
      
      const response = await roomAPI.deleteRoom(roomID.toString());
      
      if (response) {
        toast({
          title: "Success",
          description: `Room ${selectedRoomNumber} deleted successfully`,
        });
        
        // Reset form
        setSelectedRoomID('');
        setSelectedRoomNumber(null);
        setIsDialogOpen(false);
        
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while deleting the room";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSelectedRoomID('');
    setSelectedRoomNumber(null);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    }}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Room
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Room</AlertDialogTitle>
          <AlertDialogDescription>
            Select the room you want to delete from the list below:
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          {/* Room Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Room:
            </label>
            <Select 
              value={selectedRoomID} 
              onValueChange={handleRoomSelect}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : "Select a room"} />
              </SelectTrigger>
              <SelectContent>
                {rooms.length === 0 && !loading ? (
                  <SelectItem value="no-rooms" disabled>
                    No rooms available
                  </SelectItem>
                ) : (
                  rooms.map((room) => (
                    <SelectItem key={room.roomID} value={room.roomID.toString()}>
                      Room {room.roomNumber}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedRoomNumber && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> Room {selectedRoomNumber} will be permanently deleted. 
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={resetForm}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={!selectedRoomID}
          >
            Delete Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};