require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import { signedURLConfig, putSignedUrl } from "./aws";
import cors from "cors";
import { updateSignedUrls, updateIconSignedUrls } from "./services/index";
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";

if (!process.env.MYPEPPER || !process.env.JWT_SECRET) {
  console.error("env vars are not set.");
  process.exit(1);
}

const app = express();
app.listen(3001);

(async () => {
  // await sequelize.sync({ alter: true });
  console.log("synchronized");
})();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// passportの初期化
app.use(passport.initialize());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);

// index
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

// user
app.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res: Response) => {
    try {
      const userId = req.user.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.json({
          errorMessage: "ユーザーが見つかりませんでした",
        });
      }

      // ユーザーのアイコン画像の署名付きURLを更新
      const updatedUser = await updateIconSignedUrls(user);

      res.json({ user: updatedUser });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "投稿が取得できませんでした" });
    }
  }
);

// /user/posts
app.get(
  "/user/posts",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    const status = req.query.status;
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "ユーザー情報が取得できませんでした" });
    }

    try {
      const instance = await User.findByPk(user.id);
      if (!instance) {
        return res
          .status(404)
          .json({ errorMessage: "ユーザーの投稿が取得できませんでした" });
      }
      const posts = await instance.posts(status);
      const updatedPosts = await updateSignedUrls(posts);
      res.json({ posts: updatedPosts });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "投稿が取得できませんでした" });
    }
  }
);

// アップロード用署名付きURLを生成するエンドポイント
app.get("/signedurl", async (req, res) => {
  const { filename } = req.query;
  const safeFilePath = `uploads/${Date.now()}-${filename}`;

  try {
    const url = await putSignedUrl({
      ...signedURLConfig,
      Key: safeFilePath,
      ContentType: "application/octet-stream",
    });
    res.status(200).json({ signedUrl: url, safeFilePath });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errorMessage: "署名付きURLの生成に失敗しました" });
  }
});
