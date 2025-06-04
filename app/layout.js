
import './globals.css';

export const metadata = {
  title: 'Spotify Voyager - Your Musical Journey Awaits',
  description: 'Discover and manage your music experience effortlessly with Spotify integration. Track your favorite songs, explore analytics, and navigate your musical universe.',
  keywords: 'Spotify, music, playlists, tracks, discover, analytics, dashboard',
  authors: [{ name: 'Spotify Voyager Team' }],
  openGraph: {
    title: 'Spotify Voyager',
    description: 'Your personal music companion for Spotify',
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#1DB954',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
