require("dotenv").config();
import express, { Request, Response } from "express";
import { User } from "./models/user";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import jwt from "jsonwebtoken";
import { Post } from "./models/post";
import { sequelize } from "./models";
import Category from "./models/category";
import configureAWS from "./aws";
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
      const { title, body, status, categoryIds, imageKey } = params || {};

      // DBに保存用 画像ダウンロード用の署名付きURLを生成
      const s3 = configureAWS();
      const expiresIn = 60 * 5;
      const paramsForS3 = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imageKey,
        Expires: expiresIn,
      };
      const signedUrl = await new Promise<string>((resolve, reject) => {
        s3.getSignedUrl("getObject", paramsForS3, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      });

      // 画像ダウンロード用の署名付きURLと有効期限も含めてDBに投稿
      const post = Post.build({
        userId: user.id,
        title,
        body,
        status,
        imageKey,
        signedUrl,
        urlExpiresAt: new Date(Date.now() + expiresIn * 1000),
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

      // 投稿ごとに署名付きURLを確認し、必要に応じて生成
      const now = new Date();
      const post = await Promise.all(
        posts.map(async (post) => {
          let signedUrl = post.signedUrl;
          // URLがない、または有効期限が切れている場合、新しい署名付きURLを生成
          if (!signedUrl || (post.urlExpiresAt && post.urlExpiresAt < now)) {
            const s3 = configureAWS();
            const params = {
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: post.imageKey,
              Expires: 60 * 5, // 5分間の有効期限
            };

            signedUrl = await new Promise<string>((resolve, reject) => {
              s3.getSignedUrl("getObject", params, (err, url) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(url);
                }
              });
            });

            // 新しい署名付きURLとその有効期限を保存
            post.urlExpiresAt = new Date(Date.now() + 60 * 5 * 1000); // 5分後
            await post.save();
          }

          return {
            ...post.toJSON(),
            signedUrl, // 新しい署名付きURL
          };
        })
      );

      return res.json({ posts: post });
    } catch (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errorMessage: "情報が取得できませんでした。" });
    }
  }
);

//有効期限が切れた場合に再生成するエンドポイント
app.post(
  "/posts/:id/re-signedurl",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ errorMessage: "投稿が見つかりません。" });
      }

      const s3 = configureAWS();
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: post.imageKey,
        Expires: 60 * 5, // 5分間の有効期限
      };

      const signedUrl = await new Promise<string>((resolve, reject) => {
        s3.getSignedUrl("getObject", params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            const cloudflareUrl = url.replace(
              `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`,
              `https://images.akapo-app.com/${process.env.AWS_S3_BUCKET_NAME}`
            );
            resolve(cloudflareUrl);
          }
        });
      });

      post.urlExpiresAt = new Date(Date.now() + 60 * 5 * 1000); // 新しい有効期限
      post.signedUrl = signedUrl;
      await post.save();

      return res.json({ signedUrl });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ errorMessage: "署名付きURLの更新に失敗しました。" });
    }
  }
);

app.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req: any, res) => {
    const user = req.user.user.name;
    const requestParams = req.params;
    const id = requestParams.id;
    const post = await Post.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Category, // カテゴリを取得
          through: { attributes: [] },
        },
        {
          model: User, // 投稿者の情報を取得
          attributes: ["id", "name"], // 必要な属性だけ取得
        },
      ],
    });
    if (post) {
      return res.json({
        post: {
          ...post.toJSON(), // Sequelize オブジェクトを通常のオブジェクトに変換
          user: post, // 投稿者情報を `user` として追加
        },
      });
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

// アップロード用署名付きURLを生成するエンドポイント
app.get("/postsimage", (req, res) => {
  const { filename } = req.query;
  const safeFilePath = `uploads/${Date.now()}-${filename}`;

  const s3 = configureAWS();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: safeFilePath,
    Expires: 60 * 5,
    ContentType: "application/octet-stream",
  };

  s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ errorMessage: "署名付きURLの生成に失敗しました。" });
    }

    res.status(200).json({ signedUrl: url, safeFilePath });
  });
});

// モックユーザー発行エンドポイント
app.post("/mockurl", async (req: Request, res: Response) => {
  try {
    // モックのユーザー情報
    const mockUser = {
      id: 1,
      loginId: "user1",
      name: "hoge1",
      iconUrl: "http://localhost",
    };

    // jwtのtokenを作成
    const payload = { user: mockUser };
    const token = jwt.sign(payload, `${process.env.JWT_SECRET}` as string, {
      expiresIn: "30days",
    });

    res.json({ user: mockUser, token });
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "モックユーザーの作成に失敗しました。" });
  }
});
