
import OpenAI from 'openai';

// Debug: Log the API key status
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is missing from environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('OPENAI')));
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePlaylistWithAI = async (userAnalytics, prompt, isPremium = false) => {
  try {
    if (!isPremium) {
      throw new Error('AI playlist generation requires premium subscription');
    }

    const systemPrompt = `You are a music expert AI that creates Spotify playlists based on user listening data and preferences. 

User's music profile:
- Top genres: ${userAnalytics.insights.topGenres.slice(0, 5).map(g => g.genre).join(', ')}
- Music mood: ${userAnalytics.insights.musicMood?.mood || 'Unknown'}
- Top artists: ${userAnalytics.topArtists.slice(0, 10).map(a => a.name).join(', ')}
- Discovery score: ${userAnalytics.insights.discoveryScore}/100
- Vintage score: ${userAnalytics.insights.vintageScore}/100

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

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('AI playlist generation error:', error);
    throw error;
  }
};

export const generatePersonalizedInsights = async (userAnalytics, isPremium = false) => {
  try {
    if (!isPremium) {
      return generateBasicInsights(userAnalytics);
    }

    const systemPrompt = `You are a music analyst AI. Analyze the user's listening data and provide personalized insights. Be creative, fun, and insightful.

User's listening data:
- Top genres: ${userAnalytics.insights.topGenres.slice(0, 5).map(g => `${g.genre} (${g.count} artists)`).join(', ')}
- Listening time: ${userAnalytics.insights.listeningTime.formatted}
- Music mood: ${userAnalytics.insights.musicMood?.mood || 'Unknown'}
- Discovery score: ${userAnalytics.insights.discoveryScore}/100
- Vintage score: ${userAnalytics.insights.vintageScore}/100
- Top artists: ${userAnalytics.topArtists.slice(0, 5).map(a => a.name).join(', ')}

Provide insights in this JSON format:
{
  "musicPersonality": "A fun title describing their music personality",
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.8,
      max_tokens: 1000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('AI insights generation error:', error);
    return generateBasicInsights(userAnalytics);
  }
};

const generateBasicInsights = (userAnalytics) => {
  const topGenre = userAnalytics.insights.topGenres[0]?.genre || 'Unknown';
  const mood = userAnalytics.insights.musicMood?.mood || 'Balanced';
  
  return {
    musicPersonality: `The ${topGenre} ${mood} Listener`,
    insights: [
      `Your music taste leans heavily towards ${topGenre}`,
      `You have a ${mood.toLowerCase()} listening style`,
      `You've discovered ${userAnalytics.insights.discoveryScore > 50 ? 'many underground' : 'mostly popular'} artists`
    ],
    recommendations: [
      'Try exploring related genres to expand your taste',
      'Check out new releases from your favorite artists'
    ]
  };
};
