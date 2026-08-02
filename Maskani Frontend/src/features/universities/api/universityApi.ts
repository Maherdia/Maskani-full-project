import api from "../../../lib/api/apiClient";
import type { UniversityData } from "../types/university.types";

export async function getAllUniversities(): Promise<UniversityData[]> {
  const response = await api.get<UniversityData[]>("/universities");
  return response.data;
}