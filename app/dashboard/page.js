// app/dashboard/page.js
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { isAuthenticated, spotifyFetch } from '@/lib/spotify';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadDashboardData() {
      try {
        if (!isAuthenticated()) {
          router.push('/');
          return;
        }
        
        setLoading(true);
        
        const userProfile = await spotifyFetch('/me');
        setUserData(userProfile);
        
        const tracksResponse = await spotifyFetch('/me/top/tracks?limit=10&time_range=short_term');
        setTopTracks(tracksResponse.items);
        
        const recentResponse = await spotifyFetch('/me/player/recently-played?limit=5');
        setRecentlyPlayed(recentResponse.items);
        
      } catch (err) {
        console.error('Dashboard data loading error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('tokenExpiration');
    router.push('/');
  };

  const formatArtists = (artists) => {
    return artists.map(artist => artist.name).join(', ');
  };
  
  if (loading) {
    return (
      <div className="loading-page">
        <Header />
        <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-page">
        <Header />
        <div className="container" style={{ paddingTop: '120px' }}>
          <div className="error-message">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-danger"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <Header />
      
      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="card">
          <div className="card-content">
            <div className="user-profile">
              {userData?.images?.[0]?.url ? (
                <Image 
                  src={userData.images[0].url} 
                  alt="Profile" 
                  width={100} // Specify width
                  height={100} // Specify height
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  👤
                </div>
              )}
              
              <div className="profile-info">
                <h1>{userData?.display_name}</h1>
                <p>{userData?.email}</p>
                <p>
                  <span className="badge">
                    {userData?.product === 'premium' ? 'Premium' : 'Free'} Account
                  </span>
                  {userData?.followers?.total && (
                    <span className="text-small">
                      {userData.followers.total} Followers
                    </span>
                  )}
                </p>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ marginTop: '10px' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Your Top Tracks</h2>
          </div>
          <div className="card-content">
            {topTracks.length === 0 ? (
              <p>No top tracks found. Start listening to build your preferences!</p>
            ) : (
              <div className="track-grid">
                {topTracks.map((track) => (
                  <div key={track.id} className="track-item">
                    <Image 
                      src={track.album.images?.[2]?.url || track.album.images?.[0]?.url} 
                      alt={track.album.name}
                      width={100} // Specify width
                      height={100} // Specify height
                      className="track-image"
                    />
                    <div className="track-info">
                      <h3 className="track-title">{track.name}</h3>
                      <p className="track-artist">{formatArtists(track.artists)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Recently Played</h2>
          </div>
          <div className="card-content">
            {recentlyPlayed.length === 0 ? (
              <p>No recently played tracks found.</p>
            ) : (
              <div className="recent-tracks">
                {recentlyPlayed.map((item) => (
                  <div key={`${item.track.id}-${item.played_at}`} className="recent-track">
                    <Image 
                      src={item.track.album.images?.[2]?.url || item.track.album.images?.[0]?.url} 
                      alt={item.track.album.name}
                      width={100} // Specify width
                      height={100} // Specify height
                      className="track-image"
                    />
                    <div className="track-info">
                      <h3 className="track-title">{item.track.name}</h3>
                      <p className="track-artist">{formatArtists(item.track.artists)}</p>
                    </div>
                    <div className="track-time">
                      {new Date(item.played_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
