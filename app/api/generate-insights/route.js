import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const body = await request.text();
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      );
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { userAnalytics, isPremium } = data;

    if (!isPremium) {
      return NextResponse.json(generateBasicInsights(userAnalytics));
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

    const insights = JSON.parse(completion.choices[0].message.content);
    return NextResponse.json(insights);
  } catch (error) {
    console.error('AI insights generation error:', error);
    const basicInsights = generateBasicInsights(userAnalytics);
    return NextResponse.json(basicInsights);
  }
}

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