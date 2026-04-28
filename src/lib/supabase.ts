import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn(
    '[Fashion Foresight] Supabase not configured. Running in demo mode.\n' +
    'To enable production auth, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

/**
 * Supabase client — safe to use in the browser.
 * The anon key is protected by Row Level Security (RLS) policies.
 * Never use the service_role key on the client.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage (standard for SPAs)
    persistSession: true,
    // Automatically refresh tokens before expiry
    autoRefreshToken: true,
    // Detect session from URL hash (for OAuth/magic links)
    detectSessionInUrl: true,
    // Use PKCE flow for better security
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'fashion-foresight-web/1.0.0',
    },
  },
});

export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder-anon-key' &&
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey);
