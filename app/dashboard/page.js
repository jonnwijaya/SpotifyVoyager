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
        setError(null);

        // Load user profile
        const userProfile = await spotifyFetch('/me');
        setUserData(userProfile);

        // Load top tracks
        const tracksResponse = await spotifyFetch('/me/top/tracks?limit=10&time_range=short_term');
        setTopTracks(tracksResponse.items || []);

        // Load recently played
        const recentResponse = await spotifyFetch('/me/player/recently-played?limit=10');
        setRecentlyPlayed(recentResponse.items || []);

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
    return artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  };

  const openTrack = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading-page">
        <Header />
        <div className="loading-container">
          <div className="logo-icon pulse">SV</div>
          <h2>Setting Up Your Dashboard</h2>
          <p>Navigating through your musical cosmos...</p>
          <div className="progress-bar-container">
            <div className="progress-bar-cosmic"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error-page">
        <Header />
        <div className="error-container">
          <div className="error-card">
            <div className="error-icon">!</div>
            <h2>Houston, We Have a Problem</h2>
            <p className="error-message">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-danger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
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

      <div className="dashboard-container">
        {/* User Profile Card */}
        <div className="card profile-card">
          <div className="user-profile-wrapper">
            <div className="profile-image-container">
              {userData?.images?.[0]?.url ? (
                <Image 
                  src={userData.images[0].url} 
                  alt="Profile" 
                  width={100}
                  height={100}
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <span>{userData?.display_name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{userData?.display_name || 'Music Lover'}</h1>
              <p className="profile-email">{userData?.email}</p>

              <div className="profile-stats">
                <span className={`account-badge ${userData?.product === 'premium' ? 'premium' : 'free'}`}>
                  {userData?.product === 'premium' ? 'Premium' : 'Free'} Account
                </span>
                {userData?.followers?.total > 0 && (
                  <span className="followers-count">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {userData.followers.total} followers
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Top Tracks Card */}
        <div className="card">
          <div className="card-header">
            <h2>Your Top Tracks</h2>
            <span className="card-subheader">Based on your recent listening</span>
          </div>
          <div className="card-content">
            {topTracks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎵</div>
                <p>No top tracks found. Start listening to build your preferences!</p>
              </div>
            ) : (
              <div className="tracks-grid">
                {topTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="track-item" 
                    onClick={() => openTrack(track.external_urls?.spotify)}
                  >
                    <div className="track-art-container">
                      <Image 
                        src={track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '/placeholder-album.png'} 
                        alt={track.album?.name || 'Album'}
                        width={60}
                        height={60}
                        className="track-art"
                      />
                      <div className="play-overlay">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="play-icon">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                    </div>
                    <div className="track-details">
                      <h3 className="track-title">{track.name}</h3>
                      <p className="track-artist">{formatArtists(track.artists)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recently Played Card */}
        <div className="card">
          <div className="card-header">
            <h2>Recently Played</h2>
            <span className="card-subheader">Your music journey</span>
          </div>
          <div className="card-content">
            {recentlyPlayed.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎧</div>
                <p>No recently played tracks found.</p>
              </div>
            ) : (
              <div className="recent-tracks-timeline">
                {recentlyPlayed.map((item, index) => (
                  <div 
                    key={`${item.track?.id}-${item.played_at}-${index}`} 
                    className="recent-track-item"
                    onClick={() => openTrack(item.track?.external_urls?.spotify)}
                  >
                    <div className="timeline-connector">
                      <div className="timeline-dot"></div>
                      {index < recentlyPlayed.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="recent-track-content">
                      <div className="recent-track-art">
                        <Image 
                          src={item.track?.album?.images?.[2]?.url || item.track?.album?.images?.[0]?.url || '/placeholder-album.png'} 
                          alt={item.track?.album?.name || 'Album'}
                          width={50}
                          height={50}
                          className="track-art"
                        />
                      </div>
                      <div className="recent-track-details">
                        <h3 className="track-title">{item.track?.name}</h3>
                        <p className="track-artist">{formatArtists(item.track?.artists)}</p>
                        <span className="track-timestamp">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {new Date(item.played_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>Spotify Voyager • Exploring Your Musical Universe</p>
      </div>
    </div>
  );
}