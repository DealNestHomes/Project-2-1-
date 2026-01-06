import { createClient } from '@supabase/supabase-js';
import { env } from './env';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return supabaseClient;
}
