import { db } from "~/server/db";
import { sendDealSubmissionNotification, sendSubmitterConfirmationEmail } from "~/server/utils/email";
import { env } from "~/server/env";

async function testDealSubmission() {
  console.log("🧪 Testing Deal Submission Email Notification System");
  console.log("=" .repeat(70));
  console.log();
  
  console.log("📧 Email Configuration:");
  console.log(`   Notification Email: ${env.DEAL_NOTIFICATION_EMAIL}`);
  console.log(`   SMTP Host: ${env.SMTP_HOST}`);
  console.log(`   SMTP Port: ${env.SMTP_PORT}`);
  console.log(`   SMTP User: ${env.SMTP_USER}`);
  console.log();
  
  // Create test deal data matching current schema
  const testDealData = {
    // Contact Information
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    
    // Seller Information
    sellerName: "Jane Doe",
    sellerEmail: "jane.doe@example.com",
    sellerPhone: "(555) 987-6543",
    
    // Basic Property Information
    propertyAddress: "123 Main Street, Detroit, MI",
    zipCode: "48201",
    propertyType: "Single Family",
    
    // Property Specifications
    bedrooms: 3,
    baths: 2,
    halfBaths: 1,
    squareFootage: 2000,
    lotSize: 0.25,
    lotSizeUnit: "acres",
    yearBuilt: 1995,
    
    // Deal Details
    closingDate: new Date("2024-03-15"),
    inspectionPeriodExpiration: new Date("2024-02-28"),
    occupancy: "Vacant",
    propertyCondition: "Good - Minor repairs needed",
    
    // Repair & System Details
    repairEstimateMin: "10000",
    repairEstimateMax: "15000",
    roofAge: "6-10",
    acType: "Central Air",
    heatingSystemType: "Forced Air Gas",
    heatingSystemAge: "6-10",
    foundationType: "Slab",
    foundationCondition: "Good",
    parkingType: "Attached Garage",
    
    // Financial Details
    arv: "350000",
    estimatedRepairs: "25000",
    contractPrice: "250000",
    
    // Additional Information
    additionalInfo: "This is a test submission to verify the new email notification format is working correctly. The property has great potential and is in a desirable neighborhood.",
    propertyAccess: "Lockbox code: 1234 (on front door)",
    photoLink: "https://example.com/photos/test-property",
    
    status: "new",
  };
  
  console.log("📝 Creating test deal submission in database...");
  
  try {
    // Create the deal submission in the database
    const dealSubmission = await db.dealSubmission.create({
      data: testDealData,
    });
    
    console.log(`✅ Deal submission created successfully (ID: ${dealSubmission.id})`);
    console.log();
    
    console.log("📤 Sending email notification with new 8-section comprehensive format...");
    
    // Send the email notification with all required fields
    await sendDealSubmissionNotification({
      submissionId: dealSubmission.id,
      name: testDealData.name,
      email: testDealData.email,
      phone: testDealData.phone,
      sellerName: testDealData.sellerName,
      sellerEmail: testDealData.sellerEmail,
      sellerPhone: testDealData.sellerPhone,
      propertyAddress: testDealData.propertyAddress,
      zipCode: testDealData.zipCode,
      propertyType: testDealData.propertyType,
      bedrooms: testDealData.bedrooms,
      baths: testDealData.baths,
      halfBaths: testDealData.halfBaths,
      squareFootage: testDealData.squareFootage,
      lotSize: testDealData.lotSize,
      lotSizeUnit: testDealData.lotSizeUnit,
      yearBuilt: testDealData.yearBuilt,
      closingDate: testDealData.closingDate.toISOString(),
      inspectionPeriodExpiration: testDealData.inspectionPeriodExpiration.toISOString(),
      occupancy: testDealData.occupancy,
      propertyCondition: testDealData.propertyCondition,
      repairEstimateMin: testDealData.repairEstimateMin,
      repairEstimateMax: testDealData.repairEstimateMax,
      roofAge: testDealData.roofAge,
      acType: testDealData.acType,
      heatingSystemType: testDealData.heatingSystemType,
      heatingSystemAge: testDealData.heatingSystemAge,
      foundationType: testDealData.foundationType,
      foundationCondition: testDealData.foundationCondition,
      parkingType: testDealData.parkingType,
      arv: testDealData.arv,
      estimatedRepairs: testDealData.estimatedRepairs,
      contractPrice: testDealData.contractPrice,
      additionalInfo: testDealData.additionalInfo,
      propertyAccess: testDealData.propertyAccess,
      photoLink: testDealData.photoLink,
    });
    
    console.log("✅ Email notification sent successfully!");
    console.log();
    
    console.log("📤 Sending confirmation email to submitter...");
    
    // Send confirmation email to the submitter
    await sendSubmitterConfirmationEmail({
      submissionId: dealSubmission.id,
      name: testDealData.name,
      email: testDealData.email,
      phone: testDealData.phone,
      sellerName: testDealData.sellerName,
      sellerEmail: testDealData.sellerEmail,
      sellerPhone: testDealData.sellerPhone,
      propertyAddress: testDealData.propertyAddress,
      zipCode: testDealData.zipCode,
      propertyType: testDealData.propertyType,
      bedrooms: testDealData.bedrooms,
      baths: testDealData.baths,
      halfBaths: testDealData.halfBaths,
      squareFootage: testDealData.squareFootage,
      lotSize: testDealData.lotSize,
      lotSizeUnit: testDealData.lotSizeUnit,
      yearBuilt: testDealData.yearBuilt,
      closingDate: testDealData.closingDate.toISOString(),
      inspectionPeriodExpiration: testDealData.inspectionPeriodExpiration.toISOString(),
      occupancy: testDealData.occupancy,
      propertyCondition: testDealData.propertyCondition,
      repairEstimateMin: testDealData.repairEstimateMin,
      repairEstimateMax: testDealData.repairEstimateMax,
      roofAge: testDealData.roofAge,
      acType: testDealData.acType,
      heatingSystemType: testDealData.heatingSystemType,
      heatingSystemAge: testDealData.heatingSystemAge,
      foundationType: testDealData.foundationType,
      foundationCondition: testDealData.foundationCondition,
      parkingType: testDealData.parkingType,
      arv: testDealData.arv,
      estimatedRepairs: testDealData.estimatedRepairs,
      contractPrice: testDealData.contractPrice,
      additionalInfo: testDealData.additionalInfo,
      propertyAccess: testDealData.propertyAccess,
      photoLink: testDealData.photoLink,
    });
    
    console.log("✅ Confirmation email sent successfully!");
    console.log();
    console.log("=" .repeat(70));
    console.log("🎉 TEST COMPLETED SUCCESSFULLY");
    console.log();
    console.log("📬 Email Details:");
    console.log(`   Staff Notification To: ${env.DEAL_NOTIFICATION_EMAIL}`);
    console.log(`   Staff Subject: New Deal Submission - ${testDealData.propertyAddress}`);
    console.log();
    console.log(`   Submitter Confirmation To: ${testDealData.email}`);
    console.log(`   Submitter Subject: Deal Submission Confirmation - DealNest`);
    console.log();
    console.log("📊 New Email Format Includes All 8 Sections:");
    console.log("   ✓ Section 1 – Your Contact Information");
    console.log("   ✓ Section 2 – Property Location");
    console.log("   ✓ Section 3 – Property Details (beds, baths, sqft, lot, parking, etc.)");
    console.log("   ✓ Section 4 – Deal Timeline");
    console.log("   ✓ Section 5 – Property Condition & Systems (all repair/system details)");
    console.log("   ✓ Section 6 – Financial Details");
    console.log("   ✓ Section 7 – Seller Information");
    console.log("   ✓ Section 8 – Additional Information");
    console.log();
    console.log("📋 Format Features:");
    console.log("   ✓ Clean plain text layout optimized for copy/paste");
    console.log("   ✓ One field per line");
    console.log("   ✓ Clear section headers");
    console.log("   ✓ Preserves 'Unknown' values");
    console.log("   ✓ No clutter or unnecessary styling");
    console.log();
    console.log("📧 Email Notifications:");
    console.log("   ✓ Staff notification email sent to JV team");
    console.log("   ✓ Submitter confirmation email sent to deal submitter");
    console.log();
    
  } catch (error) {
    console.error();
    console.error("❌ TEST FAILED");
    console.error("=" .repeat(70));
    console.error();
    console.error("Error details:");
    console.error(error);
    console.error();
    
    if (error instanceof Error) {
      if (error.message.includes("SMTP") || error.message.includes("connect")) {
        console.error("💡 This appears to be an SMTP connection error.");
        console.error("   Please verify:");
        console.error("   - SMTP credentials are correct");
        console.error("   - SMTP host and port are accessible");
        console.error("   - Gmail account has 'App Passwords' enabled (if using Gmail)");
      } else if (error.message.includes("authentication") || error.message.includes("auth")) {
        console.error("💡 This appears to be an authentication error.");
        console.error("   Please verify:");
        console.error("   - SMTP_USER and SMTP_PASS are correct");
        console.error("   - For Gmail, use an 'App Password' instead of your regular password");
      }
    }
    
    process.exit(1);
  }
}

// Run the test
testDealSubmission()
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  })
  .finally(() => {
    // Close database connection
    db.$disconnect();
  });
