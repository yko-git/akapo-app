import { Router } from "express";
import { createAuth, loginAuth } from "../controllers/authController";
import passport from "passport";

const router = Router();

router.post("/signup", createAuth);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  loginAuth
);

export default router;
