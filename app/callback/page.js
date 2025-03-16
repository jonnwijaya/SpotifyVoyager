// app/callback/page.js
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
  const [progress, setProgress] = useState(0); // Track authentication progress

  useEffect(() => {
    // Animation for the progress bar
    let progressInterval;
    if (loading) {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          // Slow down as we approach 90% to simulate waiting for network
          const increment = prevProgress < 50 ? 5 : (prevProgress < 80 ? 3 : 1);
          const newProgress = Math.min(prevProgress + increment, 90);
          return newProgress;
        });
      }, 200);
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
        
        // Remove hash parameters from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Complete the progress animation
        setProgress(100);
        
        // Short delay before redirect to show completion
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
        setProgress(0); // Reset progress on error
      } finally {
        setLoading(false);
        clearInterval(progressInterval);
      }
    }
    
    handleCallback();

    return () => clearInterval(progressInterval);
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
      setError(err.message);
      return null;
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
          updated_at: new Date().toISOString(),
        }, { onConflict: 'spotify_id' });

      if (error) throw error;
    } catch (err) {
      console.error('Error storing user in Supabase:', err);
    }
  }

  return (
    <div className="callback-page">
      <div className="callback-container">
        {error ? (
          // Error state with animated entrance
          <div className="card fade-in" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="card-content">
              <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto var(--space-lg)',
                  backgroundColor: 'var(--color-error)',
                  borderRadius: 'var(--border-radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '40px'
                }}>
                  !
                </div>
                <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>Authentication Error</h2>
                <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-700)' }}>{error}</p>
                <button 
                  className="btn btn-danger"
                  onClick={() => router.push('/')}
                  style={{ minWidth: '180px' }}
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          // Loading state with cosmic-themed animation
          <div className="card fade-in" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="card-content">
              <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                <div className="logo-icon" style={{ 
                  margin: '0 auto var(--space-lg)',
                  width: '80px',
                  height: '80px',
                  fontSize: '28px',
                  animation: 'pulse 2s infinite'
                }}>
                  SV
                </div>
                <h2 style={{ marginBottom: 'var(--space-md)' }}>Connecting to Spotify</h2>
                <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-600)' }}>
                  Preparing your musical journey...
                </p>
                
                {/* Progress bar */}
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--color-gray-200)',
                  borderRadius: 'var(--border-radius-full)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-md)'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius-full)',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                  {progress < 30 ? 'Authenticating...' : 
                   progress < 60 ? 'Retrieving your profile...' : 
                   progress < 90 ? 'Preparing your dashboard...' : 
                   'Ready to launch!'}
                </p>
              </div>
            </div>
          </div>
        ) : userProfile ? (
          // Success state with user profile
          <div className="card fade-in" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="card-content">
              <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto var(--space-lg)',
                  borderRadius: 'var(--border-radius-full)',
                  overflow: 'hidden',
                  border: '3px solid var(--color-primary)',
                  boxShadow: 'var(--shadow-md)'
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
                      backgroundColor: 'var(--color-gray-800)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '40px'
                    }}>
                      {userProfile.display_name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <h2 style={{ 
                  marginBottom: 'var(--space-xs)',
                  background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}>
                  Welcome, {userProfile.display_name}!
                </h2>
                
                <p style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-gray-600)' }}>
                  {userProfile.email}
                </p>
                
                {/* Progress bar for redirect */}
                <div style={{
                  height: '4px',
                  backgroundColor: 'var(--color-gray-200)',
                  borderRadius: 'var(--border-radius-full)',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-md)'
                }}>
                  <div style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--border-radius-full)',
                    animation: 'progress 0.8s linear'
                  }}></div>
                </div>
                
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                  Launching your dashboard...
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Processing state (rarely seen)
          <div className="card fade-in" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
            <div className="spinner"></div>
            <p style={{ textAlign: 'center', marginTop: 'var(--space-md)' }}>Processing authentication...</p>
          </div>
        )}
      </div>
      
      {/* Background animated elements */}
      <div className="auth-background">
        {/* Animated stars/notes effect would be handled in CSS */}
      </div>
      
      {/* Define keyframe animation for progress bar */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .auth-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}