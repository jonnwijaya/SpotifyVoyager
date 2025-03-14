// app/layout.js
export const metadata = {
  title: 'Spotify Voyager', // Title of the application
  description: 'Discover and manage your music experience effortlessly.', // Description for SEO
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"> {/* Set the language of the document */}
      <body>{children}</body> {/* Render child components here */}
    </html>
  );
}
