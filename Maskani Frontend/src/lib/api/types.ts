// Shared types for API modules

// Student Data Interfaces
export interface StudentDTO {
  personID: number;
  studentID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  role: string;
  [key: string]: unknown;
}

export interface AddStudentDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateStudentDTO {
  studentID: number;
  personID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequestDTO {
  Email: string;
  Password: string;
  Role: 'User' | 'Student' | 'Owner';
}

// Owner Data Interfaces
export interface OwnerDTO {
  personID: number;
  ownerID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  [key: string]: unknown;
}

export interface AddOwnerDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
 
}

export interface UpdateOwnerDTO {
  ownerID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  role: string;
 
}

// Property Data Interface
export interface PropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images?: File[] | string[];
  available: boolean;
}

// Booking Data Interface
export interface BookingData {
  bookID?: number;
  studentID: number;
  dormID: string;
  roomID: number;
  priceMonthly?: number;
  bookingDate: Date;
  period: number;
  totalAmount?: number;
  status: string;
  ownerID?: number;
  ownerName?: string;
  studentName?: string;
  dormName?: string;
}

export interface AddBookingDTO {
  studentID: number;
  dormID: string;
  roomID: number;
  priceMonthly?: number;
  bookingDate: Date;
  period: number;
  totalAmount?: number;
  status: string;
}

export interface UpdateBookingDTO {
  bookID: number;
  studentID: number;
  dormID: string;
  roomID: number;
  bookingDate: Date;
  period: number;
  totalAmount?: number;
  status: string;
}

// Dorm Data Interface
export interface DormData {
  dormID?: string;
  dormName: string;
  address: string;
  furnishedOrNot: boolean;
  distance: number;
  universityName: string;
  ownerName?: string;
  phone?: string;
  email?: string;
}

export interface AddDormDTO {
  dormID?: string;
  ownerID: number;
  universityID: string;
  dormName: string;
  address: string;
  furnishedOrNot: boolean;
  distance: number;
}

export interface UpdateDormDTO {
  dormID: string;
  dormName: string;
  address: string;
  furnishedOrNot: boolean;
  distance: number;
  universityID: string;
  ownerID: number;
}

export interface SearchDormParams {
  university?: string;
  furnished?: boolean;
  maxDistance?: number;
  address?: string;
  dormName?: string;
}

export interface PagedResult<T> {
  // total: number;
  pageIndex: number;
  pageSize: number;
  data: T[];
}

// Room Data Interfaces
export interface RoomDTO {
  roomID: number;
  dormID: string;
  roomNumber: number;
  dormName: string;
  price: number;
  description: string;
}

export interface AddRoomDTO {
  dormID: string;
  roomNumber: number;
  price: number;
  description: string;
}

export interface UpdateRoomDTO {
  roomID: number;
  dormID: string;
  roomNumber: number;
  price: number;
  description: string;
}

// User Data Interfaces
export interface UserDTO {
  personID: number;
  userID: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface AddUserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
   userID: number;
   role: string;
} 
// University Data Interfaces
export interface UniversityDTO {
  id: number;
  name: string;
  address: string;
}

export interface AddUniversityDTO {
  name: string;
  address: string;
}

export interface UpdateUniversityDTO {
  id: number;
  name: string;
  address: string;
}

// Unified DTO Interfaces
export interface UnifiedRegisterDTO {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  Password: string;
  Role: 'User' | 'Student' | 'Owner';
}

export interface UnifiedUpdateDTO {
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  Password: string;
  newPassword: string;
} 