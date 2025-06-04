
/**
 * Utility functions for Spotify API integration
 */

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/callback` 
  : process.env.NEXT_PUBLIC_REDIRECT_URI;

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
];

/**
 * Creates the Spotify authorization URL
 */
export const getSpotifyLoginUrl = () => {
  if (!CLIENT_ID) {
    throw new Error('Spotify Client ID not configured');
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'token',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' '),
    show_dialog: 'true'
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

/**
 * Check if the current user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('spotifyAccessToken');
  const expiration = localStorage.getItem('tokenExpiration');
  
  return !!(token && expiration && parseInt(expiration) > Date.now());
};

/**
 * Get the current access token
 */
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('spotifyAccessToken');
  const expiration = localStorage.getItem('tokenExpiration');
  
  if (!token || !expiration || parseInt(expiration) <= Date.now()) {
    return null;
  }
  
  return token;
};

/**
 * Makes an authenticated request to the Spotify API
 */
export const spotifyFetch = async (endpoint, options = {}) => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No valid access token available');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired
      localStorage.removeItem('spotifyAccessToken');
      localStorage.removeItem('tokenExpiration');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      
      throw new Error('Session expired. Please log in again.');
    }
    
    if (response.status === 403) {
      throw new Error('This feature requires Spotify Premium. Some features may be limited for free accounts.');
    }
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    let errorMessage = `API error: ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } else {
        const textError = await response.text();
        errorMessage = `Server returned non-JSON response: ${response.status}`;
      }
    } catch {
      // If we can't parse the error, use the default message
    }
    
    throw new Error(errorMessage);
  }
  
  // Check if response is JSON before parsing
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Server returned non-JSON response');
  }
  
  return await response.json();
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('tokenExpiration');
  }
};
