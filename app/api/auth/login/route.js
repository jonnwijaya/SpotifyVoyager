// app/api/auth/login/route.js
import { redirect } from 'next/navigation';
import { getSpotifyLoginUrl } from '@/lib/spotify';

export async function GET(request) {
  const loginUrl = getSpotifyLoginUrl();
  return redirect(loginUrl);
}