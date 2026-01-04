import { minioClient } from "~/server/minio";

async function setup() {
  // Set up Minio bucket for purchase agreements
  const bucketName = "purchase-agreements";
  
  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
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
      
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
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
