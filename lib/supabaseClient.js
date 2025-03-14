// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Get Supabase URL from environment variable
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Get Supabase anon key from environment variable

export const supabase = createClient(supabaseUrl, supabaseAnonKey); // Create and export Supabase client
