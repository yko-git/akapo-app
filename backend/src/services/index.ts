import s3Client, {
  generateExpiresAt,
  signedURLConfig,
  getSignedUrl,
} from "../aws";
import Category from "../models/category";
import { Post } from "../models/post";
import { User } from "../models/user";
import { Comment } from "../models/comment";

// 複数取得
export async function fetchPosts({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  return Post.findAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
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
}

// 単一取得
export async function fetchPostById(id: number) {
  return Post.findByPk(id, {
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
        const cloudflareUrl = await toCDNUrl(signedUrl);

        // 新しい署名付きURLと有効期限を更新
        post.signedUrl = cloudflareUrl;
        post.urlExpiresAt = generateExpiresAt();
        await post.save();
      }

      return {
        ...post.toJSON(),
      };
    }),
  );
}

// icon用署名付きURLの更新ロジック
export async function updateIconSignedUrls(item: any) {
  const now = new Date();
  const user = await User.findByPk(item.id);
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
    const cloudflareUrl = await toCDNUrl(signedUrl);

    // 新しい署名付きURLと有効期限を更新
    user.iconSignedUrl = cloudflareUrl;
    user.iconUrlExpiresAt = generateExpiresAt();
    await user.save();
  }

  return user;
}

function toCDNUrl(signedUrl: string) {
  return signedUrl.replace(
    `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`,
    `https://images.akapo-app.com/${process.env.AWS_S3_BUCKET_NAME}`,
  );
}

// コメントの取得関数
export async function fetchComments(postId: string) {
  const comments = await Comment.findAll({
    where: { postId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "iconUrl", "iconSignedUrl"],
      },
    ],
  });
  return comments;
}
