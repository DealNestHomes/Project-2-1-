import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { env } from "~/server/env";
import { generateAuthToken } from "~/server/utils/auth";

export const adminLogin = baseProcedure
  .input(
    z.object({
      password: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    // Verify password against ADMIN_PASSWORD
    if (input.password !== env.ADMIN_PASSWORD) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = generateAuthToken({ role: "admin" });

    return {
      success: true,
      token,
    };
  });
