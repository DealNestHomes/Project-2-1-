# Environment Setup Guide

Your application requires the following environment variables to function properly.

## Required Environment Variables

Add these to your `.env` file locally AND to Vercel's Environment Variables:

```env
# Node Environment
NODE_ENV=production

# Authentication
ADMIN_PASSWORD=your_secure_admin_password_here
JWT_SECRET=your_jwt_secret_minimum_32_characters_long

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Google APIs (for address autocomplete)
GOOGLE_GEOCODING_API_KEY=your_google_api_key_here

# Email Configuration (for deal submission notifications)
SMTP_HOST=smtp.gmail.com           # Or your SMTP provider
SMTP_PORT=587                      # Or 465 for SSL
SMTP_USER=your-email@gmail.com     # Your email
SMTP_PASS=your-app-password        # App password, not regular password
DEAL_NOTIFICATION_EMAIL=deals@yourdomain.com  # Where to send deal notifications
TC_EMAIL=tc@yourdomain.com         # Transaction coordinator email

# Optional Base URLs
BASE_URL=https://your-app.vercel.app
BASE_URL_OTHER_PORT=http://localhost:3000
```

## Setup Instructions

### 1. Supabase Database
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select existing
3. Go to Settings → Database → Connection String
4. Copy the URI format connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add to`.env` as `DATABASE_URL`

**Run migrations:**
```bash
pnpm prisma migrate deploy
```

### 2. Google Geocoding API (for address lookup)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Places API** and **Geocoding API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. (Optional but recommended) Restrict the key to your domain
6. Copy the API key to `GOOGLE_GEOCODING_API_KEY`

### 3. Email (SMTP) - For Gmail Example
1. Go to your Google Account settings
2. Enable 2-factor authentication
3. Go to **Security** → **App passwords**
4. Generate a new app password
5. Use these settings:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   DEAL_NOTIFICATION_EMAIL=your-email@gmail.com
   TC_EMAIL=your-email@gmail.com
   ```

### 4. File Upload (Minio/S3) - Currently using Minio
This requires setting up an S3-compatible storage service. Options:

**Option A: Skip for now** - Comment out file upload in the deal submission form

**Option B: Use Cloudflare R2 (Free)**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. R2 → Create bucket named `purchase-agreements`
3. Get credentials and update `src/server/minio.ts`:
   ```typescript
   endPoint: 'https://<account-id>.r2.cloudflarestorage.com'
   accessKey: 'your-r2-access-key'
   secretKey: 'your-r2-secret-key'
   ```

**Option C: Use Supabase Storage**
- Requires refactoring `generatePresignedUploadUrl.ts` to use Supabase client

## Testing Locally

1. Create `.env` file with all variables
2. Run migrations: `pnpm prisma migrate deploy`
3. Start dev server: `pnpm dev`
4. Test each feature:
   - Address lookup in form
   - File upload field
   - Submit a test deal

## Deploying to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add ALL the environment variables from above
3. Redeploy your application

## Current Issues and Quick Fixes

### Quick Fix 1: Disable Email Temporarily
If you want to test without email, comment out lines 170-179 in `src/server/trpc/procedures/submitDeal.ts`:

```typescript
// await sendDealSubmissionNotification({...});
// await sendSubmitterConfirmationEmail({...});
```

### Quick Fix 2: Disable File Upload Temporarily
Remove the file upload requirement from the form validation.

### Quick Fix 3: Use Mock Data for Address
Hardcode a test address instead of using Google API during initial testing.
