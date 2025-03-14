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

  useEffect(() => {
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
        
        window.history.replaceState({}, document.title, window.location.pathname);
        
        router.push('/dashboard');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    }
    
    handleCallback();
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
      <div className="container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {error ? (
          <div className="error-message">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <button 
              className="btn btn-danger"
              onClick={() => router.push('/')}
            >
              Return to Home
            </button>
          </div>
        ) : loading ? (
          <div className="loading-container" style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px' }}>Authenticating with Spotify...</p>
          </div>
        ) : userProfile ? (
          <div className="success-message" style={{ textAlign: 'center' }}>
            <h1>Welcome, {userProfile.display_name}!</h1>
            {userProfile.images?.[0]?.url && (
              <Image 
                src={userProfile.images[0].url} 
                alt="Profile" 
                width={100} // Specify width
                height={100} // Specify height
                style={{ borderRadius: '50%', margin: '20px auto', objectFit: 'cover' }}
              />
            )}
            <p>Email: {userProfile.email}</p>
            <p style={{ marginTop: '20px' }}>Redirecting to dashboard...</p>
          </div>
        ) : (
          <p>Processing authentication...</p>
        )}
      </div>
    </div>
  );
}
