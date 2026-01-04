import { z } from "zod";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";

export const listDealSubmissions = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      status: z.string().optional(),
      cursor: z.number().optional(),
      limit: z.number().min(1).max(100).default(20),
    }),
  )
  .query(async ({ input }) => {
    // Verify authentication
    requireAdmin(input.authToken);

    const { status, cursor, limit } = input;

    // Build where clause
    const where = status ? { status } : {};

    // Fetch deals with pagination
    const deals = await db.dealSubmission.findMany({
      where,
      take: limit + 1, // Fetch one extra to determine if there are more
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    let nextCursor: number | undefined = undefined;
    if (deals.length > limit) {
      const nextItem = deals.pop();
      nextCursor = nextItem?.id;
    }

    return {
      deals,
      nextCursor,
    };
  });
