
import { NextResponse } from 'next/server';
import { getUserAnalytics } from '@/lib/analytics';
import { checkSubscriptionStatus } from '@/lib/payments';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt, userId } = await request.json();

    // Check if user has premium subscription
    const subscription = await checkSubscriptionStatus(userId);
    
    if (!subscription.isPremium) {
      return NextResponse.json({ 
        error: 'Premium subscription required for AI playlist generation' 
      }, { status: 403 });
    }

    // Get user analytics
    const analytics = await getUserAnalytics();
    
    // Generate playlist with AI
    const systemPrompt = `You are a music expert AI that creates Spotify playlists based on user listening data and preferences. 

User's music profile:
- Top genres: ${analytics.insights.topGenres.slice(0, 5).map(g => g.genre).join(', ')}
- Music mood: ${analytics.insights.musicMood?.mood || 'Unknown'}
- Top artists: ${analytics.topArtists.slice(0, 10).map(a => a.name).join(', ')}
- Discovery score: ${analytics.insights.discoveryScore}/100
- Vintage score: ${analytics.insights.vintageScore}/100

Generate a playlist of 20-30 songs that match the user's request. Consider their existing taste but also introduce some variety. Return the response as a JSON object with this structure:
{
  "title": "Playlist Title",
  "description": "Brief description of the playlist",
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "reason": "Why this song fits the playlist"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const playlist = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ 
      error: 'Failed to generate playlist' 
    }, { status: 500 });
  }
}
