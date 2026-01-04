import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";
import { sendDealToTcEmail } from "~/server/utils/email";
import { env } from "~/server/env";

export const sendDealToTc = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
      tcEmailOverride: z.string().email().optional(),
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

    // Transform the deal data to match the TC email function's expected format
    const emailData = {
      submissionId: deal.id,
      sellerName: deal.sellerName,
      sellerPhone: deal.sellerPhone,
      sellerEmail: deal.sellerEmail,
      propertyAddress: deal.propertyAddress,
      purchaseAgreementKey: deal.purchaseAgreementKey ?? undefined,
      jvAgreementKey: deal.jvAgreementKey ?? undefined,
      assignmentAgreementKey: deal.assignmentAgreementKey ?? undefined,
      // Assignment/Buyer Information
      buyerName: deal.buyerName ?? undefined,
      buyerPhone: deal.buyerPhone ?? undefined,
      buyerEmail: deal.buyerEmail ?? undefined,
    };

    // Determine the recipient email (use override if provided, otherwise use default)
    const recipientEmail = input.tcEmailOverride || env.TC_EMAIL;

    // Send the email to the transaction coordinator
    await sendDealToTcEmail(emailData, recipientEmail);

    // Update the deal to mark it as sent to TC
    await db.dealSubmission.update({
      where: { id: input.dealId },
      data: { sentToTcAt: new Date() },
    });

    return {
      success: true,
      message: "Deal information sent to transaction coordinator successfully",
    };
  });
