
import { NextResponse } from 'next/server';
import { generatePlaylistWithAI } from '@/lib/aiService';
import { getUserAnalytics } from '@/lib/analytics';
import { checkSubscriptionStatus } from '@/lib/payments';

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
    const playlist = await generatePlaylistWithAI(analytics, prompt, true);

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ 
      error: 'Failed to generate playlist' 
    }, { status: 500 });
  }
}
