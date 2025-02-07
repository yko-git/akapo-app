require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import passport, { hash } from "./auth";
import { signedURLConfig, putSignedUrl } from "./aws";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
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
app.use("/user", userRoutes);
app.use("/posts", postsRoutes);

// index
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

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
