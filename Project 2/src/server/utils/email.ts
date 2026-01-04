import nodemailer from "nodemailer";
import { env } from "~/server/env";
import { getBaseUrl } from "~/server/utils/base-url";
import { minioBaseUrl } from "~/server/minio";

type DealSubmissionData = {
  submissionId: number;
  // Contact Information
  name: string;
  email: string;
  phone: string;
  
  // Seller Information
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  
  // Basic Property Information
  propertyAddress: string;
  zipCode: string;
  propertyType: string;
  
  // Property Specifications
  bedrooms?: number;
  baths?: number;
  halfBaths?: number;
  squareFootage?: number;
  lotSize?: number;
  lotSizeUnit?: string;
  yearBuilt?: number;
  
  // Deal Details
  closingDate: string;
  inspectionPeriodExpiration: string;
  occupancy?: string;
  propertyCondition?: string;
  
  // Repair & System Details
  repairEstimateMin?: string;
  repairEstimateMax?: string;
  roofAge?: string;
  acType?: string;
  heatingSystemType?: string;
  heatingSystemAge?: string;
  foundationType?: string;
  foundationCondition?: string;
  parkingType?: string;
  
  // Financial Details
  arv: string;
  estimatedRepairs: string;
  contractPrice: string;
  
  // Additional Information
  additionalInfo?: string;
  propertyAccess?: string;
  photoLink?: string;
  purchaseAgreementKey?: string;
};

type TcEmailData = {
  submissionId: number;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  propertyAddress: string;
  purchaseAgreementKey?: string;
  jvAgreementKey?: string;
  assignmentAgreementKey?: string;
  // Assignment/Buyer Information
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
};

function formatValue(value: unknown): string {
  if (value === "Unknown") {
    return "Unknown";
  }
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }
  return String(value);
}

function formatCurrency(value: string | undefined): string {
  if (value === "Unknown") {
    return "Unknown";
  }
  if (!value) return "Not provided";
  // Remove any existing currency symbols and commas
  const cleanValue = value.replace(/[$,]/g, "");
  const numValue = parseFloat(cleanValue);
  if (isNaN(numValue)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

function calculateSpread(arv: string, repairs: string, contractPrice: string): string {
  try {
    // Parse currency values by removing $ and commas
    const parseAmount = (value: string): number => {
      if (value === "Unknown" || !value) return 0;
      const cleaned = value.replace(/[$,]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    const arvNum = parseAmount(arv);
    const repairsNum = parseAmount(repairs);
    const contractPriceNum = parseAmount(contractPrice);

    // Calculate spread: ARV - Repairs - Contract Price
    const spread = arvNum - repairsNum - contractPriceNum;

    return formatCurrency(spread.toString());
  } catch (error) {
    return "Unable to calculate";
  }
}

function formatBedsAndBaths(bedrooms: number | undefined, baths: number | undefined, halfBaths: number | undefined): string {
  const beds = bedrooms ?? 0;
  const fullBaths = baths ?? 0;
  const half = halfBaths ?? 0;
  
  // Format as "X / Y" or "X / Y.5" if there are half baths
  const bathsDisplay = half > 0 ? `${fullBaths}.${half}` : `${fullBaths}`;
  
  return `${beds} / ${bathsDisplay}`;
}

function formatDealSubmissionEmail(data: DealSubmissionData): string {
  // Helper function to format dates, matching ReviewSummaryStep logic
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not provided";
    if (dateString === "Unknown") return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format repair estimate range
  const formatRepairRange = (min: string | undefined, max: string | undefined): string => {
    if (!min && !max) return "Not provided";
    if (min === "Unknown" || max === "Unknown") {
      if (min === "Unknown" && max === "Unknown") return "Unknown";
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  // Helper function to format lot size
  const formatLotSize = (size: number | undefined, unit: string | undefined): string => {
    if (!size) return "Not provided";
    const unitStr = unit || "";
    return `${size} ${unitStr}`.trim();
  };

  // Helper function to format square footage
  const formatSquareFootage = (sqft: number | undefined): string => {
    if (!sqft) return "Not provided";
    return `${sqft.toLocaleString()} sq ft`;
  };

  // Helper to create aligned field rows
  const formatField = (label: string, value: unknown): string => {
    const paddedLabel = label.padEnd(35, " ");
    return `  ${paddedLabel} ${formatValue(value)}`;
  };

  // Define all 8 sections matching ReviewSummaryStep
  const sections = [
    {
      title: "YOUR CONTACT INFORMATION",
      fields: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
      ],
    },
    {
      title: "PROPERTY LOCATION",
      fields: [
        { label: "Address", value: data.propertyAddress },
        { label: "ZIP Code", value: data.zipCode },
        { label: "Property Type", value: data.propertyType },
      ],
    },
    {
      title: "PROPERTY DETAILS",
      fields: [
        { label: "Bedrooms", value: data.bedrooms },
        { label: "Full Bathrooms", value: data.baths },
        { label: "Half Bathrooms", value: data.halfBaths },
        { label: "Square Footage", value: formatSquareFootage(data.squareFootage) },
        { label: "Year Built", value: data.yearBuilt },
        { label: "Parking Type", value: data.parkingType },
        { label: "Lot Size", value: formatLotSize(data.lotSize, data.lotSizeUnit) },
      ],
    },
    {
      title: "DEAL TIMELINE",
      fields: [
        { label: "Closing Date", value: formatDate(data.closingDate) },
        { label: "Inspection Period Expiration", value: formatDate(data.inspectionPeriodExpiration) },
        { label: "Occupancy Status", value: data.occupancy },
      ],
    },
    {
      title: "PROPERTY CONDITION & SYSTEMS",
      fields: [
        { label: "Overall Condition", value: data.propertyCondition },
        { label: "Repair Estimate Range", value: formatRepairRange(data.repairEstimateMin, data.repairEstimateMax) },
        { label: "Roof Age", value: data.roofAge },
        { label: "AC Type", value: data.acType },
        { label: "Heating System Type", value: data.heatingSystemType },
        { label: "Heating System Age", value: data.heatingSystemAge },
        { label: "Foundation Type", value: data.foundationType },
        { label: "Foundation Condition", value: data.foundationCondition },
      ],
    },
    {
      title: "FINANCIAL DETAILS",
      fields: [
        { label: "ARV (After Repair Value)", value: formatCurrency(data.arv) },
        { label: "Estimated Repairs", value: formatCurrency(data.estimatedRepairs) },
        { label: "Contract Price", value: formatCurrency(data.contractPrice) },
      ],
    },
    {
      title: "SELLER INFORMATION",
      fields: [
        { label: "Seller Name", value: data.sellerName },
        { label: "Seller Email", value: data.sellerEmail },
        { label: "Seller Phone", value: data.sellerPhone },
      ],
    },
    {
      title: "ADDITIONAL INFORMATION",
      fields: [
        { label: "Additional Notes", value: data.additionalInfo },
        { label: "Property Access Instructions", value: data.propertyAccess },
        { label: "Photo Link", value: data.photoLink },
        { label: "Purchase Agreement", value: data.purchaseAgreementKey ? `${minioBaseUrl}/purchase-agreements/${data.purchaseAgreementKey}` : undefined },
      ],
    },
  ];

  let emailBody = "";
  
  // Header
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "                        NEW DEAL SUBMISSION\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n";
  emailBody += `  Property Address         ${data.propertyAddress}\n`;
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n\n";

  // Sections
  for (const section of sections) {
    emailBody += "┌" + "─".repeat(78) + "┐\n";
    emailBody += `│ ${section.title.padEnd(76, " ")} │\n`;
    emailBody += "└" + "─".repeat(78) + "┘\n";
    emailBody += "\n";
    
    for (const field of section.fields) {
      emailBody += formatField(field.label, field.value) + "\n";
    }
    
    emailBody += "\n\n";
  }

  // Footer
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n";
  emailBody += `  Submitted on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
  emailBody += `  at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}\n`;
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";

  return emailBody;
}

function formatTcEmail(data: TcEmailData): string {
  let emailBody = "";
  
  // Header
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "                        DEAL INFORMATION FOR TC\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n";
  emailBody += `  Property Address         ${data.propertyAddress}\n`;
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n\n";

  // Seller Information Section
  emailBody += "┌" + "─".repeat(78) + "┐\n";
  emailBody += `│ SELLER INFORMATION${" ".repeat(58)} │\n`;
  emailBody += "└" + "─".repeat(78) + "┘\n";
  emailBody += "\n";
  emailBody += `  Seller Name                        ${data.sellerName}\n`;
  emailBody += `  Seller Phone                       ${data.sellerPhone}\n`;
  emailBody += `  Seller Email                       ${data.sellerEmail}\n`;
  emailBody += "\n\n";

  // Buyer Information Section
  emailBody += "┌" + "─".repeat(78) + "┐\n";
  emailBody += `│ BUYER INFORMATION${" ".repeat(59)} │\n`;
  emailBody += "└" + "─".repeat(78) + "┘\n";
  emailBody += "\n";
  emailBody += `  Buyer Name                         ${data.buyerName || "Not provided"}\n`;
  emailBody += `  Buyer Phone                        ${data.buyerPhone || "Not provided"}\n`;
  emailBody += `  Buyer Email                        ${data.buyerEmail || "Not provided"}\n`;
  emailBody += "\n\n";

  // Purchase Agreement Section
  emailBody += "┌" + "─".repeat(78) + "┐\n";
  emailBody += `│ PURCHASE AGREEMENT${" ".repeat(58)} │\n`;
  emailBody += "└" + "─".repeat(78) + "┘\n";
  emailBody += "\n";
  if (data.purchaseAgreementKey) {
    const agreementUrl = `${minioBaseUrl}/purchase-agreements/${data.purchaseAgreementKey}`;
    emailBody += `  Download Link                      ${agreementUrl}\n`;
  } else {
    emailBody += `  Download Link                      Not provided\n`;
  }
  emailBody += "\n\n";

  // Assignment Contract Section
  emailBody += "┌" + "─".repeat(78) + "┐\n";
  emailBody += `│ ASSIGNMENT CONTRACT${" ".repeat(57)} │\n`;
  emailBody += "└" + "─".repeat(78) + "┘\n";
  emailBody += "\n";
  if (data.assignmentAgreementKey) {
    const agreementUrl = `${minioBaseUrl}/purchase-agreements/${data.assignmentAgreementKey}`;
    emailBody += `  Download Link                      ${agreementUrl}\n`;
  } else {
    emailBody += `  Download Link                      Not provided\n`;
  }
  emailBody += "\n\n";

  // JV Agreement Section
  emailBody += "┌" + "─".repeat(78) + "┐\n";
  emailBody += `│ JV AGREEMENT${" ".repeat(64)} │\n`;
  emailBody += "└" + "─".repeat(78) + "┘\n";
  emailBody += "\n";
  if (data.jvAgreementKey) {
    const agreementUrl = `${minioBaseUrl}/purchase-agreements/${data.jvAgreementKey}`;
    emailBody += `  Download Link                      ${agreementUrl}\n`;
  } else {
    emailBody += `  Download Link                      Not provided\n`;
  }
  emailBody += "\n\n";

  // Footer
  emailBody += "═".repeat(80) + "\n";
  emailBody += "\n";
  emailBody += `  Sent on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
  emailBody += `  at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}\n`;
  emailBody += "\n";
  emailBody += "═".repeat(80) + "\n";

  return emailBody;
}

function generateDealSubmissionHtmlBody(data: DealSubmissionData): string {
  const baseUrl = getBaseUrl();
  const dealUrl = `${baseUrl}/staff/${data.submissionId}`;
  
  // Calculate the spread
  const spread = calculateSpread(data.arv, data.estimatedRepairs, data.contractPrice);
  
  const formatHtmlValue = (value: unknown): string => {
    if (value === "Unknown") {
      return '<span style="color: #6b7280;">Unknown</span>';
    }
    if (value === null || value === undefined || value === "") {
      return '<span style="color: #9ca3af; font-style: italic;">Not provided</span>';
    }
    return String(value);
  };

  const renderSection = (title: string, fields: Array<{ label: string; value: unknown; isCurrency?: boolean }>) => {
    const rows = fields
      .map(({ label, value, isCurrency }) => {
        const formattedValue = isCurrency && typeof value === "string" 
          ? formatCurrency(value)
          : formatHtmlValue(value);
        
        return `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 200px;">
              ${label}
            </td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
              ${formattedValue}
            </td>
          </tr>
        `;
      })
      .join("");

    return `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; font-weight: 700; color: #1f2937; margin: 0 0 12px 0; padding: 8px 12px; background-color: #f3f4f6; border-left: 4px solid #3b82f6;">
          ${title}
        </h2>
        <table style="width: 100%; border-collapse: collapse; background-color: white;">
          ${rows}
        </table>
      </div>
    `;
  };

  const sections = [
    {
      title: "Section 1 – Property",
      fields: [
        { label: "Street Address", value: data.propertyAddress },
        { label: "ZIP Code", value: data.zipCode },
        { label: "Property Type", value: data.propertyType },
        { label: "Beds / Baths", value: formatBedsAndBaths(data.bedrooms, data.baths, data.halfBaths) },
        { label: "Square Footage", value: data.squareFootage ? `${data.squareFootage.toLocaleString()} sq ft` : undefined },
        { label: "Lot Size", value: data.lotSize ? `${data.lotSize} ${data.lotSizeUnit || ""}`.trim() : undefined },
        { label: "Parking Type", value: data.parkingType },
      ],
    },
    {
      title: "Section 2 – Deal Numbers",
      fields: [
        { label: "ARV", value: data.arv, isCurrency: true },
        { label: "Estimated Repairs", value: data.estimatedRepairs, isCurrency: true },
        { label: "Contract Price", value: data.contractPrice, isCurrency: true },
        { label: "Calculated Spread", value: spread },
      ],
    },
    {
      title: "Section 3 – Timeline",
      fields: [
        { label: "Closing Date", value: data.closingDate === "Unknown" ? "Unknown" : new Date(data.closingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
        { label: "Inspection Expiration", value: data.inspectionPeriodExpiration === "Unknown" ? "Unknown" : new Date(data.inspectionPeriodExpiration).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
      ],
    },
    {
      title: "Section 4 – Condition",
      fields: [
        { label: "Overall Condition", value: data.propertyCondition },
        { label: "Roof Age", value: data.roofAge },
        { label: "Heating System Age", value: data.heatingSystemAge },
      ],
    },
    {
      title: "Section 5 – Seller Information",
      fields: [
        { label: "Seller Full Name", value: data.sellerName },
        { label: "Seller Phone", value: data.sellerPhone },
        { label: "Seller Email", value: data.sellerEmail },
      ],
    },
    {
      title: "Section 6 – Submitter (JV)",
      fields: [
        { label: "Your Name", value: data.name },
        { label: "Your Phone", value: data.phone },
        { label: "Your Email", value: data.email },
      ],
    },
  ];

  const sectionsHtml = sections.map(section => renderSection(section.title, section.fields)).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Deal Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 32px 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">
            New Deal Submission
          </h1>
          <p style="margin: 12px 0 0 0; color: #dbeafe; font-size: 16px;">
            ${data.propertyAddress}
          </p>
        </div>

        <!-- Action Button -->
        <div style="background-color: #eff6ff; padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
          <a href="${dealUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            View Deal Details →
          </a>
          <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
            Submission ID: #${data.submissionId}
          </p>
        </div>

        <!-- Content -->
        <div style="background-color: white; padding: 24px; border-radius: 0 0 8px 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          ${sectionsHtml}
          
          <!-- Footer -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">
              Submitted on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateStaffNotificationHtmlBody(data: DealSubmissionData): string {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/dealnest-website-design.png`;

  // Helper function to format dates, matching ReviewSummaryStep logic
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Not provided";
    if (dateString === "Unknown") return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format repair estimate range
  const formatRepairRange = (min: string | undefined, max: string | undefined): string => {
    if (!min && !max) return "Not provided";
    if (min === "Unknown" || max === "Unknown") {
      if (min === "Unknown" && max === "Unknown") return "Unknown";
      return `${formatCurrency(min)} - ${formatCurrency(max)}`;
    }
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  // Helper function to format lot size
  const formatLotSize = (size: number | undefined, unit: string | undefined): string => {
    if (!size) return "Not provided";
    const unitStr = unit || "";
    return `${size} ${unitStr}`.trim();
  };

  // Helper function to format square footage
  const formatSquareFootage = (sqft: number | undefined): string => {
    if (!sqft) return "Not provided";
    return `${sqft.toLocaleString()} sq ft`;
  };

  // Helper to format HTML values with proper styling for Unknown/Not provided
  const formatHtmlValue = (value: unknown): string => {
    if (value === "Unknown") {
      return '<span style="color: #9ca3af; font-style: italic;">Unknown</span>';
    }
    if (value === null || value === undefined || value === "" || value === "Not provided") {
      return '<span style="color: #d1d5db; font-style: italic;">Not provided</span>';
    }
    return String(value);
  };

  // Helper to render a section with fields in a card-style container
  const renderSection = (title: string, fields: Array<{ label: string; value: unknown }>) => {
    const rows = fields
      .map(({ label, value }) => {
        return `
          <tr>
            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
              ${label}
            </td>
            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
              ${formatHtmlValue(value)}
            </td>
          </tr>
        `;
      })
      .join("");

    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
        <tr>
          <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 16px 20px;">
            <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
              ${title}
            </h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
              ${rows}
            </table>
          </td>
        </tr>
      </table>
    `;
  };

  // Define all 8 sections matching formatDealSubmissionEmail exactly
  const sections = [
    {
      title: "YOUR CONTACT INFORMATION",
      fields: [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
      ],
    },
    {
      title: "PROPERTY LOCATION",
      fields: [
        { label: "Address", value: data.propertyAddress },
        { label: "ZIP Code", value: data.zipCode },
        { label: "Property Type", value: data.propertyType },
      ],
    },
    {
      title: "PROPERTY DETAILS",
      fields: [
        { label: "Bedrooms", value: data.bedrooms },
        { label: "Full Bathrooms", value: data.baths },
        { label: "Half Bathrooms", value: data.halfBaths },
        { label: "Square Footage", value: formatSquareFootage(data.squareFootage) },
        { label: "Year Built", value: data.yearBuilt },
        { label: "Parking Type", value: data.parkingType },
        { label: "Lot Size", value: formatLotSize(data.lotSize, data.lotSizeUnit) },
      ],
    },
    {
      title: "DEAL TIMELINE",
      fields: [
        { label: "Closing Date", value: formatDate(data.closingDate) },
        { label: "Inspection Period Expiration", value: formatDate(data.inspectionPeriodExpiration) },
        { label: "Occupancy Status", value: data.occupancy },
      ],
    },
    {
      title: "PROPERTY CONDITION & SYSTEMS",
      fields: [
        { label: "Overall Condition", value: data.propertyCondition },
        { label: "Repair Estimate Range", value: formatRepairRange(data.repairEstimateMin, data.repairEstimateMax) },
        { label: "Roof Age", value: data.roofAge },
        { label: "AC Type", value: data.acType },
        { label: "Heating System Type", value: data.heatingSystemType },
        { label: "Heating System Age", value: data.heatingSystemAge },
        { label: "Foundation Type", value: data.foundationType },
        { label: "Foundation Condition", value: data.foundationCondition },
      ],
    },
    {
      title: "FINANCIAL DETAILS",
      fields: [
        { label: "ARV (After Repair Value)", value: formatCurrency(data.arv) },
        { label: "Estimated Repairs", value: formatCurrency(data.estimatedRepairs) },
        { label: "Contract Price", value: formatCurrency(data.contractPrice) },
      ],
    },
    {
      title: "SELLER INFORMATION",
      fields: [
        { label: "Seller Name", value: data.sellerName },
        { label: "Seller Email", value: data.sellerEmail },
        { label: "Seller Phone", value: data.sellerPhone },
      ],
    },
    {
      title: "ADDITIONAL INFORMATION",
      fields: [
        { label: "Additional Notes", value: data.additionalInfo },
        { label: "Property Access Instructions", value: data.propertyAccess },
        { label: "Photo Link", value: data.photoLink },
        { label: "Purchase Agreement", value: data.purchaseAgreementKey ? `<a href="${minioBaseUrl}/purchase-agreements/${data.purchaseAgreementKey}" style="color: #3b82f6; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener noreferrer">View Purchase Agreement (PDF)</a>` : undefined },
      ],
    },
  ];

  const sectionsHtml = sections.map(section => renderSection(section.title, section.fields)).join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>New Deal Submission</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <!-- Wrapper table for email clients -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
          <td style="padding: 40px 20px;">
            <!-- Main container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);">
              
              <!-- Logo Header -->
              <tr>
                <td style="padding: 48px 40px 40px 40px; text-align: center; background-color: #ffffff;">
                  <img src="${logoUrl}" alt="DealNest" style="width: 220px; height: auto; max-width: 100%; display: block; margin: 0 auto;" />
                </td>
              </tr>

              <!-- Header Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 36px 40px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                  <h1 style="margin: 0 0 12px 0; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em;">
                    New Deal Submission
                  </h1>
                  <p style="margin: 0; color: #dbeafe; font-size: 18px; line-height: 1.4; font-weight: 500;">
                    ${data.propertyAddress}
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 40px 32px 40px; background-color: #fafafa;">
                  ${sectionsHtml}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 32px 40px; text-align: center; border-top: 2px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    Submitted on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                    &copy; ${new Date().getFullYear()} DealNest. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function generateTcEmailHtmlBody(data: TcEmailData): string {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/dealnest-website-design.png`;

  const formatHtmlValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
      return '<span style="color: #d1d5db; font-style: italic;">Not provided</span>';
    }
    return String(value);
  };

  const purchaseAgreementHtml = data.purchaseAgreementKey
    ? `<a href="${minioBaseUrl}/purchase-agreements/${data.purchaseAgreementKey}" style="color: #3b82f6; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener noreferrer">View Document (PDF)</a>`
    : formatHtmlValue(undefined);

  const assignmentAgreementHtml = data.assignmentAgreementKey
    ? `<a href="${minioBaseUrl}/purchase-agreements/${data.assignmentAgreementKey}" style="color: #3b82f6; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener noreferrer">View Document (PDF)</a>`
    : formatHtmlValue(undefined);

  const jvAgreementHtml = data.jvAgreementKey
    ? `<a href="${minioBaseUrl}/purchase-agreements/${data.jvAgreementKey}" style="color: #3b82f6; text-decoration: none; font-weight: 600;" target="_blank" rel="noopener noreferrer">View Document (PDF)</a>`
    : formatHtmlValue(undefined);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Deal Information for TC</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <!-- Wrapper table for email clients -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
          <td style="padding: 40px 20px;">
            <!-- Main container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 800px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);">
              
              <!-- Logo Header -->
              <tr>
                <td style="padding: 48px 40px 40px 40px; text-align: center; background-color: #ffffff;">
                  <img src="${logoUrl}" alt="DealNest" style="width: 220px; height: auto; max-width: 100%; display: block; margin: 0 auto;" />
                </td>
              </tr>

              <!-- Header Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 36px 40px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                  <h1 style="margin: 0 0 12px 0; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.2; letter-spacing: -0.02em;">
                    Deal Information for TC
                  </h1>
                  <p style="margin: 0; color: #dbeafe; font-size: 18px; line-height: 1.4; font-weight: 500;">
                    ${data.propertyAddress}
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 40px 32px 40px; background-color: #fafafa;">
                  
                  <!-- Seller Information Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 16px 20px;">
                        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                          SELLER INFORMATION
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Seller Name
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.sellerName)}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Seller Phone
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.sellerPhone)}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Seller Email
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.sellerEmail)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Buyer Information Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 16px 20px;">
                        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                          BUYER INFORMATION
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Buyer Name
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.buyerName)}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Buyer Phone
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.buyerPhone)}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Buyer Email
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${formatHtmlValue(data.buyerEmail)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Purchase Agreement Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 16px 20px;">
                        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                          PURCHASE AGREEMENT
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Document
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${purchaseAgreementHtml}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Assignment Contract Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 16px 20px;">
                        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                          ASSIGNMENT CONTRACT
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Document
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${assignmentAgreementHtml}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- JV Agreement Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 16px 20px;">
                        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em;">
                          JV AGREEMENT
                        </h2>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                          <tr>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #374151; vertical-align: top; width: 45%; font-size: 14px;">
                              Document
                            </td>
                            <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; color: #1f2937; vertical-align: top; word-break: break-word; font-size: 14px; line-height: 1.6;">
                              ${jvAgreementHtml}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 32px 40px; text-align: center; border-top: 2px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.6; font-weight: 500;">
                    Sent on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                    &copy; ${new Date().getFullYear()} DealNest. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function formatSubmitterConfirmationEmail(data: DealSubmissionData): string {
  let emailBody = "Thank you for submitting your deal to DealNest!\n\n";
  emailBody += "We've successfully received your submission and our team will review it shortly.\n\n";
  emailBody += "=".repeat(70) + "\n\n";
  emailBody += "SUBMISSION DETAILS\n";
  emailBody += "-".repeat(70) + "\n";
  emailBody += `Property Address: ${data.propertyAddress}\n`;
  emailBody += `ZIP Code: ${data.zipCode}\n`;
  emailBody += `Closing Date: ${data.closingDate === "Unknown" ? "Unknown" : new Date(data.closingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
  emailBody += `Inspection Period Expiration: ${data.inspectionPeriodExpiration === "Unknown" ? "Unknown" : new Date(data.inspectionPeriodExpiration).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
  emailBody += `ARV (After Repair Value): ${formatCurrency(data.arv)}\n`;
  emailBody += `Estimated Repairs: ${formatCurrency(data.estimatedRepairs)}\n`;
  emailBody += `Contract Price: ${formatCurrency(data.contractPrice)}\n`;
  emailBody += `Submitted: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}\n`;
  emailBody += "\n";
  emailBody += "=".repeat(70) + "\n\n";
  emailBody += "WHAT HAPPENS NEXT?\n\n";
  emailBody += "Our team will carefully review your submission and reach out to you within 1-2 business days.\n";
  emailBody += "We'll discuss the details of your property and next steps in the process.\n\n";
  emailBody += "=".repeat(70) + "\n\n";
  emailBody += "NEED HELP?\n\n";
  emailBody += "If you have any questions, please contact us:\n";
  emailBody += "Email: contact@dealnesthomes.com\n";
  emailBody += "Phone: (248) 946-1721\n\n";
  emailBody += "Best regards,\n";
  emailBody += "The DealNest Team\n";

  return emailBody;
}

function generateSubmitterConfirmationHtmlBody(data: DealSubmissionData): string {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/dealnest-website-design.png`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Deal Submission Confirmation</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <!-- Wrapper table for email clients -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
          <td style="padding: 40px 20px;">
            <!-- Main container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);">
              
              <!-- Logo Header -->
              <tr>
                <td style="padding: 48px 40px 40px 40px; text-align: center; background-color: #ffffff;">
                  <img src="${logoUrl}" alt="DealNest" style="width: 240px; height: auto; max-width: 100%; display: block; margin: 0 auto;" />
                </td>
              </tr>

              <!-- Success Banner -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 40px 36px 40px; text-align: center; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                  <div style="width: 72px; height: 72px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <div style="font-size: 40px; line-height: 1;">✓</div>
                  </div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em;">
                    Submission Received!
                  </h1>
                  <p style="margin: 16px 0 0 0; color: #dbeafe; font-size: 17px; line-height: 1.5; font-weight: 500;">
                    Thank you for submitting your deal to DealNest
                  </p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 44px 40px 40px 40px;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 15px; line-height: 1.6; font-weight: 500;">
                    Hi there,
                  </p>
                  <p style="margin: 0 0 28px 0; color: #1f2937; font-size: 17px; line-height: 1.6; font-weight: 600;">
                    ${data.name}
                  </p>
                  
                  <p style="margin: 0 0 36px 0; color: #374151; font-size: 16px; line-height: 1.7;">
                    We've successfully received your deal submission and our team is excited to review it. Here's a summary of what you submitted:
                  </p>

                  <!-- Submission Details Card -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fafafa 0%, #f9fafb 100%); border: 2px solid #e5e7eb; border-radius: 12px; margin-bottom: 36px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);">
                    <tr>
                      <td style="padding: 28px 28px 24px 28px;">
                        <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 20px; font-weight: 700; border-bottom: 3px solid #3b82f6; padding-bottom: 14px; display: flex; align-items: center;">
                          <span style="margin-right: 10px; font-size: 24px;">📋</span> Submission Summary
                        </h2>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">Property Address:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 15px; font-weight: 600; border-top: 1px solid #e5e7eb;">${data.propertyAddress}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">ZIP Code:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 15px; border-top: 1px solid #e5e7eb;">${data.zipCode}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">Closing Date:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 15px; border-top: 1px solid #e5e7eb;">${data.closingDate === "Unknown" ? "Unknown" : new Date(data.closingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">Contract Price:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 16px; font-weight: 700; border-top: 1px solid #e5e7eb;">${formatCurrency(data.contractPrice)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">ARV:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 15px; border-top: 1px solid #e5e7eb;">${formatCurrency(data.arv)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-weight: 600; border-top: 1px solid #e5e7eb; vertical-align: top;">Submitted:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 14px; border-top: 1px solid #e5e7eb;">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- What's Next Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 5px solid #3b82f6; border-radius: 10px; margin-bottom: 36px; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                    <tr>
                      <td style="padding: 28px;">
                        <h2 style="margin: 0 0 18px 0; color: #1e40af; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                          <span style="margin-right: 10px; font-size: 26px;">🚀</span> What Happens Next?
                        </h2>
                        <p style="margin: 0 0 14px 0; color: #1e3a8a; font-size: 16px; line-height: 1.7; font-weight: 500;">
                          Our team will carefully review your submission and reach out to you within <strong style="color: #1e40af; font-weight: 700;">1-2 business days</strong>.
                        </p>
                        <p style="margin: 0; color: #1e3a8a; font-size: 16px; line-height: 1.7; font-weight: 500;">
                          We'll discuss the details of your property and walk you through the next steps in our process.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Support Section -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; margin-bottom: 32px; overflow: hidden;">
                    <tr>
                      <td style="padding: 28px;">
                        <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
                          <span style="margin-right: 10px; font-size: 22px;">💬</span> Need Help?
                        </h3>
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
                          If you have any questions or need to update your submission, our team is here to help:
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 10px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                  <td style="width: 40px; vertical-align: middle; padding-right: 14px;">
                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);">
                                      <span style="color: #ffffff; font-size: 18px; line-height: 1;">✉</span>
                                    </div>
                                  </td>
                                  <td style="vertical-align: middle;">
                                    <a href="mailto:contact@dealnesthomes.com" style="color: #3b82f6; text-decoration: none; font-size: 15px; font-weight: 600; display: block;">contact@dealnesthomes.com</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                  <td style="width: 40px; vertical-align: middle; padding-right: 14px;">
                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);">
                                      <span style="color: #ffffff; font-size: 18px; line-height: 1;">📞</span>
                                    </div>
                                  </td>
                                  <td style="vertical-align: middle;">
                                    <a href="tel:+12489461721" style="color: #3b82f6; text-decoration: none; font-size: 15px; font-weight: 600; display: block;">(248) 946-1721</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px; line-height: 1.7;">
                    We appreciate your business and look forward to working with you!
                  </p>
                  
                  <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.7;">
                    <strong style="color: #1f2937; font-weight: 700;">Best regards,</strong><br>
                    <span style="color: #3b82f6; font-weight: 700; font-size: 17px;">The DealNest Team</span>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 28px 40px; text-align: center; border-top: 2px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; line-height: 1.6; font-weight: 500;">
                    This is an automated confirmation email from DealNest.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                    &copy; ${new Date().getFullYear()} DealNest. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendDealSubmissionNotification(
  data: DealSubmissionData
): Promise<void> {
  // Create transporter using SMTP credentials from environment
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  // Format the email body with all submission data
  const textBody = formatDealSubmissionEmail(data);
  const htmlBody = generateStaffNotificationHtmlBody(data);

  // Send the email with both plain text and HTML versions
  await transporter.sendMail({
    from: env.SMTP_USER,
    to: env.DEAL_NOTIFICATION_EMAIL,
    subject: `New Deal Submission - ${data.propertyAddress}`,
    text: textBody,
    html: htmlBody,
  });
}

export async function sendSubmitterConfirmationEmail(
  data: DealSubmissionData
): Promise<void> {
  // Create transporter using SMTP credentials from environment
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  // Format the confirmation email body with submission details
  const textBody = formatSubmitterConfirmationEmail(data);
  const htmlBody = generateSubmitterConfirmationHtmlBody(data);

  // Send the confirmation email to the submitter
  await transporter.sendMail({
    from: env.SMTP_USER,
    to: data.email,
    subject: "Deal Submission Confirmation - DealNest",
    text: textBody,
    html: htmlBody,
  });
}

export async function sendDealToTcEmail(
  data: TcEmailData,
  recipientEmail: string
): Promise<void> {
  // Create transporter using SMTP credentials from environment
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  // Format the email body with minimal TC-specific data
  const textBody = formatTcEmail(data);
  const htmlBody = generateTcEmailHtmlBody(data);

  // Send the email to the Transaction Coordinator
  await transporter.sendMail({
    from: env.SMTP_USER,
    to: recipientEmail,
    subject: `Deal Information - ${data.propertyAddress} (ID: #${data.submissionId})`,
    text: textBody,
    html: htmlBody,
  });
}
