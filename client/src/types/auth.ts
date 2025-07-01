// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

// Response types from API
export interface AuthApiResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
}

// Store state type
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
}

// Error response type
export interface AuthError {
  error: string;
}
