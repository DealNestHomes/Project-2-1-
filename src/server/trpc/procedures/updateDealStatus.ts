import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure } from "~/server/trpc/main";
import { db } from "~/server/db";
import { requireAdmin } from "~/server/utils/auth";

// Helper function to parse YYYY-MM-DD string as UTC midnight
// This ensures consistent date storage in the database
const parseUTCDate = (dateString: string): Date => {
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
  const day = parseInt(parts[2], 10);
  return new Date(Date.UTC(year, month, day));
};

export const updateDealStatus = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
      status: z.string(),
      staffNotes: z.string().optional(),
      // Assignment details (required when moving to offer_accepted status)
      closingDate: z.string().optional(), // ISO date string
      assignmentProfit: z.string().optional().refine(
        (val) => !val || /^[\d,\.]+$/.test(val),
        { message: "Assignment profit must contain only numbers" }
      ),
      buyerName: z.string().optional(),
      buyerPhone: z.string().optional(),
      buyerEmail: z.string().email().optional().or(z.literal("")),
    }),
  )
  .mutation(async ({ input }) => {
    // Verify authentication
    requireAdmin(input.authToken);

    // Check if deal exists
    const deal = await db.dealSubmission.findUnique({
      where: { id: input.dealId },
    });

    if (!deal) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Deal not found",
      });
    }

    // Prepare update data
    const updateData: {
      status: string;
      staffNotes?: string;
      closingDate?: Date;
      assignmentProfit?: string;
      buyerName?: string;
      buyerPhone?: string;
      buyerEmail?: string;
    } = {
      status: input.status,
    };

    // Add assignment details if provided
    if (input.closingDate) {
      updateData.closingDate = parseUTCDate(input.closingDate);
    }
    if (input.assignmentProfit) {
      updateData.assignmentProfit = input.assignmentProfit;
    }
    if (input.buyerName) {
      updateData.buyerName = input.buyerName;
    }
    if (input.buyerPhone) {
      updateData.buyerPhone = input.buyerPhone;
    }
    if (input.buyerEmail) {
      updateData.buyerEmail = input.buyerEmail;
    }

    // If new notes are provided, append them to existing notes
    if (input.staffNotes) {
      const timestamp = new Date().toISOString();
      const newNote = `[${timestamp}] ${input.staffNotes}`;
      updateData.staffNotes = deal.staffNotes
        ? `${deal.staffNotes}\n\n${newNote}`
        : newNote;
    }

    // Update the deal
    const updatedDeal = await db.dealSubmission.update({
      where: { id: input.dealId },
      data: updateData,
    });

    return {
      success: true,
      deal: updatedDeal,
    };
  });
