// app/page.js
"use client"; // Mark as client component since we use React hooks

import { useState, useEffect } from 'react'; // Import React hooks
import { useRouter } from 'next/navigation'; // Import Next.js router
import Header from '@/components/Header'; // Import the Header component
import { getSpotifyLoginUrl } from '@/lib/spotify'; // Import helper for Spotify login URL

export default function Home() {
  const router = useRouter(); // Initialize router for programmatic navigation
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  
  // Check for existing authentication on component mount
  useEffect(() => {
    // Check if user has a valid token
    const token = localStorage.getItem('spotifyAccessToken');
    const expiration = localStorage.getItem('tokenExpiration');
    
    if (token && expiration && parseInt(expiration) > Date.now()) {
      setIsAuthenticated(true); // Set authenticated if token exists and is valid
      router.push('/dashboard'); // Redirect to dashboard
    }
  }, [router]);

  // Handle login button click
  const handleLogin = () => {
    // Navigate to Spotify authorization URL
    window.location.href = getSpotifyLoginUrl();
  };

  return (
    <div className="bg-white">
      {/* Include the Header component */}
      <Header />
      
      {/* Hero Section with Background */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background gradient effect */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#1DB954] to-[#191414] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        {/* Main content section */}
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              SPOTIFY VOYAGER
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-600 sm:text-xl max-w-3xl mx-auto">
              Discover and manage your music experience effortlessly. Track your favorite songs, explore new features,
              and engage with the Spotify community—all in a sleek, user-friendly interface.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleLogin}
                className="rounded-md bg-[#1DB954] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1AA74A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DB954] transition-colors"
              >
                Connect with Spotify
              </button>
              <a href="#features" className="text-sm font-semibold text-gray-900 hover:text-[#1DB954] transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* You can add more sections like Features, How it Works, etc. */}
    </div>
  );
}