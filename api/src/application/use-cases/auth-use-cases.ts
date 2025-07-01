import type {
  AuthResponseDto,
  CreateUserDto,
  LoginDto,
} from "@/application/dtos/auth-dto";
import type { User } from "@/domain/entities/user";
import type { UserRepository } from "@/domain/repositories/user-repository";
import { env } from "@/infrastructure/config/environment";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload as BaseJwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends BaseJwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const loginUseCase = (userRepository: UserRepository) => {
  return async (loginData: LoginDto): Promise<AuthResponseDto | null> => {
    const user = await userRepository.findByEmail(loginData.email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isValidPassword) {
      return null;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.jwtSecret, {
      expiresIn: "24h",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  };
};

export const registerUseCase = (userRepository: UserRepository) => {
  return async (userData: CreateUserDto): Promise<AuthResponseDto | null> => {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
      ...userData,
      password: hashedPassword,
      role: userData.role as any,
    };

    const createdUser = await userRepository.create(newUser);

    const payload = {
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };

    const token = jwt.sign(payload, env.jwtSecret, {
      expiresIn: "24h",
    });

    return {
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
      },
    };
  };
};

export const verifyTokenUseCase = () => {
  return async (token: string): Promise<CustomJwtPayload | null> => {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as CustomJwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  };
};
