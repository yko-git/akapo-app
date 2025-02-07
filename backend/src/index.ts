require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import { Comment } from "./models/comment";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import { Post } from "./models/post";
import {
  generateExpiresAt,
  getSignedUrl,
  signedURLConfig,
  putSignedUrl,
} from "./aws";
import cors from "cors";
import {
  updateSignedUrls,
  fetchPosts,
  updateIconSignedUrls,
  fetchComments,
} from "./services/index";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

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
app.use("/user", userRoutes);

// index
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

// posts
app.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "ユーザー情報が取得できませんでした" });
    }
    try {
      const { post: params } = req.body;
      const { title, body, status, categoryIds, imageKey } = params || {};

      // DBに保存用 画像ダウンロード用の署名付きURLを生成
      const signedUrl = await getSignedUrl({
        ...signedURLConfig,
        Key: imageKey,
      });

      // 画像ダウンロード用の署名付きURLと有効期限も含めてDBに投稿
      const post = Post.build({
        userId: user.id,
        title,
        body,
        status,
        imageKey,
        signedUrl,
        urlExpiresAt: generateExpiresAt(),
      });

      await post.upsert(categoryIds);
      res.json({ post });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errorMessage: "登録ができませんでした" });
    }
  }
);

app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const query = req.query;

      const posts = await fetchPosts({ query });
      const users = posts.map((post) => post.user!);

      const updatedPosts = await updateSignedUrls(posts);
      const updatedUsers = await Promise.all(
        users.map((user) => updateIconSignedUrls(user))
      );

      return res.json({ posts: updatedPosts, users: updatedUsers });
    } catch (err) {
      console.error("投稿の取得中にエラーが発生しました:", err);
      return res
        .status(500)
        .json({ errorMessage: "投稿リストを取得できませんでした" });
    }
  }
);

app.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    const { id } = req.params;
    const posts = await fetchPosts({ id });
    const users = posts.map((post) => post.user!);

    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ errorMessage: "投稿が取得できませんでした" });
    }

    const updatedPosts = await updateSignedUrls(posts);
    const updatedUser = await Promise.all(
      users.map((user) => updateIconSignedUrls(user))
    );
    return res.json({ posts: updatedPosts, user: updatedUser });
  }
);

app.patch(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const requestParams = req.params;
      const id = requestParams.id;

      const { post: params } = req.body;
      const { title, body, status, categoryIds, imageKey } = params || {};

      const post = await Post.findOne({
        where: {
          id,
        },
      });
      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: "投稿が取得できませんでした" });
      }

      if (params.imageKey) {
        const signedUrl = await getSignedUrl({
          ...signedURLConfig,
          Key: imageKey,
        });
        const urlExpiresAt = generateExpiresAt();
        post.set({
          imageKey: params.imageKey,
          signedUrl,
          urlExpiresAt,
        });
      }

      post.set({
        title,
        body,
        status,
      });
      if (categoryIds) {
        await post.setCategories(categoryIds);
      }

      await post.save();

      res.json({ post: { ...post.toJSON(), imageUrl: post.signedUrl } });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errorMessage: "登録ができませんでした" });
    }
  }
);

app.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const requestParams = req.params;
      const id = requestParams.id;

      const post = await Post.findOne({
        where: {
          id,
        },
      });
      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: "投稿が取得できませんでした" });
      }

      await post.delete();
      res.json({ post });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "投稿の削除ができませんでした" });
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

// comments
app.post(
  "/posts/:id/comments",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res: Response) => {
    const user = req.user?.user;

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "ユーザー情報が取得できませんでした" });
    }

    try {
      const { body } = req.body;
      if (!body) {
        return res.status(400).json({ errorMessage: "コメント内容が空です" });
      }

      const post = await Post.findOne({ where: { id: req.params.id } });
      if (!post) {
        return res
          .status(404)
          .json({ errorMessage: "指定された投稿が存在しません" });
      }

      const comment = await Comment.create({
        body,
        userId: user.id,
        postId: req.params.id,
      });

      res.json({ comment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ errorMessage: "登録ができませんでした" });
    }
  }
);

// get comments
app.get("/posts/:id/comments", async (req: any, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: "指定された投稿が存在しません" });
    }

    const comments = await fetchComments(postId);
    const users = comments
      .map((comment) => comment.user)
      .filter((user) => user);

    // ユーザーの署名付きURLを更新
    const updatedUsers = await Promise.all(
      users.map((user) => updateIconSignedUrls(user))
    );

    return res.json({ comments, users: updatedUsers });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ errorMessage: "コメントの取得に失敗しました" });
  }
});
