import {
  createTrip,
  deleteTrip,
  getAllTrips,
  getTripById,
  updateTrip,
} from "@/presentation/controllers/trip-controller";
import { authMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router, type Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

// All trip routes require authentication
router.use(authMiddleware);

router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export { router as tripRoutes };
