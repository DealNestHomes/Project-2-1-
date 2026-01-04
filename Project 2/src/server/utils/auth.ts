import jwt from "jsonwebtoken";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { env } from "~/server/env";

export function generateAuthToken(payload: { role: string }): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): { role: string } {
  try {
    const verified = jwt.verify(token, env.JWT_SECRET);
    const parsed = z.object({ role: z.string() }).parse(verified);
    return parsed;
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid or expired authentication token",
    });
  }
}

export function requireAdmin(token: string | undefined): void {
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  
  const verified = verifyAuthToken(token);
  
  if (verified.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
}
