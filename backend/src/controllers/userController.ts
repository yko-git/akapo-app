import express, { Response } from "express";
import { User } from "../models/user";
import { updateIconSignedUrls, updateSignedUrls } from "../services";

export const getUser = async (req: any, res: Response) => {
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
    return res.status(401).json({ errorMessage: "投稿が取得できませんでした" });
  }
};

export const userPosts = async (req: any, res: Response) => {
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
    return res.status(401).json({ errorMessage: "投稿が取得できませんでした" });
  }
};
