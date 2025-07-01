export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: string;
}
