// app/layout.js
import './globals.css'; // Import CSS from the app directory, not from styles

// Define application metadata for SEO and browser tabs
export const metadata = {
  title: 'Spotify Voyager', // Application title
  description: 'Discover and manage your music experience effortlessly with Spotify integration.',
  keywords: 'Spotify, music, playlists, tracks, discover', // Keywords for SEO
  authors: [{ name: 'Your Name' }], // Author information
  themeColor: '#1DB954', // Spotify green color
};

// Root layout component that wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en"> {/* Set document language */}
      <body className="bg-gray-50 min-h-screen"> {/* Set minimum height and background */}
        {children} {/* Render child components/pages */}
      </body>
    </html>
  );
}