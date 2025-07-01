import { verifyTokenUseCase } from "@/application/use-cases/auth-use-cases";
import type { NextFunction, Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const verifyToken = verifyTokenUseCase();
    const decoded = await verifyToken(token);

    if (!decoded) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
