import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";
import { sendDealDescriptionToZapier } from "~/server/utils/zapier";

export const sendDealDescription = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
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
    await sendDealDescriptionToZapier(deal);

    // Update the database to record when the description was sent
    await db.dealSubmission.update({
      where: { id: input.dealId },
      data: { sentDealDescriptionAt: new Date() },
    });

    return {
      success: true,
      message: "Deal description sent successfully",
    };
  });
