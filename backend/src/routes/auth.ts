import { Router } from "express";
import { createAuth, loginAuth } from "../controllers/authController";

const router = Router();

router.post("/signup", createAuth);
router.post("/login", loginAuth);

export default router;
