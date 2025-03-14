// app/dashboard/page.js
"use client"; // Mark as client component

import { useState, useEffect } from 'react'; // Import React hooks
import { useRouter } from 'next/navigation'; // Import router for navigation
import Header from '@/components/Header'; // Import the Header component
import { isAuthenticated, spotifyFetch } from '@/lib/spotify'; // Import Spotify utilities

export default function Dashboard() {
  const router = useRouter(); // Initialize router
  const [loading, setLoading] = useState(true); // Track loading state
  const [userData, setUserData] = useState(null); // Store user data
  const [topTracks, setTopTracks] = useState([]); // Store top tracks
  const [recentlyPlayed, setRecentlyPlayed] = useState([]); // Store recently played tracks
  const [error, setError] = useState(null); // Track errors
  
  // Authentication check and data loading on component mount
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          router.push('/'); // Redirect to home if not authenticated
          return;
        }
        
        setLoading(true); // Set loading state
        
        // Fetch user profile from Spotify
        const userProfile = await spotifyFetch('/me');
        setUserData(userProfile);
        
        // Fetch user's top tracks
        const tracksResponse = await spotifyFetch('/me/top/tracks?limit=10&time_range=short_term');
        setTopTracks(tracksResponse.items);
        
        // Fetch recently played tracks
        const recentResponse = await spotifyFetch('/me/player/recently-played?limit=5');
        setRecentlyPlayed(recentResponse.items);
        
      } catch (err) {
        console.error('Dashboard data loading error:', err);
        setError(err.message);
      } finally {
        setLoading(false); // End loading state
      }
    }
    
    loadDashboardData();
  }, [router]);
  
  // Function to handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('tokenExpiration');
    // Redirect to home page
    router.push('/');
  };

  // Helper function to format artists list
  const formatArtists = (artists) => {
    return artists.map(artist => artist.name).join(', ');
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1DB954]"></div>
          <span className="ml-4 text-lg text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 px-6 max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* User profile section */}
      <div className="pt-28 px-6 max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {userData?.images?.[0]?.url ? (
              <img 
                src={userData.images[0].url} 
                alt="Profile" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">👤</span>
              </div>
            )}
            
            <div className="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{userData?.display_name}</h1>
              <p className="text-gray-600">{userData?.email}</p>
              <p className="mt-1">
                <span className="bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                  {userData?.product === 'premium' ? 'Premium' : 'Free'} Account
                </span>
                {userData?.followers?.total && (
                  <span className="ml-2 text-gray-600 text-sm">
                    {userData.followers.total} Followers
                  </span>
                )}
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Top tracks section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Top Tracks</h2>
          
          {topTracks.length === 0 ? (
            <p className="text-gray-600">No top tracks found. Start listening to build your preferences!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topTracks.map((track) => (
                <div key={track.id} className="border rounded-md p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <img 
                      src={track.album.images?.[2]?.url || track.album.images?.[0]?.url} 
                      alt={track.album.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{track.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{formatArtists(track.artists)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recently played section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Recently Played</h2>
          
          {recentlyPlayed.length === 0 ? (
            <p className="text-gray-600">No recently played tracks found.</p>
          ) : (
            <div className="space-y-4">
              {recentlyPlayed.map((item) => (
                <div key={`${item.track.id}-${item.played_at}`} className="flex items-center">
                  <img 
                    src={item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url} 
                    alt={item.track.album.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-gray-900">{item.track.name}</h3>
                    <p className="text-sm text-gray-500">{formatArtists(item.track.artists)}</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.played_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}