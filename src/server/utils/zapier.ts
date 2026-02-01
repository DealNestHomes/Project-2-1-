import { env } from "~/server/env";
import type { DealSubmission } from "@prisma/client";

/**
 * Sends deal information to InvestorLift via Zapier webhook
 * @param deal - The deal submission to send to InvestorLift
 * @returns Promise that resolves when the webhook call completes
 */
export async function sendToInvestorLift(
  deal: DealSubmission,
): Promise<void> {
  try {
    // Construct the payload with all deal information
    const payload = {
      // Property Identification
      dealId: deal.id,
      propertyAddress: deal.propertyAddress,
      zipCode: deal.zipCode,
      propertyType: deal.propertyType,

      // Property Specifications
      bedrooms: deal.bedrooms,
      baths: deal.baths,
      halfBaths: deal.halfBaths,
      squareFootage: deal.squareFootage,
      lotSize: deal.lotSize,
      lotSizeUnit: deal.lotSizeUnit,
      yearBuilt: deal.yearBuilt,

      // Property Condition & Systems
      propertyCondition: deal.propertyCondition,
      occupancy: deal.occupancy,
      repairEstimateMin: deal.repairEstimateMin,
      repairEstimateMax: deal.repairEstimateMax,
      roofAge: deal.roofAge,
      acType: deal.acType,
      heatingSystemType: deal.heatingSystemType,
      heatingSystemAge: deal.heatingSystemAge,
      foundationType: deal.foundationType,
      foundationCondition: deal.foundationCondition,
      parkingType: deal.parkingType,

      // Financial Details
      contractPrice: deal.contractPrice,
      arv: deal.arv,
      estimatedRepairs: deal.estimatedRepairs,

      // Timeline
      closingDate: deal.closingDate?.toISOString(),
      inspectionPeriodExpiration: deal.inspectionPeriodExpiration?.toISOString(),

      // Contact Information (Wholesaler/Submitter)
      contactName: deal.name,
      contactEmail: deal.email,
      contactPhone: deal.phone,

      // Seller Information
      sellerName: deal.sellerName,
      sellerPhone: deal.sellerPhone,
      sellerEmail: deal.sellerEmail,

      // Additional Information
      propertyAccess: deal.propertyAccess,
      photoLink: deal.photoLink,
      photosNeeded: deal.photosNeeded,
      lockboxNeeded: deal.lockboxNeeded,
      additionalInfo: deal.additionalInfo,

      // Metadata
      submittedAt: deal.createdAt.toISOString(),
      status: deal.status,
    };

    // Send POST request to Zapier webhook
    const response = await fetch(env.ZAPIER_INVESTORLIFT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send deal to InvestorLift via Zapier. Status: ${response.status}, Response: ${errorText}`,
      );
      throw new Error(
        `Zapier webhook request failed with status ${response.status}`,
      );
    }

    console.log(
      `Successfully sent deal #${deal.id} to InvestorLift via Zapier`,
    );
  } catch (error) {
    console.error("Error sending deal to InvestorLift:", error);
    // Don't throw the error - we don't want to fail the status update if Zapier fails
    // Just log it for monitoring purposes
  }
}

/**
 * Sends JV Agreement information to Zapier webhook
 * @param data - The data to send to Zapier
 * @returns Promise that resolves when the webhook call completes
 */
export async function sendJvAgreementToZapier(data: {
  submission_id: number;
  recipient_name: string;
  recipient_email: string;
  property_address: string;
  llc_name: string;
}): Promise<void> {
  try {
    const payload = {
      ...data,
      doc_type: "JV_AGREEMENT",
    };

    const response = await fetch(env.JV_AGREEMENT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send JV Agreement to Zapier. Status: ${response.status}, Response: ${errorText}`,
      );
      throw new Error(
        `Zapier webhook request failed with status ${response.status}`,
      );
    }

    console.log(
      `Successfully sent JV Agreement request for deal #${data.submission_id} to Zapier`,
    );
  } catch (error) {
    console.error("Error sending JV Agreement to Zapier:", error);
    throw error;
  }
}
/**
 * Sends Deal Description information to Zapier webhook
 * @param deal - The deal submission to send to Zapier
 * @returns Promise that resolves when the webhook call completes
 */
export async function sendDealDescriptionToZapier(
  deal: DealSubmission
): Promise<void> {
  try {
    const payload = {
      // Basic Property Info
      submission_id: deal.id,
      propertyAddress: deal.propertyAddress,
      zipCode: deal.zipCode,
      propertyType: deal.propertyType,
      bedrooms: deal.bedrooms,
      baths: deal.baths,
      halfBaths: deal.halfBaths,
      squareFootage: deal.squareFootage,
      lotSize: deal.lotSize,
      lotSizeUnit: deal.lotSizeUnit,
      yearBuilt: deal.yearBuilt,

      // Financials
      contractPrice: deal.contractPrice,
      arv: deal.arv,
      estimatedRepairs: deal.estimatedRepairs,

      // Condition
      propertyCondition: deal.propertyCondition,
      occupancy: deal.occupancy,
      repairEstimateMin: deal.repairEstimateMin,
      repairEstimateMax: deal.repairEstimateMax,
      roofAge: deal.roofAge,
      acType: deal.acType,
      heatingSystemType: deal.heatingSystemType,
      heatingSystemAge: deal.heatingSystemAge,
      foundationType: deal.foundationType,
      foundationCondition: deal.foundationCondition,
      parkingType: deal.parkingType,

      // Access & Additional
      propertyAccess: deal.propertyAccess,
      photoLink: deal.photoLink,
      photosNeeded: deal.photosNeeded,
      lockboxNeeded: deal.lockboxNeeded,
      additionalInfo: deal.additionalInfo,

      // Metadata
      doc_type: "DEAL_DESCRIPTION",
      sentAt: new Date().toISOString()
    };

    const response = await fetch(env.DEAL_DESCRIPTION_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to send Deal Description to Zapier. Status: ${response.status}, Response: ${errorText}`,
      );
      throw new Error(
        `Zapier webhook request failed with status ${response.status}`,
      );
    }

    console.log(
      `Successfully sent Deal Description for deal #${deal.id} to Zapier`,
    );
  } catch (error) {
    console.error("Error sending Deal Description to Zapier:", error);
    throw error;
  }
}
