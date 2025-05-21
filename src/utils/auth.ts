import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true; // If no exp, treat as expired
    return decoded.exp * 1000 < Date.now(); // exp is in seconds, Date.now() in ms
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // Assume expired if decoding fails
  }
};