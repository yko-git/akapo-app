import configureAWS from "../aws";

// 投稿ごとに署名付きURLを確認し、必要に応じて更新
async function updateSignedUrls(posts: any[]) {
  const now = new Date();
  return await Promise.all(
    posts.map(async (post: any) => {
      if (!post.signedUrl || !post.urlExpiresAt || post.urlExpiresAt < now) {
        const s3 = configureAWS();
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: post.imageKey,
          Expires: 60 * 5, // 5分間の有効期限
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
        post.urlExpiresAt = new Date(Date.now() + 60 * 5 * 1000); // 5分後
        await post.save();
      }

      return {
        ...post.toJSON(),
        signedUrl: post.signedUrl, // 最新の署名付きURLを返す
      };
    })
  );
}

export default updateSignedUrls;
