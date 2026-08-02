import api from "../../../lib/api/apiClient";
import type { AddDormRequest, DormData, SearchDormParams } from "../types/dorm.types";

export async function getAllDorms(): Promise<DormData[]> {
  const response = await api.get<DormData[]>("/Dorms/all");
  return response.data;
}

export async function getDormById(dormId: string): Promise<DormData> {
  const response = await api.get<DormData>(`/Dorms/${dormId}`);
  return response.data;
}

export async function getDormsByOwnerId(ownerId: number): Promise<DormData[]> {
  const response = await api.get<DormData[]>(`/Dorms/by-owner-id/${ownerId}`);
  return response.data;
}

export async function searchDorms(params: SearchDormParams): Promise<DormData[]> {
  const query = new URLSearchParams();

  if (params.university?.trim()) query.append("university", params.university.trim());
  if (params.dormName?.trim()) query.append("dormName", params.dormName.trim());
  if (params.address?.trim()) query.append("address", params.address.trim());
  if (typeof params.furnished === "boolean") query.append("furnished", String(params.furnished));
  if (typeof params.maxDistance === "number") query.append("maxDistance", String(params.maxDistance));

  const response = await api.get<DormData[]>(`/Dorms/search?${query.toString()}`);
  return response.data;
}

export async function addDorm(dorm: AddDormRequest): Promise<{ dormID: string }> {
  const response = await api.post<{ dormID: string }>("/Dorms/add", dorm);
  return response.data;
}

export async function getPendingDorms(): Promise<DormData[]> {
  const response = await api.get<DormData[]>("/Dorms/pending");
  return response.data;
}

export async function updateDormStatus(dormId: string, dormStatus: string): Promise<void> {
  await api.put(`/Dorms/${dormId}/status`, { dormID: dormId, dormStatus });
}