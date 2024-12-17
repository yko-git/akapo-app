import AWS from "aws-sdk";

const configureAWS = () => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  return new AWS.S3();
};

export const singedURLConfig = {
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Expires: 60 * 5,
};

export default configureAWS;
