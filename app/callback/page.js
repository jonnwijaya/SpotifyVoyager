// app/callback/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; // Use relative path

// Define the Callback component to handle Spotify authentication response
export default function Callback() {
  const router = useRouter(); // Initialize Next.js router for navigation
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [error, setError] = useState(null); // State to track any errors during authentication
  const [loading, setLoading] = useState(true); // State to track loading status

  // Effect runs on component mount to handle the authentication callback
  useEffect(() => {
    async function handleCallback() {
      try {
        setLoading(true); // Set loading state to true while processing
        
        // Get the URL hash containing the access token
        const hash = window.location.hash;
        
        if (!hash) {
          throw new Error('No authentication data found in URL');
        }
        
        // Parse the hash fragment to extract tokens and other data
        const params = new URLSearchParams(hash.substring(1)); // Remove the # character
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');
        
        if (!accessToken) {
          throw new Error('No access token found');
        }
        
        // Calculate token expiration time
        const expirationTime = Date.now() + (parseInt(expiresIn) * 1000);
        
        // Store tokens in localStorage for persistence
        localStorage.setItem('spotifyAccessToken', accessToken);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        
        // Fetch user profile with the access token
        const userData = await fetchUserProfile(accessToken);
        
        // Store user data in Supabase if needed
        if (userData) {
          await storeUserInSupabase(userData);
        }
        
        // Clear the hash from the URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to the dashboard or home page
        router.push('/dashboard');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false); // Set loading to false when done
      }
    }
    
    handleCallback();
  }, [router]); // Only re-run if router changes

  // Function to fetch user profile from Spotify API
  async function fetchUserProfile(accessToken) {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the auth header with the token
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json(); // Parse the response JSON
      setUserProfile(data); // Update state with user data
      return data; // Return the user data
    } catch (err) {
      setError(err.message); // Set error state
      return null; // Return null on error
    }
  }

  // Function to store user data in Supabase
  async function storeUserInSupabase(userData) {
    try {
      // Upsert user data to users table
      const { error } = await supabase
        .from('users')
        .upsert({
          spotify_id: userData.id,
          email: userData.email,
          display_name: userData.display_name,
          profile_image: userData.images?.[0]?.url || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'spotify_id' });

      if (error) throw error;
    } catch (err) {
      console.error('Error storing user in Supabase:', err);
      // Non-critical error, don't block the flow
    }
  }

  // Render the component UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        // Show error message if something went wrong
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Authentication Error</p>
          <p>{error}</p>
          <button 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={() => router.push('/')}
          >
            Return to Home
          </button>
        </div>
      ) : loading ? (
        // Show loading spinner while processing
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-lg text-gray-700">Authenticating with Spotify...</p>
        </div>
      ) : userProfile ? (
        // Show user profile info if available
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome, {userProfile.display_name}!</h1>
          {userProfile.images?.[0]?.url && (
            <img 
              src={userProfile.images[0].url} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mx-auto my-4 object-cover"
            />
          )}
          <p className="text-gray-700">Email: {userProfile.email}</p>
          <p className="mt-4">Redirecting to dashboard...</p>
        </div>
      ) : (
        // Fallback message
        <p>Processing authentication...</p>
      )}
    </div>
  );
}