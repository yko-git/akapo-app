import s3Client, { generateExpiresAt, signedURLConfig } from "../aws";
import Category from "../models/category";
import { Post } from "../models/post";
import { User } from "../models/user";

// 共通の投稿取得関数
export async function fetchPosts(params: { id?: string; query?: any }) {
  const { id, query } = params;

  const where = id ? { id } : query || {};

  const posts = await Post.findAll({
    where,
    include: [
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "iconUrl", "iconSignedUrl"],
      },
    ],
  });
  return posts;
}

// 投稿用署名付きURLの更新ロジック
export async function updateSignedUrls(posts: Post[]) {
  const now = new Date();
  return await Promise.all(
    posts.map(async (post) => {
      if (!post.signedUrl || !post.urlExpiresAt || post.urlExpiresAt < now) {
        const s3 = s3Client;
        const params = {
          ...signedURLConfig,
          Key: post.imageKey,
        };

        // 新しい署名付きURLを生成
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

        // 新しい署名付きURLと有効期限を更新
        post.signedUrl = signedUrl;
        post.urlExpiresAt = generateExpiresAt();
        await post.save();
      }

      return {
        ...post.toJSON(),
      };
    })
  );
}

// icon用署名付きURLの更新ロジック
export async function updateIconSignedUrls(user: User) {
  const now = new Date();
  const item = user;

  if (item.iconUrl && (!item.iconSignedUrl || item.iconUrlExpiresAt < now)) {
    const s3 = s3Client;
    const params = {
      ...signedURLConfig,
      Key: item.iconUrl,
    };

    // 新しい署名付きURLを生成
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

    // 新しい署名付きURLと有効期限を更新
    item.iconSignedUrl = signedUrl;
    item.iconUrlExpiresAt = generateExpiresAt();
    await item.save();
  }

  return {
    item,
  };
}
