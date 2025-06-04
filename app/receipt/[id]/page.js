
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserAnalytics } from '@/lib/analytics';
import Image from 'next/image';

export default function MusicDNACard() {
  const params = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCardData() {
      try {
        const data = await getUserAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading Music DNA Card:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCardData();
  }, []);

  const downloadCard = () => {
    const cardElement = document.getElementById('music-dna-card');
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(cardElement, {
        backgroundColor: '#0a0a0a',
        scale: 3,
        width: 1080,
        height: 1920,
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `music-dna-card-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  };

  const shareOnTwitter = () => {
    const text = `Just discovered my Music DNA! 🧬🎵 I'm a ${analytics?.insights.musicMood?.mood} listener with ${analytics?.insights.topGenres[0]?.genre} vibes ✨`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnInstagram = () => {
    downloadCard();
    alert('🎨 Your Music DNA Card is downloaded! Perfect for Instagram Stories - upload and tag @spotifyvoyager to share your musical personality! ✨');
  };

  if (loading) {
    return (
      <div className="card-loading">
        <div className="loading-container">
          <div className="logo-icon pulse">🧬</div>
          <h2>Analyzing Your Music DNA...</h2>
          <p>Extracting your musical genome...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card-error">
        <h2>Music DNA Card not found</h2>
        <p>This card may have expired or doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="dna-card-page">
      <div className="card-controls">
        <button onClick={downloadCard} className="btn btn-primary">
          📱 Download for Stories
        </button>
        <button onClick={shareOnTwitter} className="btn btn-social">
          🐦 Share
        </button>
        <button onClick={shareOnInstagram} className="btn btn-instagram">
          📸 Instagram
        </button>
      </div>

      <div id="music-dna-card" className="music-dna-card">
        <div className="dna-background">
          <div className="dna-helix"></div>
          <div className="dna-helix delayed"></div>
        </div>

        <div className="dna-header">
          <div className="dna-logo">🧬</div>
          <h1>MUSIC DNA</h1>
          <p className="dna-subtitle">Your Musical Genome</p>
        </div>

        <div className="dna-profile">
          <div className="profile-circle">
            <span className="profile-initial">{analytics.profile?.display_name?.charAt(0) || 'M'}</span>
          </div>
          <h2 className="profile-name">{analytics.profile?.display_name}</h2>
          <div className="music-type">{analytics.insights?.musicMood?.mood || 'Balanced'} TYPE</div>
        </div>

        <div className="dna-stats-grid">
          <div className="dna-stat">
            <div className="stat-icon">🎵</div>
            <div className="stat-value">{analytics.insights.topGenres[0]?.genre || 'Various'}</div>
            <div className="stat-label">Primary Genre</div>
          </div>
          <div className="dna-stat">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{Math.round(analytics.insights.discoveryScore)}</div>
            <div className="stat-label">Discovery Score</div>
          </div>
          <div className="dna-stat">
            <div className="stat-icon">🕰️</div>
            <div className="stat-value">{Math.round(analytics.insights.vintageScore)}</div>
            <div className="stat-label">Vintage Score</div>
          </div>
        </div>

        <div className="dna-sequence">
          <h3>YOUR TOP GENES</h3>
          <div className="gene-chain">
            {analytics.topArtists.slice(0, 3).map((artist, index) => (
              <div key={artist.id} className="gene-node">
                <div className="gene-symbol">{artist.name.charAt(0)}</div>
                <span className="gene-label">{artist.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dna-footer">
          <p>SPOTIFY VOYAGER</p>
          <p className="footer-code">DNA-{params.id}</p>
          <div className="footer-date">{new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
}
