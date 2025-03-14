// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Supabase project URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Supabase anonymous key

// Check if environment variables are defined
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Check your .env file.'
  );
}

// Create and export the Supabase client instance
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true, // Persist the session in localStorage
      autoRefreshToken: true, // Automatically refresh the token
    },
    global: {
      headers: {
        'x-application-name': 'spotify-voyager', // Custom header for tracking
      },
    },
  }
);

/**
 * Store Spotify user data in Supabase
 * @param {Object} userData - User data from Spotify API
 * @returns {Promise<Object>} Result of the database operation
 */
export async function storeUserData(userData) {
  try {
    // Format the user data for storage
    const formattedUser = {
      spotify_id: userData.id,
      email: userData.email,
      display_name: userData.display_name,
      profile_image: userData.images?.[0]?.url || null,
      country: userData.country,
      product_type: userData.product,
      updated_at: new Date().toISOString(),
    };
    
    // Insert or update the user record
    const { data, error } = await supabase
      .from('users')
      .upsert(formattedUser, { 
        onConflict: 'spotify_id', // Update if spotify_id already exists
        returning: 'minimal' // Don't need the returned data
      });
      
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error storing user data:', err);
    return { success: false, error: err.message };
  }
}