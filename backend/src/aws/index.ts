import AWS from "aws-sdk";

const initS3Client = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  return new AWS.S3();
};

const s3Client = initS3Client();

export const signedURLConfig = {
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Expires: 60 * 5,
};

export const generateExpiresAt = () => {
  return new Date(Date.now() + signedURLConfig.Expires * 1000);
};

const getUrlSigner = (kind: "getObject" | "putObject") => (params: any) => {
  return new Promise<string>((resolve, reject) => {
    s3Client.getSignedUrl(kind, params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        if (kind === "getObject") {
          const cloudflareUrl = url.replace(
            `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`,
            `https://images.akapo-app.com/${process.env.AWS_S3_BUCKET_NAME}`
          );
          resolve(cloudflareUrl);
        } else {
          resolve(url);
        }
      }
    });
  });
};

export const getSignedUrl = getUrlSigner("getObject");

export const putSignedUrl = getUrlSigner("putObject");

export default s3Client;
