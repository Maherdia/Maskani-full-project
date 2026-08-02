export interface User {
  personID: number;
  ownerID?: number;
  studentID?: number;
  userID?: number;

  firstName: string;
  lastName: string;
  phone: string;
  email: string;

  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export type UserRole = "User" | "Student" | "Owner";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
}