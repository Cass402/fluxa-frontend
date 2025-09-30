import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client: SupabaseClient | null = null;

function ensureConfig(variable: string | undefined, name: string) {
  if (!variable) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return variable;
}

export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const url = ensureConfig(SUPABASE_URL, "SUPABASE_URL");
  const serviceKey = ensureConfig(
    SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_SERVICE_ROLE_KEY"
  );

  client = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return client;
}
