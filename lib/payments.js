
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    priceId: 'price_premium_monthly', // Replace with your Stripe price ID
    features: [
      'AI-Generated Playlists',
      'Advanced Analytics',
      'Unlimited Receipt Downloads',
      'Priority Support',
      'Custom Sharing Options'
    ]
  }
};

export const createCheckoutSession = async (plan) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: plan.priceId,
        planId: plan.id
      }),
    });

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`/api/subscription-status?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isPremium: false };
  }
};
