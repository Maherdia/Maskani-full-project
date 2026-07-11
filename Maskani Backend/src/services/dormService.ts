import { dormAPI } from "@/lib/api/dorm";
import { bookingAPI } from "@/lib/api/booking";
import { roomAPI } from "@/lib/api/room";
import { DormData, AddDormDTO, RoomDTO, AddRoomDTO, UpdateRoomDTO } from "@/lib/api/types";

interface DormFilters {
  university?: string;
  location?: string;
  furnished?: boolean;
  maxDistance?: number;
  priceMin?: number;
  priceMax?: number;
}

// Get all dorms with filters
export const getDorms = async (filters?: DormFilters): Promise<DormData[]> => {
  try {
    let dorms: DormData[];
    
    if (filters?.university) {
      dorms = await dormAPI.getDormsByUniversity(filters.university);
    } else if (filters?.location) {
      dorms = await dormAPI.getDormsByAddress(filters.location);
    } else if (filters?.furnished !== undefined) {
      dorms = await dormAPI.getDormsByFurnishing(filters.furnished);
    } else if (filters?.maxDistance) {
      dorms = await dormAPI.getDormsByDistance(filters.maxDistance);
    } else {
      dorms = await dormAPI.getAllDorms();
    }
    
    return dorms;
  } catch (error) {
    console.error("Error fetching dorms:", error);
    return [];
  }
};

// Get a single dorm by ID
export const getDormById = async (id: string): Promise<DormData | null> => {
  try {
    // Ensure the ID is a valid number before making the API call.
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      console.error("Invalid dorm ID provided:", id);
      return null;
    }

    return await dormAPI.getDormById(id);
  } catch (error) {
    console.error("Error fetching dorm:", error);
    return null;
  }
};

// Get similar dorms (same university)
export const getSimilarDorms = async (id: string, universityName: string): Promise<DormData[]> => {
  try {
    const dorms = await dormAPI.getDormsByUniversity(universityName);
    return dorms
      .filter(dorm => dorm.dormID !== id)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching similar dorms:", error);
    return [];
  }
};

// Add a new dorm
export const addDorm = async (data: Omit<DormData, "dormID">): Promise<DormData> => {
  try {
    const newDorm = await dormAPI.addDorm({
      ...data,
      ownerID: 1, // You need to get this from your auth context
      universityID: "1", // You need to get this from your university list
    });
    return newDorm;
  } catch (error) {
    console.error("Error adding dorm:", error);
    throw error;
  }
};

// Booking related interfaces and functions
export interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  duration: number;
  numberOfGuests: number;
}

export interface BookingData {
  studentID: number;
  dormID: string;
  roomID: number;
  bookingDate: Date;
  period: number;
  status: string;
  priceMonthly: number;
}

// Create a new booking
export const createBooking = async (
  dormId: string,
  formData: BookingFormData,
  studentId: string | number
): Promise<void> => {
  try {
    const bookingData: BookingData = {
      studentID: Number(studentId),
      dormID: dormId,
      roomID: 1, // Default room ID, should be updated based on room selection
      bookingDate: new Date(),
      period: formData.duration,
      status: 'pending',
      priceMonthly: 50 // Default price, should be updated based on room type
    };

    if (!bookingData.dormID) {
      throw new Error('Invalid dorm ID');
    }

    await bookingAPI.addBooking(bookingData);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get user's booking history
export const getUserBookings = async (studentId: string | number): Promise<BookingData[]> => {
  try {
    // Filter all bookings to get the ones for this student
    const allBookings = await bookingAPI.getAllBookings();
    return allBookings.filter(booking => booking.studentID === Number(studentId));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string | number): Promise<void> => {
  try {
    // First get the existing booking
    const existingBooking = await bookingAPI.getBookingById(Number(bookingId));
    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    // Update the booking with all required fields
    await bookingAPI.updateBooking({
      ...existingBooking,
      bookID: Number(bookingId),
      status: 'cancelled'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId: string | number): Promise<BookingData | null> => {
  try {
    return await bookingAPI.getBookingById(Number(bookingId));
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

// Room related interfaces
export interface RoomData {
  roomID: number;
  dormID: string;
  roomNumber: string;
  capacity: number;
  pricePerMonth: number;
  isAvailable: boolean;
  roomType: string;
  description?: string;
  amenities?: string[];
}

// Get all rooms for a dorm
export const getRoomsByDorm = async (dormId: string | number): Promise<RoomDTO[]> => {
  try {
    console.log('dormService: Fetching rooms for dorm:', dormId);
    if (!dormId) {
      throw new Error('معرف السكن مطلوب');
    }

    const rooms = await roomAPI.getRoomsByDormId(dormId.toString());
    console.log('dormService: Received rooms from API:', rooms);

    if (!Array.isArray(rooms)) {
      throw new Error('البيانات المستلمة من الخادم ليست بالتنسيق الصحيح');
    }

    // التحقق من صحة البيانات
    const validatedRooms = rooms.map(room => {
      if (!room.roomID || !room.roomNumber) {
        throw new Error('بيانات الغرفة غير مكتملة');
      }
      return {
        ...room,
        price: room.price || 0,
        description: room.description || '',
        dormName: room.dormName || 'السكن'
      };
    });

    return validatedRooms;
  } catch (error) {
    console.error('dormService: Error fetching rooms:', error);
    throw error instanceof Error ? error : new Error('حدث خطأ أثناء جلب الغرف');
  }
};

// Get available rooms for a dorm
export const getAvailableRooms = async (dormId: string | number): Promise<RoomDTO[]> => {
  try {
    const rooms = await roomAPI.getRoomsByDormId(dormId.toString());
    // Since RoomDTO doesn't have availability status, we'll need to check bookings
    const bookings = await bookingAPI.getAllBookings();
    return rooms.filter(room => 
      !bookings.some(booking => 
        booking.roomID === room.roomID && 
        (booking.status === 'pending' || booking.status === 'confirmed')
      )
    );
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return [];
  }
};

// Get a single room by ID
export const getRoomById = async (roomId: string | number): Promise<RoomDTO | null> => {
  try {
    return await roomAPI.getRoomById(Number(roomId));
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
};

// Add a new room
export const addRoom = async (data: {
  dormID: string;
  roomNumber: number;
  price: number;
  description: string;
}): Promise<number> => {
  try {
    const roomData: AddRoomDTO = {
      dormID: data.dormID,
      roomNumber: data.roomNumber,
      price: data.price,
      description: data.description
    };
    return await roomAPI.addRoom(roomData);
  } catch (error) {
    console.error('Error adding room:', error);
    throw error;
  }
};

// Update a room
export const updateRoom = async (data: {
  roomID: number;
  dormID: string;
  roomNumber: number;
  price: number;
  description: string;
}): Promise<boolean> => {
  try {
    const roomData: UpdateRoomDTO = {
      roomID: data.roomID,
      dormID: data.dormID,
      roomNumber: data.roomNumber,
      price: data.price,
      description: data.description
    };
    return await roomAPI.updateRoom(roomData);
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

// Delete a room
export const deleteRoom = async (roomId: string | number): Promise<boolean> => {
  try {
    return await roomAPI.deleteRoom(roomId.toString());
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};

// Check room availability
export const checkRoomAvailability = async (
  roomId: string | number,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  try {
    const room = await roomAPI.getRoomById(Number(roomId));
    if (!room) {
      throw new Error('Room not found');
    }

    // Check if there are any overlapping bookings
    const bookings = await bookingAPI.getAllBookings();
    const roomBookings = bookings.filter(booking => booking.roomID === room.roomID);

    // Check for booking conflicts
    const hasConflict = roomBookings.some(booking => {
      const bookingStart = new Date(booking.bookingDate);
      const bookingEnd = new Date(bookingStart);
      bookingEnd.setMonth(bookingEnd.getMonth() + booking.period);

      return (
        booking.status === 'active' &&
        (
          (startDate >= bookingStart && startDate < bookingEnd) ||
          (endDate > bookingStart && endDate <= bookingEnd) ||
          (startDate <= bookingStart && endDate >= bookingEnd)
        )
      );
    });

    return !hasConflict;
  } catch (error) {
    console.error('Error checking room availability:', error);
    throw error;
  }
};

// Get room price
export const getRoomPrice = async (roomId: string | number): Promise<number> => {
  try {
    const room = await roomAPI.getRoomById(Number(roomId));
    if (!room) {
      throw new Error('Room not found');
    }
    return room.price;
  } catch (error) {
    console.error('Error getting room price:', error);
    throw error;
  }
};

// Get rooms by price range
export const getRoomsByPriceRange = async (min: number, max: number): Promise<RoomDTO[]> => {
  try {
    return await roomAPI.getRoomsByPriceRange(min, max);
  } catch (error) {
    console.error('Error fetching rooms by price range:', error);
    return [];
  }
};

