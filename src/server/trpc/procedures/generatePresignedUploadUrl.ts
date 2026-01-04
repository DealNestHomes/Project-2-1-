import { z } from "zod";
import { baseProcedure } from "~/server/trpc/main";
import { getMinioClient } from "~/server/minio";

export const generatePresignedUploadUrl = baseProcedure
  .input(
    z.object({
      filename: z.string().min(1, "Filename is required"),
    })
  )
  .mutation(async ({ input }) => {
    const bucketName = "purchase-agreements";

    // Generate a unique object key with timestamp to avoid collisions
    const timestamp = Date.now();
    const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const objectKey = `public/${timestamp}-${sanitizedFilename}`;

    // Generate presigned URL valid for 15 minutes
    const presignedUrl = await getMinioClient().presignedPutObject(
      bucketName,
      objectKey,
      15 * 60 // 15 minutes in seconds
    );

    return {
      presignedUrl,
      objectKey,
    };
  });
