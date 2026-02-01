import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  BASE_URL: z.string().optional(),
  BASE_URL_OTHER_PORT: z.string().optional(),
  ADMIN_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  GOOGLE_GEOCODING_API_KEY: z.string(),

  // Email notification settings
  DEAL_NOTIFICATION_EMAIL: z.string().email(),
  TC_EMAIL: z.string().email(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  // Supabase Storage
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Zapier Webhooks
  JV_AGREEMENT_WEBHOOK_URL: z.string().url(),
  DEAL_DESCRIPTION_WEBHOOK_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

// We do NOT throw here anymore to prevent top-level crash on Vercel.
// Instead, we export a check function.
if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 4),
  );
}

// If parsing fails, we cast process.env (or empty object) to specific type to satisfy TS,
// but relying on validateEnv() to catch it at runtime.
export const env = (parsed.success ? parsed.data : process.env) as unknown as z.infer<typeof envSchema>;

export function validateEnv() {
  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.format())}`);
  }
}
