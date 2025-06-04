
import { spotifyFetch } from './spotify';

/**
 * Comprehensive music analytics service
 */

export const getUserAnalytics = async () => {
  try {
    const [
      profile,
      topTracks,
      topArtists,
      recentlyPlayed,
      audioFeatures,
      playlists
    ] = await Promise.all([
      spotifyFetch('/me'),
      spotifyFetch('/me/top/tracks?limit=50&time_range=medium_term'),
      spotifyFetch('/me/top/artists?limit=50&time_range=medium_term'),
      spotifyFetch('/me/player/recently-played?limit=50'),
      getTopTracksAudioFeatures(),
      spotifyFetch('/me/playlists?limit=50')
    ]);

    const analytics = {
      profile,
      topTracks: topTracks.items || [],
      topArtists: topArtists.items || [],
      recentlyPlayed: recentlyPlayed.items || [],
      audioFeatures,
      playlists: playlists.items || [],
      insights: generateInsights(topTracks.items, topArtists.items, audioFeatures)
    };

    return analytics;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

const getTopTracksAudioFeatures = async () => {
  try {
    const topTracks = await spotifyFetch('/me/top/tracks?limit=50&time_range=medium_term');
    const trackIds = topTracks.items?.map(track => track.id).join(',') || '';
    
    if (!trackIds) return {};
    
    const features = await spotifyFetch(`/audio-features?ids=${trackIds}`);
    return features.audio_features || [];
  } catch (error) {
    console.error('Error fetching audio features:', error);
    return [];
  }
};

const generateInsights = (tracks, artists, audioFeatures) => {
  const insights = {
    totalTracks: tracks?.length || 0,
    totalArtists: artists?.length || 0,
    topGenres: extractTopGenres(artists),
    listeningTime: calculateListeningTime(tracks),
    musicMood: analyzeMusicMood(audioFeatures),
    discoveryScore: calculateDiscoveryScore(artists),
    vintageScore: calculateVintageScore(tracks)
  };

  return insights;
};

const extractTopGenres = (artists) => {
  const genreCounts = {};
  
  artists?.forEach(artist => {
    artist.genres?.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  return Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([genre, count]) => ({ genre, count }));
};

const calculateListeningTime = (tracks) => {
  const totalMs = tracks?.reduce((sum, track) => sum + (track.duration_ms || 0), 0) || 0;
  const hours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
  return {
    totalMs,
    hours,
    formatted: `${Math.floor(hours)} hours ${Math.round((hours % 1) * 60)} minutes`
  };
};

const analyzeMusicMood = (audioFeatures) => {
  if (!audioFeatures || audioFeatures.length === 0) return null;

  const avgFeatures = audioFeatures.reduce((acc, feature) => {
    if (!feature) return acc;
    
    acc.energy += feature.energy || 0;
    acc.danceability += feature.danceability || 0;
    acc.valence += feature.valence || 0;
    acc.acousticness += feature.acousticness || 0;
    acc.instrumentalness += feature.instrumentalness || 0;
    acc.count++;
    
    return acc;
  }, { energy: 0, danceability: 0, valence: 0, acousticness: 0, instrumentalness: 0, count: 0 });

  if (avgFeatures.count === 0) return null;

  const count = avgFeatures.count;
  return {
    energy: avgFeatures.energy / count,
    danceability: avgFeatures.danceability / count,
    valence: avgFeatures.valence / count,
    acousticness: avgFeatures.acousticness / count,
    instrumentalness: avgFeatures.instrumentalness / count,
    mood: determineMood(avgFeatures.valence / count, avgFeatures.energy / count)
  };
};

const determineMood = (valence, energy) => {
  if (valence > 0.6 && energy > 0.6) return 'Energetic & Happy';
  if (valence > 0.6 && energy < 0.4) return 'Calm & Happy';
  if (valence < 0.4 && energy > 0.6) return 'Intense & Dark';
  if (valence < 0.4 && energy < 0.4) return 'Melancholic';
  return 'Balanced';
};

const calculateDiscoveryScore = (artists) => {
  if (!artists || artists.length === 0) return 0;
  
  const avgPopularity = artists.reduce((sum, artist) => sum + (artist.popularity || 0), 0) / artists.length;
  return Math.max(0, 100 - avgPopularity); // Lower popularity = higher discovery score
};

const calculateVintageScore = (tracks) => {
  if (!tracks || tracks.length === 0) return 0;
  
  const currentYear = new Date().getFullYear();
  const avgAge = tracks.reduce((sum, track) => {
    const releaseYear = new Date(track.album?.release_date || currentYear).getFullYear();
    return sum + (currentYear - releaseYear);
  }, 0) / tracks.length;
  
  return Math.min(100, avgAge * 2); // Older music = higher vintage score
};

export const generateReceiptData = async () => {
  const analytics = await getUserAnalytics();
  
  return {
    ...analytics,
    receiptId: generateCardId(),
    generatedAt: new Date().toISOString(),
    shareableUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/receipt/${generateCardId()}`
  };
};

const generateCardId = () => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};
