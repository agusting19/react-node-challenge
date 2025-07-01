import type { CreateUserDto, LoginDto } from "@/application/dtos/auth-dto";
import {
  loginUseCase,
  registerUseCase,
} from "@/application/use-cases/auth-use-cases";
import { userRepositoryImpl } from "@/domain/repositories/user-repository-impl";
import type { Request, Response } from "express";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginDto = req.body;

    if (!loginData.email || !loginData.password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const loginUser = loginUseCase(userRepositoryImpl);
    const result = await loginUser(loginData);

    if (!result) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserDto = req.body;

    if (!userData.email || !userData.password || !userData.name) {
      res.status(400).json({ error: "Email, password and name are required" });
      return;
    }

    const registerUser = registerUseCase(userRepositoryImpl);
    const result = await registerUser(userData);

    if (!result) {
      res.status(400).json({ error: "Failed to create user" });
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      res.status(409).json({ error: error.message });
      return;
    }

    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
