import { createClient } from "@supabase/supabase-js";

// Use placeholder strings during build time if environment variables are not yet configured.
// This prevents Next.js compiler from crashing on build servers (like Vercel).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Warning: Missing Supabase environment variables! Using placeholder credentials for build time.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
