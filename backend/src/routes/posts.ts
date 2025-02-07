import { Router } from "express";
import passport from "passport";
import {
  createPosts,
  getPostsList,
  getPost,
  patchPost,
  deletePost,
  createComment,
  getComment,
} from "../controllers/postsController";

const router = Router();

router.post("/", passport.authenticate("jwt", { session: false }), createPosts);
router.get("/", passport.authenticate("jwt", { session: false }), getPostsList);
router.get("/:id", passport.authenticate("jwt", { session: false }), getPost);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  patchPost
);
router.post(
  "/:id/comments",
  passport.authenticate("jwt", { session: false }),
  createComment
);
router.get("/:id/comments", getComment);

export default router;
