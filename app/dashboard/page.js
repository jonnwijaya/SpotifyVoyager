"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { isAuthenticated, spotifyFetch } from '@/lib/spotify';
import { getUserAnalytics } from '@/lib/analytics';
import { generatePersonalizedInsights } from '@/lib/aiService';
import { checkSubscriptionStatus, SUBSCRIPTION_PLANS } from '@/lib/payments';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState({ isPremium: false });
  const [generatingReceipt, setGeneratingReceipt] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        if (!isAuthenticated()) {
          router.push('/');
          return;
        }

        setLoading(true);
        setError(null);

        // Load user analytics
        try {
          const data = await getUserAnalytics();
          setAnalytics(data);

          // Generate AI insights
          try {
            const aiInsights = await generatePersonalizedInsights(data, subscription.isPremium);
            setInsights(aiInsights);
          } catch (insightsError) {
            console.error('Failed to generate insights:', insightsError);
            // Set basic insights as fallback
            setInsights({
              musicPersonality: 'Music Explorer',
              insights: ['Analyzing your music taste...'],
              recommendations: ['Keep exploring new music!']
            });
          }
        } catch (err) {
          console.error('Dashboard error:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }

      } catch (err) {
        console.error('Dashboard data loading error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router, subscription.isPremium]);

  const handleLogout = () => {
    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('tokenExpiration');
    router.push('/');
  };

  const generateReceipt = async () => {
    try {
      setGeneratingReceipt(true);
      const receiptId = Math.random().toString(36).substring(7);
      router.push(`/receipt/${receiptId}`);
    } catch (error) {
      console.error('Error generating receipt:', error);
      setError('Failed to generate receipt');
    } finally {
      setGeneratingReceipt(false);
    }
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
          <h2>Analyzing Your Musical Universe</h2>
          <p>Calculating your music DNA...</p>
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
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="dashboard-page">
      <Header />

      <div className="dashboard-container">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="user-profile-wrapper">
            <div className="profile-image-container">
              {analytics.profile?.images?.[0]?.url ? (
                <Image
                  src={analytics.profile.images[0].url}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  {analytics.profile?.display_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{analytics.profile?.display_name}</h1>
              <p className="profile-email">{analytics.profile?.email}</p>

              <div className="profile-stats">
                <div className={`account-badge ${subscription.isPremium ? 'premium' : 'free'}`}>
                  {subscription.isPremium ? 'Premium' : 'Free'}
                </div>
                <div className="followers-count">
                  <span>👥</span>
                  <span>{analytics.profile?.followers?.total || 0} followers</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <button 
                  onClick={generateReceiptData}
                  className="btn btn-primary"
                  disabled={generatingReceipt}
                >
                  {generatingReceipt ? 'Generating...' : '🧬 Generate Music DNA'}
                </button>
                {!subscription.isPremium && (
                  <button 
                    onClick={() => router.push('/pricing')}
                    className="btn btn-outline"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Top Tracks
          </button>
          <button 
            className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Top Artists
          </button>
          <button 
            className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            AI Insights
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Listening Time</h3>
                <div className="stat-value">{analytics.insights.listeningTime.formatted}</div>
                <p>From your top 50 tracks</p>
              </div>
              <div className="stat-card">
                <h3>Music Mood</h3>
                <div className="stat-value">{analytics.insights.musicMood?.mood || 'Balanced'}</div>
                <p>Your overall vibe</p>
              </div>
              <div className="stat-card">
                <h3>Discovery Score</h3>
                <div className="stat-value">{Math.round(analytics.insights.discoveryScore)}/100</div>
                <p>How underground your taste is</p>
              </div>
              <div className="stat-card">
                <h3>Vintage Score</h3>
                <div className="stat-value">{Math.round(analytics.insights.vintageScore)}/100</div>
                <p>How classic your taste is</p>
              </div>
            </div>

            {/* Top Genres */}
            <div className="card">
              <div className="card-header">
                <h2>Your Top Genres</h2>
              </div>
              <div className="card-content">
                <div className="genres-grid">
                  {analytics.insights.topGenres.slice(0, 8).map((genre, index) => (
                    <div key={genre.genre} className="genre-item">
                      <span className="genre-rank">#{index + 1}</span>
                      <span className="genre-name">{genre.genre}</span>
                      <span className="genre-count">{genre.count} artists</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="tab-content">
            <div className="card">
              <div className="card-header">
                <h2>Your Top Tracks</h2>
                <span className="card-subheader">Your most played songs</span>
              </div>
              <div className="card-content">
                <div className="tracks-list">
                  {analytics.topTracks.map((track, index) => (
                    <div key={track.id} className="track-item-detailed" onClick={() => openTrack(track.external_urls?.spotify)}>
                      <span className="track-rank">#{index + 1}</span>
                      <div className="track-art-container">
                        <Image 
                          src={track.album?.images?.[2]?.url || '/placeholder-album.png'} 
                          alt={track.album?.name || 'Album'}
                          width={50}
                          height={50}
                          className="track-art"
                        />
                      </div>
                      <div className="track-details">
                        <h3 className="track-title">{track.name}</h3>
                        <p className="track-artist">{formatArtists(track.artists)}</p>
                        <p className="track-album">{track.album?.name}</p>
                      </div>
                      <div className="track-popularity">
                        <span className="popularity-score">{track.popularity}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artists' && (
          <div className="tab-content">
            <div className="card">
              <div className="card-header">
                <h2>Your Top Artists</h2>
                <span className="card-subheader">Your musical heroes</span>
              </div>
              <div className="card-content">
                <div className="artists-grid">
                  {analytics.topArtists.map((artist, index) => (
                    <div key={artist.id} className="artist-item" onClick={() => window.open(artist.external_urls?.spotify, '_blank')}>
                      <span className="artist-rank">#{index + 1}</span>
                      <div className="artist-image-container">
                        <Image 
                          src={artist.images?.[1]?.url || artist.images?.[0]?.url || '/placeholder-album.png'} 
                          alt={artist.name}
                          width={80}
                          height={80}
                          className="artist-image"
                        />
                      </div>
                      <h3 className="artist-name">{artist.name}</h3>
                      <p className="artist-genres">{artist.genres?.slice(0, 2).join(', ')}</p>
                      <span className="artist-popularity">{artist.popularity}/100 popularity</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="tab-content">
            <div className="card">
              <div className="card-header">
                <h2>AI-Powered Insights</h2>
                {!subscription.isPremium && (
                  <span className="premium-badge">Upgrade for advanced insights</span>
                )}
              </div>
              <div className="card-content">
                <div className="insights-container">
                  <h3>{insights?.musicPersonality}</h3>
                  <div className="insights-list">
                    {insights?.insights?.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <span className="insight-icon">💡</span>
                        <p>{insight}</p>
                      </div>
                    ))}
                  </div>
                  <div className="recommendations-list">
                    <h4>Recommendations</h4>
                    {insights?.recommendations?.map((rec, index) => (
                      <div key={index} className="recommendation-item">
                        <span className="rec-icon">🎯</span>
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {subscription.isPremium && (
              <div className="card">
                <div className="card-header">
                  <h2>AI Playlist Generator</h2>
                </div>
                <div className="card-content">
                  <div className="playlist-generator">
                    <textarea 
                      placeholder="Describe the type of playlist you want... (e.g., 'upbeat songs for working out', 'chill music for studying')"
                      className="playlist-prompt"
                      rows={3}
                    />
                    <button className="btn btn-primary">
                      Generate Playlist with AI
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}