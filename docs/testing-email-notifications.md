# Testing Email Notifications

This guide explains how to test the deal submission email notification system.

## Overview

When a user submits a deal through the `/submit-deal` form, the system automatically sends two emails:

1. **Staff Notification Email** - Sent to `JV@dealnesthomes.com` with comprehensive deal details for the team to review
2. **Submitter Confirmation Email** - Sent to the deal submitter confirming their submission was received successfully

Both emails are sent immediately after the deal is saved to the database.

## Current Email Configuration

Based on your `.env` file:

- **Notification Recipient:** `JV@dealnesthomes.com`
- **SMTP Provider:** Gmail (`smtp.gmail.com:587`)
- **Sending Email:** `dealnesthomes@gmail.com`

## Running the Test

### Option 1: Using the Test Script (Recommended)

Run the automated test script from the project root:

```bash
./scripts/test-email
```

This script will:
1. Display your current email configuration
2. Create a test deal submission in the database
3. Send an email notification to `JV@dealnesthomes.com`
4. Send a confirmation email to the submitter
5. Display the results and submission ID

### Option 2: Manual Submission via Frontend

1. Start the application: `./scripts/run`
2. Navigate to: `http://localhost:5173/submit-deal`
3. Fill out the form with test data
4. Submit the form
5. Check both the notification email inbox and the submitter's email inbox

## What to Expect

### Successful Test Output

```
🧪 Testing Deal Submission Email Notification System
======================================================================

📧 Email Configuration:
   Notification Email: JV@dealnesthomes.com
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: dealnesthomes@gmail.com

📝 Creating test deal submission in database...
✅ Deal submission created successfully (ID: 1)

📤 Sending email notification with new 8-section comprehensive format...
✅ Email notification sent successfully!

📤 Sending confirmation email to submitter...
✅ Confirmation email sent successfully!

======================================================================
🎉 TEST COMPLETED SUCCESSFULLY

📬 Email Details:
   Staff Notification To: JV@dealnesthomes.com
   Staff Subject: New Deal Submission - 123 Main Street, Detroit, MI

   Submitter Confirmation To: john.smith@example.com
   Submitter Subject: Deal Submission Confirmation - DealNest

📊 New Email Format Includes All 8 Sections:
   ✓ Section 1 – Your Contact Information
   ✓ Section 2 – Property Location
   ✓ Section 3 – Property Details (beds, baths, sqft, lot, parking, etc.)
   ✓ Section 4 – Deal Timeline
   ✓ Section 5 – Property Condition & Systems (all repair/system details)
   ✓ Section 6 – Financial Details
   ✓ Section 7 – Seller Information
   ✓ Section 8 – Additional Information

📋 Format Features:
   ✓ Clean plain text layout optimized for copy/paste
   ✓ One field per line
   ✓ Clear section headers
   ✓ Preserves 'Unknown' values
   ✓ No clutter or unnecessary styling

📧 Email Notifications:
   ✓ Staff notification email sent to JV team
   ✓ Submitter confirmation email sent to deal submitter

📋 Deal Submission ID: 1
🔗 View in staff portal: /staff/1

💡 The calculated spread should be: $350,000 - $25,000 - $250,000 = $75,000
```

### Staff Notification Email

The notification email has been redesigned for easy copying into InvestorLift listings.

**Subject:** `New Deal Submission - [Property Address]`

**Content Sections:**

**Section 1 – Property**
- Street Address
- ZIP Code
- Property Type
- Beds / Baths (combined format, e.g., "3 / 2.5")
- Square Footage
- Lot Size
- Parking Type

**Section 2 – Deal Numbers**
- ARV (After Repair Value)
- Estimated Repairs
- Contract Price
- Calculated Spread (automatically computed: ARV - Repairs - Contract Price)

**Section 3 – Timeline**
- Closing Date
- Inspection Expiration

**Section 4 – Condition**
- Overall Condition
- Roof Age
- Heating System Age

**Section 5 – Seller Information**
- Seller Full Name
- Seller Phone
- Seller Email

**Section 6 – Submitter (JV)**
- Your Name
- Your Phone
- Your Email

**Design Features:**
- Clean, copy-friendly formatting with one value per line
- All currency values automatically formatted (e.g., $250,000)
- Calculated spread provides instant deal analysis
- Minimal branding clutter for easy data extraction
- Both plain text and HTML versions included
- Direct link to view full details in staff portal
- Submission timestamp

### Submitter Confirmation Email

**To:** The email address provided by the deal submitter

**Subject:** `Deal Submission Confirmation - DealNest`

**Purpose:** Confirms to the submitter that their deal was successfully received and provides them with a summary of what they submitted.

**Content Includes:**
- Professional branded design with DealNest logo
- Success confirmation message
- Submission summary with key details:
  - Submission ID
  - Property Address
  - ZIP Code
  - Closing Date
  - Contract Price
  - ARV (After Repair Value)
  - Submission timestamp
- "What Happens Next?" section explaining the review timeline (1-2 business days)
- Contact information for support (email and phone)

**Design Features:**
- Mobile-responsive HTML email
- Professional branding with green success theme
- Clear visual hierarchy
- Both HTML and plain text versions
- Optimized for all major email clients

## Verifying the Emails

### Staff Notification Email

1. **Check the inbox** for `JV@dealnesthomes.com`
2. **Look for the subject line:** "New Deal Submission - [Address]"
3. **Verify the content** includes all test data in 8 comprehensive sections
4. **Click the "View Deal Details" button** to access the staff portal (requires login)

### Submitter Confirmation Email

1. **Check the inbox** for the test email address (e.g., `john.smith@example.com`)
2. **Look for the subject line:** "Deal Submission Confirmation - DealNest"
3. **Verify the content** includes:
   - Success confirmation message
   - Submission summary with key details
   - "What Happens Next?" timeline information
   - Contact support information
4. **Check the design** renders correctly (HTML email with logo and branding)

## Troubleshooting

### Common Issues

#### 1. SMTP Connection Errors

**Error Message:** Contains "SMTP" or "connect"

**Solutions:**
- Verify SMTP credentials in `.env` are correct
- Check that Gmail account has "App Passwords" enabled
- Ensure port 587 is not blocked by firewall

#### 2. Authentication Errors

**Error Message:** Contains "authentication" or "auth"

**Solutions:**
- For Gmail, use an "App Password" instead of regular password
- Generate App Password at: https://myaccount.google.com/apppasswords
- Update `SMTP_PASS` in `.env` with the App Password

#### 3. Email Not Received

**Possible Causes:**
- Check spam/junk folder
- Verify `DEAL_NOTIFICATION_EMAIL` is correct
- Check Gmail sending limits (500 emails/day for free accounts)
- Review Gmail account security settings

#### 4. Database Connection Errors

**Solutions:**
- Ensure Docker containers are running: `./scripts/run`
- Check PostgreSQL container is healthy
- Verify database migrations are up to date

### Debug Mode

To see detailed SMTP debug information, you can temporarily modify `src/server/utils/email.ts` to add:

```typescript
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  debug: true, // Add this line
  logger: true, // Add this line
});
```

## Gmail App Password Setup

If you're using Gmail (which is the current configuration), you need to use an App Password:

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to Security
3. Enable 2-Step Verification (if not already enabled)
4. Go to "App passwords" section
5. Generate a new app password for "Mail"
6. Copy the 16-character password
7. Update `.env` with: `SMTP_PASS="xxxx xxxx xxxx xxxx"`

## Environment Variables

All email-related environment variables are defined in `.env`:

```env
DEAL_NOTIFICATION_EMAIL=JV@dealnesthomes.com  # Where notifications are sent
SMTP_HOST=smtp.gmail.com                       # Gmail SMTP server
SMTP_PORT=587                                  # TLS port
SMTP_USER=dealnesthomes@gmail.com              # Sending email account
SMTP_PASS="jmyf vaox pgbf ohal"                # App password (16 chars)
```

**Important:** The `SMTP_PASS` should be a Gmail App Password, not your regular account password.

## Testing in Production

When deploying to production:

1. Verify all environment variables are set correctly
2. Test with the script before going live
3. Consider setting up email monitoring/logging
4. Monitor Gmail sending limits
5. Have a backup notification method (Slack, SMS, etc.)

## Additional Notes

- **Two emails are sent** for every deal submission:
  1. Staff notification email (to JV team)
  2. Submitter confirmation email (to deal submitter)
- Email notifications are sent synchronously during deal submission
- Failed email delivery will cause the submission to fail (by design)
- All submissions are logged in the database regardless of email status
- The staff portal allows viewing all submissions at `/staff`
- The submitter confirmation email provides transparency and builds trust with partners
