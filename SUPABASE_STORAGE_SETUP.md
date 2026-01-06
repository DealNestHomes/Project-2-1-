# Supabase Storage Setup for File Uploads

## Quick Setup (5 minutes)

### 1. Create Storage Bucket in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click **Storage** in the left sidebar
4. Click **New bucket**
5. Enter bucket name: `purchase-agreements`
6. **Important**: Make it **Public** (check the "Public bucket" toggle)
7. Click **Create bucket**

### 2. Get Supabase Credentials

Still in Supabase Dashboard:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:

   - **Project URL** - looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - **Service role key** (anon key won't work!) - starts with `eyJ...`

### 3. Add to `.env` File

```env
# Supabase Storage
SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M..."
```

### 4. Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add both variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Make sure to select all environments (Production, Preview, Development)
4. Click **Save**

### 5. Test Locally

```bash
pnpm dev
```

Go to the submit deal form and try uploading a PDF file.

### 6. Deploy

```bash
git add .
git commit -m "Implement Supabase Storage for file uploads"
git push
```

## Troubleshooting

### "Bucket not found" error
- Make sure the bucket is named exactly `purchase-agreements`
- Verify the bucket exists in Supabase Storage dashboard

### "Permission denied" error
- Make sure you used the **service_role** key, NOT the anon key
- Verify the bucket is set to **Public**

### Files not uploading
- Check browser console for errors
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel
- Make sure you redeployed after adding environment variables

## Optional: Set File Size Limits

In Supabase Dashboard → Storage → purchase-agreements bucket settings:
- Max file size: 10MB (default is 50MB)
- Allowed MIME types: `application/pdf`

## What Changed

- Replaced Minio (local S3) with Supabase Storage (cloud)
- File uploads now work on Vercel serverless
- Files are stored in Supabase (free tier: 1GB storage)
- Generated upload URLs are valid for 60 minutes
