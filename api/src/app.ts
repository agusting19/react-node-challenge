import { env } from "@/infrastructure/config/environment.js";
import cors from "cors";
import express, { type Application } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { apiRoutes } from "./presentation/routes/index.routes";

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requests per window
});
app.use(limiter);

// API Routes
app.use("/api", apiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

export default app;
