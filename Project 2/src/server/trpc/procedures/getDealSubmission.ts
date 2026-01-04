import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";

export const getDealSubmission = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
    }),
  )
  .query(async ({ input }) => {
    // Verify authentication
    requireAdmin(input.authToken);

    const deal = await db.dealSubmission.findUnique({
      where: { id: input.dealId },
    });

    if (!deal) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Deal not found",
      });
    }

    return deal;
  });
