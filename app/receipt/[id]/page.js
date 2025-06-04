
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/spotify';
import { getUserAnalytics } from '@/lib/analytics';
import html2canvas from 'html2canvas';

export default function MusicDNACard({ params }) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        if (!isAuthenticated()) {
          router.push('/');
          return;
        }

        setLoading(true);
        const data = await getUserAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load your music data');
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [router]);

  const downloadCard = async () => {
    try {
      const element = document.getElementById('music-dna-card');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const link = document.createElement('a');
      link.download = `music-dna-${params.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const shareToInstagram = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Music DNA',
        text: 'Check out my Music DNA from Spotify Voyager!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="card-loading">
        <div className="loading-container">
          <div className="logo-icon pulse" style={{ 
            fontSize: '4rem', 
            marginBottom: 'var(--space-6)',
            width: '80px',
            height: '80px'
          }}>🧬</div>
          <h2>Analyzing Your Music DNA...</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Decoding your musical genome
          </p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="card-error">
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div className="error-icon">!</div>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Unable to Generate Music DNA</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            {error || 'Something went wrong while analyzing your music data.'}
          </p>
          <button onClick={() => router.push('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dna-card-page">
      <div className="card-controls">
        <button onClick={downloadCard} className="btn-social">
          📥 Download Card
        </button>
        <button onClick={shareToInstagram} className="btn-instagram">
          📱 Share Story
        </button>
        <button onClick={() => router.push('/dashboard')} className="btn-social">
          ← Back to Dashboard
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
          <p className="dna-subtitle">Your Musical Genome Analysis</p>
        </div>

        <div className="dna-profile">
          <div className="profile-circle">
            <span className="profile-initial">
              {analytics.profile?.display_name?.charAt(0) || 'M'}
            </span>
          </div>
          <h2 className="profile-name">{analytics.profile?.display_name || 'Music Lover'}</h2>
          <div className="music-type">
            {analytics.insights?.musicMood?.mood || 'Eclectic Explorer'}
          </div>
        </div>

        <div className="dna-stats-grid">
          <div className="dna-stat">
            <div className="stat-icon">🎵</div>
            <div className="stat-value">
              {analytics.insights?.topGenres?.[0]?.genre || 'Various'}
            </div>
            <div className="stat-label">Primary Genre</div>
          </div>
          <div className="dna-stat">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">
              {Math.round(analytics.insights?.discoveryScore || 75)}
            </div>
            <div className="stat-label">Discovery Score</div>
          </div>
          <div className="dna-stat">
            <div className="stat-icon">🕰️</div>
            <div className="stat-value">
              {Math.round(analytics.insights?.vintageScore || 60)}
            </div>
            <div className="stat-label">Vintage Score</div>
          </div>
        </div>

        <div className="dna-sequence">
          <h3>YOUR TOP MUSICAL GENES</h3>
          <div className="gene-chain">
            {analytics.topArtists?.slice(0, 3).map((artist, index) => (
              <div key={artist.id || index} className="gene-node">
                <div className="gene-symbol">{artist.name?.charAt(0) || '?'}</div>
                <span className="gene-label">{artist.name || 'Artist'}</span>
              </div>
            )) || [
              <div key="1" className="gene-node">
                <div className="gene-symbol">M</div>
                <span className="gene-label">Music</span>
              </div>,
              <div key="2" className="gene-node">
                <div className="gene-symbol">D</div>
                <span className="gene-label">DNA</span>
              </div>,
              <div key="3" className="gene-node">
                <div className="gene-symbol">V</div>
                <span className="gene-label">Voyager</span>
              </div>
            ]}
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
