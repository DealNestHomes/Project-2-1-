import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { requireAdmin } from "~/server/utils/auth";

export const updateDealDocument = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
      documentType: z.enum(["jv", "purchase", "assignment"]),
      objectKey: z.string().nullable(), // null to clear the document
    })
  )
  .mutation(async ({ input }) => {
    // Require admin authentication
    requireAdmin(input.authToken);

    // Verify the deal exists
    const deal = await db.dealSubmission.findUnique({
      where: { id: input.dealId },
    });

    if (!deal) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Deal not found",
      });
    }

    // Determine which field to update based on documentType
    const updateData: Record<string, string | null> = {};
    
    if (input.documentType === "jv") {
      updateData.jvAgreementKey = input.objectKey;
    } else if (input.documentType === "purchase") {
      updateData.purchaseAgreementKey = input.objectKey;
    } else if (input.documentType === "assignment") {
      updateData.assignmentAgreementKey = input.objectKey;
    }

    // Update the deal with the new document key
    await db.dealSubmission.update({
      where: { id: input.dealId },
      data: updateData,
    });

    return {
      success: true,
      message: `${input.documentType.toUpperCase()} Agreement ${input.objectKey ? 'uploaded' : 'removed'} successfully`,
    };
  });
