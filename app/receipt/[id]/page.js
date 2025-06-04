
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserAnalytics } from '@/lib/analytics';
import Image from 'next/image';

export default function Receipt() {
  const params = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceiptData() {
      try {
        const data = await getUserAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading receipt:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReceiptData();
  }, []);

  const downloadReceipt = () => {
    const receiptElement = document.getElementById('music-receipt');
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(receiptElement, {
        backgroundColor: '#000',
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `spotify-receipt-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  const shareOnTwitter = () => {
    const text = `Check out my Spotify music receipt! 🎵 My top genre is ${analytics?.insights.topGenres[0]?.genre} and I'm a ${analytics?.insights.musicMood?.mood} listener.`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnInstagram = () => {
    // For Instagram, we'll download the image and provide instructions
    downloadReceipt();
    alert('Image downloaded! Upload it to your Instagram story and tag us @spotifyvoyager');
  };

  if (loading) {
    return (
      <div className="receipt-loading">
        <div className="loading-container">
          <div className="logo-icon pulse">SV</div>
          <h2>Generating Your Receipt...</h2>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="receipt-error">
        <h2>Receipt not found</h2>
        <p>This receipt may have expired or doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="receipt-page">
      <div className="receipt-controls">
        <button onClick={downloadReceipt} className="btn btn-primary">
          📥 Download
        </button>
        <button onClick={shareOnTwitter} className="btn btn-social">
          🐦 Twitter
        </button>
        <button onClick={shareOnInstagram} className="btn btn-social">
          📸 Instagram
        </button>
      </div>

      <div id="music-receipt" className="music-receipt">
        <div className="receipt-header">
          <h1>SPOTIFY VOYAGER</h1>
          <p>Music Taste Receipt</p>
          <div className="receipt-date">
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="receipt-profile">
          <div className="profile-section">
            <h2>{analytics.profile?.display_name}</h2>
            <p className="music-personality">{analytics.insights?.musicMood?.mood || 'Balanced'} Listener</p>
          </div>
        </div>

        <div className="receipt-section">
          <h3>TOP GENRES</h3>
          <div className="receipt-list">
            {analytics.insights.topGenres.slice(0, 5).map((genre, index) => (
              <div key={genre.genre} className="receipt-item">
                <span className="item-name">{genre.genre}</span>
                <span className="item-value">{genre.count}x</span>
              </div>
            ))}
          </div>
        </div>

        <div className="receipt-section">
          <h3>TOP TRACKS</h3>
          <div className="receipt-list">
            {analytics.topTracks.slice(0, 5).map((track, index) => (
              <div key={track.id} className="receipt-item">
                <div className="track-info">
                  <span className="track-name">{track.name}</span>
                  <span className="track-artist">{track.artists[0]?.name}</span>
                </div>
                <span className="track-duration">
                  {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="receipt-section">
          <h3>TOP ARTISTS</h3>
          <div className="receipt-list">
            {analytics.topArtists.slice(0, 5).map((artist, index) => (
              <div key={artist.id} className="receipt-item">
                <span className="artist-name">{artist.name}</span>
                <span className="artist-popularity">{artist.popularity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="receipt-stats">
          <div className="stat-row">
            <span>Listening Time:</span>
            <span>{analytics.insights.listeningTime.formatted}</span>
          </div>
          <div className="stat-row">
            <span>Discovery Score:</span>
            <span>{Math.round(analytics.insights.discoveryScore)}/100</span>
          </div>
          <div className="stat-row">
            <span>Vintage Score:</span>
            <span>{Math.round(analytics.insights.vintageScore)}/100</span>
          </div>
        </div>

        <div className="receipt-footer">
          <p>Thank you for using Spotify Voyager!</p>
          <p>Share your musical journey</p>
          <div className="receipt-id">Receipt #{params.id}</div>
        </div>
      </div>
    </div>
  );
}
