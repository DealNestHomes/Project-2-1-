import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";
import { sendJvAgreementToZapier } from "~/server/utils/zapier";

export const sendJvAgreement = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
      recipientName: z.string().min(1, "Recipient name is required"),
      recipientEmail: z.string().email("Valid recipient email is required"),
      llcName: z.string().min(1, "LLC name is required"),
    }),
  )
  .mutation(async ({ input }) => {
    // Verify authentication
    requireAdmin(input.authToken);

    // Fetch the deal from the database
    const deal = await db.dealSubmission.findUnique({
      where: { id: input.dealId },
    });

    if (!deal) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Deal not found",
      });
    }

    // Forward to Zapier
    await sendJvAgreementToZapier({
      submission_id: deal.id,
      recipient_name: input.recipientName,
      recipient_email: input.recipientEmail,
      property_address: deal.propertyAddress,
      llc_name: input.llcName,
    });

    // Update the deal to mark it as sent to JV
    await db.dealSubmission.update({
      where: { id: input.dealId },
      data: { sentJvAgreementAt: new Date() },
    });

    return {
      success: true,
      message: "JV Agreement request sent and recorded successfully",
    };
  });
