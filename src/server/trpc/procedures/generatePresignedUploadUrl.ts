import { z } from "zod";
import { baseProcedure } from "~/server/trpc/main";
import { getSupabaseClient } from "~/server/supabase";

export const generatePresignedUploadUrl = baseProcedure
  .input(
    z.object({
      filename: z.string().min(1, "Filename is required"),
    })
  )
  .mutation(async ({ input }) => {
    const bucketName = "purchase-agreements";
    const supabase = getSupabaseClient();

    // Generate a unique object key with timestamp to avoid collisions
    const timestamp = Date.now();
    const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const objectKey = `${timestamp}-${sanitizedFilename}`;

    // Generate signed upload URL (valid for 60 minutes)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(objectKey);

    if (error || !data) {
      throw new Error(`Failed to generate upload URL: ${error?.message || 'Unknown error'}`);
    }

    return {
      presignedUrl: data.signedUrl,
      objectKey: data.path,
    };
  });
