import express, { Request, Response } from "express";
import { User } from "../models/user";
import { getSignedUrl, generateExpiresAt, signedURLConfig } from "../aws";
import passport, { hash } from "../auth";
import jwt from "jsonwebtoken";

export const createAuth = async (req: Request, res: Response) => {
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
};

export const loginAuth = [
  passport.authenticate("local", {
    session: false,
  }),
  (req: Request, res: Response) => {
    try {
      // jwtのtokenを作成
      const user = req.user;
      const payload = { user };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
      });
      res.json({ user, token });
    } catch (err) {
      res.status(401).json({ errorMessage: "認証ができませんでした" });
    }
  },
];
