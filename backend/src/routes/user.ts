import { Router } from "express";
import { getUser, userPosts } from "../controllers/userController";
import passport from "passport";

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), getUser);
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  userPosts
);

export default router;
