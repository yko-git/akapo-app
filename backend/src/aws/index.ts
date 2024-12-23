import AWS from "aws-sdk";

const configureAWS = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  return new AWS.S3();
};

export const signedURLConfig = {
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Expires: 60 * 5,
};

export const generateExpiresAt = () => {
  return new Date(Date.now() + signedURLConfig.Expires * 1000);
};

export const getSignedUrl = (params: any) => {
  return new Promise<string>((resolve, reject) => {
    configureAWS().getSignedUrl("getObject", params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

export const putSignedUrl = (params: any, type: any, res: any) => {
  return configureAWS().getSignedUrl("putObject", params, (err, url) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ errorMessage: "署名付きURLの生成に失敗しました" });
    }

    if (type === "icon") {
      res.status(200).json({ iconSignedUrl: url, safeFilePath: params.Key });
    } else {
      res.status(200).json({ signedUrl: url, safeFilePath: params.Key });
    }
  });
};

export default configureAWS;
