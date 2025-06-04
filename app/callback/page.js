"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Image from 'next/image';

export default function Callback() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval;

    if (loading) {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          const increment = prevProgress < 50 ? 8 : (prevProgress < 80 ? 4 : 2);
          return Math.min(prevProgress + increment, 90);
        });
      }, 150);
    }

    async function handleCallback() {
      try {
        setLoading(true);

        const hash = window.location.hash;
        if (!hash) {
          throw new Error('No authentication data found in URL');
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if (!accessToken) {
          throw new Error('No access token found');
        }

        const expirationTime = Date.now() + (parseInt(expiresIn) * 1000);

        localStorage.setItem('spotifyAccessToken', accessToken);
        localStorage.setItem('tokenExpiration', expirationTime.toString());

        const userData = await fetchUserProfile(accessToken);

        if (userData) {
          await storeUserInSupabase(userData);
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);

        setProgress(100);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
        setProgress(0);
      } finally {
        setLoading(false);
        if (progressInterval) clearInterval(progressInterval);
      }
    }

    handleCallback();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [router]);

  async function fetchUserProfile(accessToken) {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      throw new Error(`Profile fetch failed: ${err.message}`);
    }
  }

  async function storeUserInSupabase(userData) {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          spotify_id: userData.id,
          email: userData.email,
          display_name: userData.display_name,
          profile_image: userData.images?.[0]?.url || null,
          country: userData.country,
          product_type: userData.product,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'spotify_id' });

      if (error) throw error;
    } catch (err) {
      console.error('Error storing user in Supabase:', err);
      // Don't throw here as it's not critical for the auth flow
    }
  }

  return (
    <div className="callback-page">
      <div className="callback-container">
        {error ? (
          <div className="card error-card">
            <div className="error-icon">!</div>
            <h2>Authentication Error</h2>
            <p className="error-message">{error}</p>
            <button 
              className="btn btn-danger"
              onClick={() => router.push('/')}
            >
              Return to Home
            </button>
          </div>
        ) : loading ? (
          <div className="card">
            <div className="card-content" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <div className="logo-icon pulse" style={{ margin: '0 auto var(--space-lg)' }}>
                SV
              </div>
              <h2 style={{ marginBottom: 'var(--space-md)' }}>Connecting to Spotify</h2>
              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-600)' }}>
                Preparing your musical journey...
              </p>

              <div className="progress-bar-container">
                <div 
                  className="progress-bar-cosmic"
                  style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
                ></div>
              </div>

              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-md)' }}>
                {progress < 30 ? 'Authenticating...' : 
                 progress < 60 ? 'Retrieving your profile...' : 
                 progress < 90 ? 'Preparing your dashboard...' : 
                 'Ready to launch!'}
              </p>
            </div>
          </div>
        ) : userProfile ? (
          <div className="card">
            <div className="card-content" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <div style={{
                width: '100px',
                height: '100px',
                margin: '0 auto var(--space-lg)',
                borderRadius: 'var(--border-radius-full)',
                overflow: 'hidden',
                border: '3px solid var(--color-primary)',
                boxShadow: 'var(--shadow-lg)'
              }}>
                {userProfile.images?.[0]?.url ? (
                  <Image 
                    src={userProfile.images[0].url} 
                    alt="Profile" 
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--color-gray-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--font-size-3xl)'
                  }}>
                    {userProfile.display_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>

              <h2 style={{ 
                marginBottom: 'var(--space-xs)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Welcome, {userProfile.display_name}!
              </h2>

              <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-600)' }}>
                {userProfile.email}
              </p>

              <div className="progress-bar-container">
                <div className="progress-bar-cosmic" style={{ width: '100%' }}></div>
              </div>

              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', marginTop: 'var(--space-md)' }}>
                Launching your dashboard...
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}