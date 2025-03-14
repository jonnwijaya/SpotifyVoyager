// app/page.js
"use client"; // Mark this as a client component

import { useState, useEffect } from 'react'; // Import React hooks
import { Dialog, DialogPanel } from '@headlessui/react'; // Import Dialog components for mobile menu
import { XMarkIcon } from '@heroicons/react/24/outline'; // Import icons
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Get Supabase URL from environment variable
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Get Supabase anon key from environment variable
const supabase = createClient(supabaseUrl, supabaseAnonKey); // Create Supabase client

// Spotify API login URL
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // Get Spotify client ID from environment variable
const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`; // Set redirect URI for Spotify login
const scopes = 'user-read-private user-read-email'; // Define the scopes for Spotify API access
const spotifyLoginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`; // Construct the Spotify login URL

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const [userProfile, setUserProfile] = useState(null); // State for user profile data

  // Function to fetch user profile data from Spotify
  const fetchUserProfile = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Set the authorization header with the access token
      },
    });
    const data = await response.json(); // Parse the response data
    setUserProfile(data); // Set the user profile data in state
  };

  // Handle the access token from the URL
  useEffect(() => {
    const hash = window.location.hash; // Get the URL hash
    if (hash) {
      const token = hash.split('&')[0].split('=')[1]; // Extract the access token from the hash
      if (token) {
        fetchUserProfile(token); // Fetch user profile data
        // Clear the hash from the URL
        window.location.hash = '';
      }
    }
  }, []);

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              SPOTIFY VOYAGER
            </h1>
            <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
              Welcome to Spotify Tracker! This intuitive web app helps you discover and manage your music experience effortlessly. Track your favorite songs, explore new features, and engage with the Spotify community—all in a sleek, user-friendly interface. Enjoy your music like never before!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={spotifyLoginUrl} // Redirect to Spotify login
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
