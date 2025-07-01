import { config } from "dotenv";

config();

export const env = {
  port: parseInt(process.env["PORT"] || "3001", 10),
  mongoUri:
    process.env["MONGO_URI"] || "mongodb://localhost:27017/trucking-app",
  jwtSecret:
    process.env["JWT_SECRET"] || "your-super-secret-key-change-in-production",
  nodeEnv: process.env["NODE_ENV"] || "development",
} as const;

export const isDevelopment = env.nodeEnv === "development";
export const isProduction = env.nodeEnv === "production";
