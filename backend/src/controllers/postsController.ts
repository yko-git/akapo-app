import express, { Response } from "express";
import { Post } from "../models/post";
import { User } from "../models/user";
import { Comment } from "../models/comment";
import {
  updateIconSignedUrls,
  updateSignedUrls,
  fetchPosts,
  fetchComments,
  fetchPostById,
} from "../services";
import { getSignedUrl, signedURLConfig, generateExpiresAt } from "../aws";

export const createPosts = async (req: any, res: Response) => {
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

    try {
      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `:tada: 新しい投稿があったよ！\n投稿: ${post.title}`,
        }),
      });
    } catch (e) {
      console.error("Slack通知に失敗", e);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: "投稿の作成に失敗しました" });
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
    return res.status(500).json({ errorMessage: "投稿が取得できませんでした" });
  }
};

export const getPostsList = async (req: any, res: Response) => {
  try {
    const posts = await fetchPosts(req.query);

    const updatedPosts = await updateSignedUrls(posts);
    await Promise.all(
      updatedPosts.map((post) => updateIconSignedUrls(post.user))
    );

    return res.json({ posts: updatedPosts });
  } catch (err) {
    return res.status(500).json({ errorMessage: "投稿取得失敗" });
  }
};

export const getPost = async (req: any, res: Response) => {
  const id = Number(req.params.id);

  const post = await fetchPostById(id);
  if (!post) {
    return res.status(404).json({ errorMessage: "投稿が見つかりません" });
  }

  const updatedPosts = await updateSignedUrls([post]);
  await updateIconSignedUrls(post.user);

  return res.json({ post: updatedPosts[0] });
};

export const patchPost = async (req: any, res: Response) => {
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
    return res.status(500).json({ errorMessage: "投稿の更新に失敗しました" });
  }
};

export const deletePost = async (req: any, res: Response) => {
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
      .status(500)
      .json({ errorMessage: "投稿の削除ができませんでした" });
  }
};

export const createComment = async (req: any, res: Response) => {
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
        .json({ errorMessage: "該当する投稿が見つかりませんでした" });
    }

    const comment = await Comment.create({
      body,
      userId: user.id,
      postId: req.params.id,
    });

    try {
      await fetch(process.env.SLACK_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `:tada: 新しいコメントがきたよ！\n投稿: ${post.title}：${comment.body}`,
        }),
      });
    } catch (e) {
      console.error("Slack通知に失敗", e);
    }

    // ユーザーの署名付きURLを更新
    const updatedUser = await updateIconSignedUrls(user);

    // フロントに返す形式を整える
    const responseComment = {
      ...comment.get({ plain: true }),
      postId: Number(comment.postId),
      userId: Number(comment.userId),
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        iconUrl: updatedUser.iconUrl,
        iconSignedUrl: updatedUser.iconSignedUrl,
      },
    };

    res.json({ comment: responseComment });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errorMessage: "コメントの投稿に失敗しました" });
  }
};

// get comments
export const getComment = async (req: any, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: "該当する投稿が見つかりませんでした" });
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
};

export const deleteComment = async (req: any, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const commentId = Number(req.params.commentId);

    console.log("削除対象 postId:", postId, "commentId:", commentId);

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        postId: postId,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "コメントが見つかりません" });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("コメント削除時のエラー:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "サーバーエラー", error });
  }
};
