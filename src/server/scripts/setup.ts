import fs from "fs";
import path from "path";

// Manually load .env
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && match[1] && match[2]) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["'](.*)["']$/, "$1"); // remove quotes
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Failed to load .env", e);
}

import { getMinioClient } from "../minio";

async function setup() {
  // Set up Minio bucket for purchase agreements
  const bucketName = "purchase-agreements";

  try {
    const bucketExists = await getMinioClient().bucketExists(bucketName);

    if (!bucketExists) {
      await getMinioClient().makeBucket(bucketName, "us-east-1");
      console.log(`Created Minio bucket: ${bucketName}`);

      // Set bucket policy to allow public read access for files with "public/" prefix
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/public/*`],
          },
        ],
      };

      await getMinioClient().setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`Set public read policy for ${bucketName}/public/*`);
    } else {
      console.log(`Minio bucket already exists: ${bucketName}`);
    }
  } catch (error) {
    console.error(`Error setting up Minio bucket: ${error}`);
    throw error;
  }
}

setup()
  .then(() => {
    console.log("setup.ts complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
