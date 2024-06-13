import {
  S3Client,
  PutObjectCommand,
  PutBucketCorsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v5 as uuidv5, v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export const setCorsOptions = async () => {
  const input = {
    Bucket: "f-storage",
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "POST", "DELETE"],
          AllowedOrigins: [process.env.CORS_ORIGIN],
          ExposeHeaders: ["x-amz-server-side-encryption"],
          MaxAgeSeconds: 3000,
        },
        {
          AllowedHeaders: ["Authorization"],
          AllowedMethods: ["GET"],
          AllowedOrigins: ["*"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
    ContentMD5: "",
  };
  const command = new PutBucketCorsCommand(input);
  await client.send(command);
};

export const uploadFileToS3 = async (file) => {
  const fileContent = fs.readFileSync(file?.path);
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: file?.filename,
    Body: fileContent,
  });
  try {
    await client.send(command);
    // console.log(finalres);
    return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${file.filename}`;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
