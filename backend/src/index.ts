require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import jwt from "jsonwebtoken";
import { Post } from "./models/post";
import { sequelize } from "./models";
import Category from "./models/category";
import AWS from "aws-sdk";
import cors from "cors";

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

// auth/signup
app.post("/auth/signup", async (req, res, next) => {
  try {
    const hashedPassword = await hash(req);

    const { user: params } = req.body;
    const { id, loginId, name, iconUrl, authorizeToken } = params || {};
    const user = { id, loginId, name, iconUrl, authorizeToken };
    user.authorizeToken = hashedPassword;

    const searchUser = await User.findAll({
      where: {
        loginId: req.body.user.loginId,
      },
    });

    if (searchUser.length) {
      return res
        .status(400)
        .json({ errorMessage: "user情報がすでに登録されています" });
    }

    await User.create(user);
    res.json({ errorMessage: "user情報の登録が完了しました" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ errorMessage: "userが正しく登録できませんでした" });
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
      return res.status(401).json({ errorMessage: "認証ができませんでした。" });
    }
  }
);

// user
app.get(
  "/user",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req: any, res: Response) => {
    const { user } = req.user;
    if (!user) {
      return res.status(500).json({ errorMessage: "認証ができませんでした。" });
    } else {
      return res.send(user);
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
        .json({ errorMessage: "情報が取得できませんでした。" });
    }

    try {
      const instance = await User.findByPk(user.id);
      if (!instance) {
        return res
          .status(404)
          .json({ errorMessage: "情報が取得できませんでした。" });
      }
      const posts = await instance.posts(status);
      res.json({ posts });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
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
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
    try {
      const { post: params } = req.body;
      const { title, body, status, categoryIds } = params || {};

      const post = Post.build({
        userId: user.id,
        title,
        body,
        status,
      });

      await post.upsert(categoryIds);
      res.json({ post });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ errorMessage: "登録ができませんでした。" });
    }
  }
);

app.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const status = req.query;
      const posts = await Post.findAll({
        where: status,
        include: {
          model: Category,
          through: { attributes: [] },
        },
      });

      return res.json({ posts });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

app.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    const requestParams = req.params;
    const id = requestParams.id;
    const post = await Post.findOne({
      where: {
        id,
      },
      include: {
        model: Category,
        through: { attributes: [] },
      },
    });

    if (post) {
      return res.json({ post });
    } else {
      return res
        .status(404)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
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
          .json({ errorMessage: "情報が取得できませんでした" });
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
      return res.status(401).json({ errorMessage: "登録ができませんでした。" });
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
          .json({ errorMessage: "情報が取得できませんでした" });
      }

      await post.delete();
      res.json({ post });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "記事の削除ができませんでした。" });
    }
  }
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

app.get("/imgupload", (req, res) => {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ errorMessage: "Filenameは必須です。" });
  }

  // 署名付きURLを生成
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Expires: 60 * 5,
    ContentType: "image/jpeg",
  };

  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ errorMessage: "署名付きURLの生成に失敗しました。" });
    }

    res.status(200).json({ signedUrl: url });
  });
});
