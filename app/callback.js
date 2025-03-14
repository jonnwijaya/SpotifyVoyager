// app/callback.js
"use client"; // Mark this as a client component

import { useEffect, useState } from 'react'; // Import React hooks
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Callback = () => {
  const router = useRouter(); // Initialize the router
  const [userProfile, setUserProfile] = useState(null); // State to hold user profile data
  const [error, setError] = useState(null); // State to hold any error messages

  useEffect(() => {
    const hash = window.location.hash; // Get the URL hash
    if (hash) {
      const token = hash.split('&')[0].split('=')[1]; // Extract the access token from the hash
      if (token) {
        // Store the token in local storage
        localStorage.setItem('spotifyAccessToken', token);
        // Fetch user profile data
        fetchUserProfile(token);
        // Clear the hash from the URL
        window.location.hash = '';
      }
    }
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Set the authorization header with the access token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile'); // Handle errors
      }

      const data = await response.json(); // Parse the response data
      setUserProfile(data); // Set the user profile data in state
    } catch (err) {
      setError(err.message); // Set error message in state
    }
  };

  // Redirect to homepage or another page after fetching user data
  useEffect(() => {
    if (userProfile) {
      router.push('/'); // Redirect to the homepage or another route
    }
  }, [userProfile, router]);

  return (
    <div>
      {error && <p>Error: {error}</p>} {/* Display error message if any */}
      {userProfile ? (
        <div>
          <h1>Welcome, {userProfile.display_name}!</h1> {/* Display user's name */}
          <img src={userProfile.images[0]?.url} alt="Profile" /> {/* Display user's profile image */}
          <p>Email: {userProfile.email}</p> {/* Display user's email */}
        </div>
      ) : (
        <p>Loading user profile...</p> // Show loading message while fetching data
      )}
    </div>
  );
};

export default Callback; // Export the Callback component
