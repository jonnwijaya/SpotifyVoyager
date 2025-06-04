
// Client-side AI service functions that call server-side APIs

export const generatePersonalizedInsights = async (userAnalytics, isPremium = false) => {
  try {
    const response = await fetch('/api/generate-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userAnalytics, isPremium }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate insights');
    }

    return await response.json();
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
