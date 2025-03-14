// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Spotify Voyager',
  description: 'Discover and manage your music experience effortlessly with Spotify integration.',
  keywords: 'Spotify, music, playlists, tracks, discover',
  authors: [{ name: 'Your Name' }],
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