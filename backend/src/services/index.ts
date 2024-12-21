import configureAWS, { signedURLConfig } from "../aws";
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
        through: { attributes: [] },
      },
      {
        model: User,
        attributes: ["id", "name", "iconUrl", "iconSignedUrl"],
      },
    ],
  });
  return posts;
}

// 署名付きURLの更新ロジック
export async function updateSignedUrls(posts: Post[]) {
  const now = new Date();
  return await Promise.all(
    posts.map(async (post) => {
      if (!post.signedUrl || !post.urlExpiresAt || post.urlExpiresAt < now) {
        const s3 = configureAWS();
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
        post.urlExpiresAt = new Date(Date.now() + params.Expires * 1000);
        await post.save();
      }

      return {
        ...post.toJSON(),
      };
    })
  );
}
