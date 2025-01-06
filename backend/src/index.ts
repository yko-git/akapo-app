require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import jwt from "jsonwebtoken";
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
} from "./services/index";

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

// index
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

app.post("/auth/signup", async (req, res, next) => {
  try {
    const hashedPassword = await hash(req);

    const { user: params } = req.body;
    const { id, loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { id, loginId, name, iconUrl, authorizeToken };
    user.authorizeToken = hashedPassword;

    const searchUser = await User.findAll({
      where: {
        loginId,
      },
    });

    if (searchUser.length) {
      return res
        .status(400)
        .json({ errorMessage: "ユーザー情報がすでに登録されています" });
    }

    const iconSignedUrl = await getSignedUrl({
      ...signedURLConfig,
      Key: iconUrl,
    });

    const userData = await User.create({
      ...user,
      iconSignedUrl,
      iconUrlExpiresAt: generateExpiresAt(),
    });

    res.json({
      user: {
        id: userData.id,
        loginId: userData.loginId,
        name: userData.name,
        iconUrl: userData.iconUrl,
        iconSignedUrl: userData.iconSignedUrl,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorMessage: "ユーザーが正しく登録できませんでした" });
  }
});

// auth/login
app.post(
  "/auth/login",
  passport.authenticate("local", {
    session: false,
  }),
  (req: Request, res: Response) => {
    try {
      // jwtのtokenを作成
      const user = req.user;
      const payload = { user: req.user };
      const token = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
        expiresIn: "30days",
      });
      res.json({ user, token });
    } catch (err) {
      return res.status(401).json({ errorMessage: "認証ができませんでした" });
    }
  }
);

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
      post.set({
        title: params.title,
        body: params.body,
        status: params.status,
      });
      await post.upsert(params.categoryIds);
      res.json({ post: post });
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
