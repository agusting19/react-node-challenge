import { login, register } from "@/presentation/controllers/auth-controller";
import { Router, type Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();

router.post("/login", login);
router.post("/register", register);

export { router as authRoutes };
