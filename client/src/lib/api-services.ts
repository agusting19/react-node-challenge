import type {
  AuthApiResponse,
  AuthResponse,
  LoginRequest,
  UserRole,
} from "@/types/auth";
import { clearAuthToken, get, post, setAuthToken } from "./api-client";

// Auth API
export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  try {
    const apiResponse = await post<AuthApiResponse>(
      "/api/auth/login",
      credentials
    );

    const response: AuthResponse = {
      success: true,
      token: apiResponse.token,
      user: {
        id: apiResponse.user.id,
        email: apiResponse.user.email,
        name: apiResponse.user.name,
        role: apiResponse.user.role as UserRole,
      },
    };

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
    };
  }
};

export const logout = async (): Promise<void> => {
  clearAuthToken();
};

// Health API
export const checkHealth = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  return await get("/health");
};
