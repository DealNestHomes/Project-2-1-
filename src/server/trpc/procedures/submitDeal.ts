import { z } from "zod";
import { db } from "~/server/db";
import { baseProcedure } from "~/server/trpc/main";
import { sendDealSubmissionNotification, sendSubmitterConfirmationEmail } from "~/server/utils/email";

export const submitDeal = baseProcedure
  .input(
    z.object({
      // Contact Information - STRICTLY REQUIRED (no Unknown allowed)
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Valid email is required"),
      phone: z.string()
        .min(1, "Phone is required")
        .transform((val) => val.replace(/\D/g, ""))
        .refine(
          (val) => val.length === 10,
          "Phone number must be exactly 10 digits"
        ),

      // Seller Information - STRICTLY REQUIRED (no Unknown allowed)
      sellerName: z.string().min(1, "Seller name is required"),
      sellerEmail: z.string().email("Valid seller email is required"),
      sellerPhone: z.string()
        .min(1, "Seller phone is required")
        .transform((val) => val.replace(/\D/g, ""))
        .refine(
          (val) => val.length === 10,
          "Phone number must be exactly 10 digits"
        ),

      // Basic Property Information
      propertyAddress: z.string().min(1, "Property address is required"),
      zipCode: z.string().min(1, "ZIP code is required"),
      propertyType: z.union([
        z.string().min(1, "Property type is required"),
        z.literal("Unknown"),
      ]),

      // Property Specifications - MANDATORY but allow Unknown
      bedrooms: z.union([z.number().int().min(0), z.literal("Unknown")]),
      baths: z.union([z.number().int().min(0), z.literal("Unknown")]),
      halfBaths: z.union([z.number().int().min(0), z.literal("Unknown")]),
      squareFootage: z.union([z.number().int().min(0), z.literal("Unknown")]),
      lotSize: z.union([z.number().min(0), z.literal("Unknown")]),
      lotSizeUnit: z.union([z.string().min(1), z.literal("Unknown")]),
      yearBuilt: z.union([z.number().int().min(1800).max(new Date().getFullYear() + 1), z.literal("Unknown")]),

      // Deal Details - MANDATORY but allow Unknown for descriptive fields
      closingDate: z.string().min(1, "Closing date is required").date("Closing date must be a valid date"),
      inspectionPeriodExpiration: z.union([z.string().date(), z.literal("Unknown")]),
      occupancy: z.union([z.string().min(1), z.literal("Unknown")]),
      propertyCondition: z.union([
        z.enum(["Full Rehab", "Major Repairs", "Light Rehab", "Turnkey"]),
        z.literal("Unknown"),
      ]),

      // Repair & System Details - MANDATORY but allow Unknown
      repairEstimateMin: z.union([z.string().min(1), z.literal("Unknown")]),
      repairEstimateMax: z.union([z.string().min(1), z.literal("Unknown")]),
      roofAge: z.union([z.enum(["0-5", "6-10", "11-20", "20+"]), z.literal("Unknown")]),
      acType: z.union([z.string().min(1), z.literal("Unknown")]),
      heatingSystemType: z.union([
        z.enum(["Furnace", "Boiler", "Heat Pump", "Baseboard"]),
        z.literal("Unknown"),
      ]),
      heatingSystemAge: z.union([z.enum(["0-5", "6-10", "11-20", "20+"]), z.literal("Unknown")]),
      foundationType: z.union([z.string().min(1), z.literal("Unknown")]),
      foundationCondition: z.union([
        z.enum(["Excellent", "Good", "Fair", "Poor"]),
        z.literal("Unknown"),
      ]),
      parkingType: z.union([
        z.enum(["Attached Garage", "Detached Garage", "Driveway", "Carport", "Street", "Unassigned"]),
        z.literal("Unknown"),
      ]),

      // Financial Details - REQUIRED fields
      arv: z.string().min(1, "ARV is required").regex(/^[\d,\.]+$/, "ARV must contain only numbers"),
      estimatedRepairs: z.string().min(1, "Estimated repairs is required").regex(/^[\d,\.]+$/, "Estimated repairs must contain only numbers"),
      contractPrice: z.string().min(1, "Contract price is required").regex(/^[\d,\.]+$/, "Contract price must contain only numbers"),

      // Additional Information - MANDATORY but allow Unknown
      additionalInfo: z.union([z.string().min(1), z.literal("Unknown")]),
      propertyAccess: z.union([z.string().min(1), z.literal("Unknown")]),
      photoLink: z.union([z.string().min(1), z.literal("Unknown"), z.literal("")]),
      photosNeeded: z.boolean(),
      lockboxNeeded: z.boolean(),
      purchaseAgreementKey: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      // Helper function to parse YYYY-MM-DD string as UTC midnight
      // This ensures consistent date storage in the database
      const parseUTCDate = (dateString: string): Date => {
        const parts = dateString.split("-");
        const year = parseInt(parts[0] || "0", 10);
        const month = parseInt(parts[1] || "1", 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2] || "1", 10);
        return new Date(Date.UTC(year, month, day));
      };

      // Helper function to convert "Unknown" to undefined for database storage
      const unknownToUndefined = <T,>(value: T | "Unknown"): T | undefined => {
        return value === "Unknown" ? undefined : value;
      };

      // Helper function to convert "Unknown" dates to undefined
      const unknownDateToUndefined = (value: string | "Unknown"): Date | undefined => {
        return value === "Unknown" ? undefined : parseUTCDate(value);
      };

      const dealSubmission = await db.dealSubmission.create({
        data: {
          // Contact Information
          name: input.name,
          email: input.email,
          phone: input.phone,

          // Seller Information
          sellerName: input.sellerName,
          sellerEmail: input.sellerEmail,
          sellerPhone: input.sellerPhone,

          // Basic Property Information
          propertyAddress: input.propertyAddress,
          zipCode: input.zipCode,
          propertyType: unknownToUndefined(input.propertyType) || "Unknown",

          // Property Specifications
          bedrooms: unknownToUndefined(input.bedrooms),
          baths: unknownToUndefined(input.baths),
          halfBaths: unknownToUndefined(input.halfBaths),
          squareFootage: unknownToUndefined(input.squareFootage),
          lotSize: unknownToUndefined(input.lotSize),
          lotSizeUnit: unknownToUndefined(input.lotSizeUnit),
          yearBuilt: unknownToUndefined(input.yearBuilt),

          // Deal Details
          closingDate: parseUTCDate(input.closingDate),
          inspectionPeriodExpiration: unknownDateToUndefined(input.inspectionPeriodExpiration),
          occupancy: unknownToUndefined(input.occupancy),
          propertyCondition: unknownToUndefined(input.propertyCondition),

          // Repair & System Details
          repairEstimateMin: unknownToUndefined(input.repairEstimateMin),
          repairEstimateMax: unknownToUndefined(input.repairEstimateMax),
          roofAge: unknownToUndefined(input.roofAge),
          acType: unknownToUndefined(input.acType),
          heatingSystemType: unknownToUndefined(input.heatingSystemType),
          heatingSystemAge: unknownToUndefined(input.heatingSystemAge),
          foundationType: unknownToUndefined(input.foundationType),
          foundationCondition: unknownToUndefined(input.foundationCondition),
          parkingType: unknownToUndefined(input.parkingType),

          // Financial Details
          arv: input.arv,
          estimatedRepairs: input.estimatedRepairs,
          contractPrice: input.contractPrice,

          // Additional Information
          additionalInfo: unknownToUndefined(input.additionalInfo),
          propertyAccess: unknownToUndefined(input.propertyAccess),
          photoLink: unknownToUndefined(input.photoLink),
          photosNeeded: input.photosNeeded,
          lockboxNeeded: input.lockboxNeeded,
          purchaseAgreementKey: input.purchaseAgreementKey,

          status: "new",
        },
      });

      // Send real-time email notification immediately after successful submission
      // This fires synchronously to ensure 100% delivery with no delays for Zapier integration
      await sendDealSubmissionNotification({
        ...input,
        submissionId: dealSubmission.id,
      });

      // Send confirmation email to the submitter
      await sendSubmitterConfirmationEmail({
        ...input,
        submissionId: dealSubmission.id,
      });

      return {
        success: true,
        submissionId: dealSubmission.id,
      };
    } catch (error) {
      console.error("ERROR in submitDeal mutation:", error);
      throw error;
    }
  });
