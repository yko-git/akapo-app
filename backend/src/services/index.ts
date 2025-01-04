import s3Client, {
  generateExpiresAt,
  signedURLConfig,
  getSignedUrl,
} from "../aws";
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
        const params = {
          ...signedURLConfig,
          Key: post.imageKey,
        };

        // 新しい署名付きURLを生成
        const signedUrl = await getSignedUrl(params);

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
export async function updateIconSignedUrls(item: any, isUserPage = false) {
  const now = new Date();

  // ユーザー情報の取得方法を切り替える
  const userId = isUserPage ? item.dataValues.id : item.user.id;

  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (
    !user.iconSignedUrl ||
    !user.iconUrlExpiresAt ||
    new Date(user.iconUrlExpiresAt) < now
  ) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: user.iconUrl,
      Expires: 300,
    };

    // 新しい署名付きURLを生成
    const signedUrl = await getSignedUrl(params);

    // 新しい署名付きURLと有効期限を更新
    user.iconSignedUrl = signedUrl;
    user.iconUrlExpiresAt = generateExpiresAt();
    await user.save();
  }

  return item;
}
