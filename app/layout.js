// app/layout.js
import './globals.css';

// Metadata export without themeColor
export const metadata = {
  title: 'Spotify Voyager',
  description: 'Discover and manage your music experience effortlessly with Spotify integration.',
  keywords: 'Spotify, music, playlists, tracks, discover',
  authors: [{ name: 'Jonn' }],
};

// New viewport export for themeColor
export const viewport = {
  themeColor: '#1DB954',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
