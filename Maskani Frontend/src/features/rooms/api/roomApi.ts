import api from "../../../lib/api/apiClient";
import type { RoomData } from "../../dorms/types/dorm.types";

export async function getRoomsByDormId(dormId: string): Promise<RoomData[]> {
  const response = await api.get<RoomData[]>(`/Rooms/dorm/${dormId}`);
  return response.data;
}