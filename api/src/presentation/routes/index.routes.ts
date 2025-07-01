import { authRoutes } from "@/presentation/routes/auth.routes";
import { tripRoutes } from "@/presentation/routes/trip.routes";
import { Router, type Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.use("/auth", authRoutes);
router.use("/trips", tripRoutes);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Trucking API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      trips: "/api/trips",
    },
  });
});

export { router as apiRoutes };
