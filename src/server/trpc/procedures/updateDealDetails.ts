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

export const updateDealDetails = baseProcedure
  .input(
    z.object({
      authToken: z.string(),
      dealId: z.number(),
      // Contact Information
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      // Seller Information
      sellerName: z.string().optional(),
      sellerPhone: z.string().optional(),
      sellerEmail: z.string().email().optional(),
      // Basic Property Information
      propertyAddress: z.string().optional(),
      zipCode: z.string().optional(),
      propertyType: z.string().optional(),
      // Property Specifications
      bedrooms: z.number().optional().nullable(),
      baths: z.number().optional().nullable(),
      halfBaths: z.number().optional().nullable(),
      squareFootage: z.number().optional().nullable(),
      lotSize: z.number().optional().nullable(),
      lotSizeUnit: z.string().optional().nullable(),
      yearBuilt: z.number().optional().nullable(),
      // Deal Details
      closingDate: z.string().optional().nullable(), // ISO date string
      inspectionPeriodExpiration: z.string().optional().nullable(), // ISO date string
      occupancy: z.string().optional().nullable(),
      propertyCondition: z.string().optional().nullable(),
      // Repair & System Details
      repairEstimateMin: z.string().optional().nullable(),
      repairEstimateMax: z.string().optional().nullable(),
      roofAge: z.string().optional().nullable(),
      acType: z.string().optional().nullable(),
      heatingSystemType: z.string().optional().nullable(),
      heatingSystemAge: z.string().optional().nullable(),
      foundationType: z.string().optional().nullable(),
      foundationCondition: z.string().optional().nullable(),
      parkingType: z.string().optional().nullable(),
      // Financial Details
      contractPrice: z.string().optional(),
      arv: z.string().optional(),
      estimatedRepairs: z.string().optional(),
      // Assignment Details
      assignmentProfit: z.string().optional().nullable(),
      buyerName: z.string().optional().nullable(),
      buyerPhone: z.string().optional().nullable(),
      buyerEmail: z.string().email().optional().nullable().or(z.literal("")),
      // Additional Information
      additionalInfo: z.string().optional().nullable(),
      propertyAccess: z.string().optional().nullable(),
      photoLink: z.string().optional().nullable(),
      photosNeeded: z.boolean().optional(),
      lockboxNeeded: z.boolean().optional(),
      // Status tracking
      status: z.string().optional(),
      staffNotes: z.string().optional(),
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

    // Prepare update data - only include fields that were provided
    const updateData: any = {};

    // Contact Information
    if (input.name !== undefined) updateData.name = input.name;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.phone !== undefined) updateData.phone = input.phone;

    // Seller Information
    if (input.sellerName !== undefined) updateData.sellerName = input.sellerName;
    if (input.sellerPhone !== undefined) updateData.sellerPhone = input.sellerPhone;
    if (input.sellerEmail !== undefined) updateData.sellerEmail = input.sellerEmail;

    // Basic Property Information
    if (input.propertyAddress !== undefined) updateData.propertyAddress = input.propertyAddress;
    if (input.zipCode !== undefined) updateData.zipCode = input.zipCode;
    if (input.propertyType !== undefined) updateData.propertyType = input.propertyType;

    // Property Specifications
    if (input.bedrooms !== undefined) updateData.bedrooms = input.bedrooms;
    if (input.baths !== undefined) updateData.baths = input.baths;
    if (input.halfBaths !== undefined) updateData.halfBaths = input.halfBaths;
    if (input.squareFootage !== undefined) updateData.squareFootage = input.squareFootage;
    if (input.lotSize !== undefined) updateData.lotSize = input.lotSize;
    if (input.lotSizeUnit !== undefined) updateData.lotSizeUnit = input.lotSizeUnit;
    if (input.yearBuilt !== undefined) updateData.yearBuilt = input.yearBuilt;

    // Deal Details - convert date strings to Date objects
    if (input.closingDate !== undefined) {
      updateData.closingDate = input.closingDate ? parseUTCDate(input.closingDate) : null;
    }
    if (input.inspectionPeriodExpiration !== undefined) {
      updateData.inspectionPeriodExpiration = input.inspectionPeriodExpiration
        ? parseUTCDate(input.inspectionPeriodExpiration)
        : null;
    }
    if (input.occupancy !== undefined) updateData.occupancy = input.occupancy;
    if (input.propertyCondition !== undefined) updateData.propertyCondition = input.propertyCondition;

    // Repair & System Details
    if (input.repairEstimateMin !== undefined) updateData.repairEstimateMin = input.repairEstimateMin;
    if (input.repairEstimateMax !== undefined) updateData.repairEstimateMax = input.repairEstimateMax;
    if (input.roofAge !== undefined) updateData.roofAge = input.roofAge;
    if (input.acType !== undefined) updateData.acType = input.acType;
    if (input.heatingSystemType !== undefined) updateData.heatingSystemType = input.heatingSystemType;
    if (input.heatingSystemAge !== undefined) updateData.heatingSystemAge = input.heatingSystemAge;
    if (input.foundationType !== undefined) updateData.foundationType = input.foundationType;
    if (input.foundationCondition !== undefined) updateData.foundationCondition = input.foundationCondition;
    if (input.parkingType !== undefined) updateData.parkingType = input.parkingType;

    // Financial Details
    if (input.contractPrice !== undefined) updateData.contractPrice = input.contractPrice;
    if (input.arv !== undefined) updateData.arv = input.arv;
    if (input.estimatedRepairs !== undefined) updateData.estimatedRepairs = input.estimatedRepairs;

    // Assignment Details
    if (input.assignmentProfit !== undefined) updateData.assignmentProfit = input.assignmentProfit;
    if (input.buyerName !== undefined) updateData.buyerName = input.buyerName;
    if (input.buyerPhone !== undefined) updateData.buyerPhone = input.buyerPhone;
    if (input.buyerEmail !== undefined) updateData.buyerEmail = input.buyerEmail;

    // Additional Information
    if (input.additionalInfo !== undefined) updateData.additionalInfo = input.additionalInfo;
    if (input.propertyAccess !== undefined) updateData.propertyAccess = input.propertyAccess;
    if (input.photoLink !== undefined) updateData.photoLink = input.photoLink;
    if (input.photosNeeded !== undefined) updateData.photosNeeded = input.photosNeeded;
    if (input.lockboxNeeded !== undefined) updateData.lockboxNeeded = input.lockboxNeeded;

    // Status tracking
    if (input.status !== undefined) updateData.status = input.status;

    // If new notes are provided, append them to existing notes with timestamp
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
