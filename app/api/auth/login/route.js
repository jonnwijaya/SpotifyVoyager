// app/api/auth/login/route.js
import { redirect } from 'next/navigation'; // Import redirect function from Next.js
import { getSpotifyLoginUrl } from '@/lib/spotify'; // Import Spotify login URL generator

// Handle GET requests to this route
export async function GET(request) {
  // Generate the Spotify authorization URL
  const loginUrl = getSpotifyLoginUrl();
  
  // Redirect to Spotify authorization
  return redirect(loginUrl);
}