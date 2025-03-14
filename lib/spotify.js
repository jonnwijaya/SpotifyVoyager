// lib/spotify.js
/**
 * Utility functions for Spotify API integration
 */

// Get required environment variables for Spotify API
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // Spotify Client ID from environment
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/callback` 
  : process.env.NEXT_PUBLIC_REDIRECT_URI; // Set redirect URI dynamically or from env
const SCOPES = [
  'user-read-private',        // Read access to user's subscription details
  'user-read-email',          // Read access to user's email address
  'user-library-read',        // Read access to a user's library
  'user-top-read',            // Read access to a user's top artists and tracks
  'user-read-recently-played' // Read access to a user's recently played tracks
]; // Define the permission scopes needed

/**
 * Creates the Spotify authorization URL with the correct parameters
 * @returns {string} The complete Spotify authorization URL
 */
export const getSpotifyLoginUrl = () => {
  // Parameters for the Spotify auth request
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',  // Using implicit grant flow for simplicity
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '), // Join scopes with space delimiter
    show_dialog: 'true'      // Force the user to approve the app again
  });
  
  // Build and return the complete authorization URL
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

/**
 * Check if the current user is authenticated
 * @returns {boolean} True if the user has a valid, non-expired access token
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false; // Server-side check
  
  const token = localStorage.getItem('spotifyAccessToken');
  const expiration = localStorage.getItem('tokenExpiration');
  
  return !!(token && expiration && parseInt(expiration) > Date.now());
};

/**
 * Makes an authenticated request to the Spotify API
 * @param {string} endpoint - The API endpoint to request (without the base URL)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} The JSON response from the API
 */
export const spotifyFetch = async (endpoint, options = {}) => {
  // Get the access token from storage
  const token = localStorage.getItem('spotifyAccessToken');
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  // Set up default headers with authorization
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers
  };
  
  // Make the API request
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers
  });
  
  // Handle error responses
  if (!response.ok) {
    // If token expired (401), we could implement refresh logic here
    if (response.status === 401) {
      localStorage.removeItem('spotifyAccessToken');
      localStorage.removeItem('tokenExpiration');
      window.location.href = '/'; // Redirect to home
      throw new Error('Session expired. Please log in again.');
    }
    
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }
  
  // Parse and return the JSON response
  return await response.json();
};