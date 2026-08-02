import api from "../../../lib/api/apiClient";
import type { DormImage } from "../types/dorm.types";

export async function getDormImages(dormId: string): Promise<DormImage[]> {
  const response = await api.get<DormImage[]>(`/Dorms/${dormId}/images`);
  return response.data;
}
export async function uploadDormImage(dormId: string, file: File): Promise<DormImage> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<DormImage>(`/Dorms/${dormId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteDormImage(imageId: number): Promise<void> {
  await api.delete(`/Dorms/images/${imageId}`);
}