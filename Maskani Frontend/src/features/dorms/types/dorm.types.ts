export interface DormData {
  dormID: string;
  dormName: string;
  address: string;
  universityName: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  furnishedOrNot: boolean;
  distance: number;
  latitude: number | null;
  longitude: number | null;
}
export interface DormImage {
  imageID: number;
  dormID: string;
  imageUrl: string;
  publicId: string;
  displayOrder: number;
  uploadedAt: string;
}

export interface RoomData {
  roomID: number;
  dormID: string;
  dormName: string;
  roomNumber: number;
  price: number;
  description: string;
}

export interface SearchDormParams {
  university?: string;
  furnished?: boolean;
  maxDistance?: number;
  address?: string;
  dormName?: string;
}

export interface AddDormRequest {
  dormID: string;
  ownerID: number;
  universityID: number;
  dormName: string;
  address: string;
  furnishedOrNot: boolean;
  distance: number;
  latitude: number;
  longitude: number;
}