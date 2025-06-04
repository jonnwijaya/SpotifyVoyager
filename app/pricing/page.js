
"use client";

import { useState } from 'react';
import Header from '@/components/Header';
import { createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/payments';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true);
      await createCheckoutSession(plan);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-page">
      <Header />
      
      <div className="pricing-container">
        <div className="pricing-header">
          <h1>Choose Your Plan</h1>
          <p>Unlock the full power of your music analytics</p>
        </div>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="plan-header">
              <h2>Free</h2>
              <div className="price">
                <span className="amount">$0</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="plan-features">
              <ul>
                <li>✅ Basic music analytics</li>
                <li>✅ Top tracks and artists</li>
                <li>✅ Basic music receipt</li>
                <li>✅ Genre breakdown</li>
                <li>❌ AI-generated playlists</li>
                <li>❌ Advanced insights</li>
                <li>❌ Custom sharing options</li>
              </ul>
            </div>
            <button className="btn btn-outline" disabled>
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card premium-card">
            <div className="plan-header">
              <div className="popular-badge">Most Popular</div>
              <h2>Premium</h2>
              <div className="price">
                <span className="amount">${SUBSCRIPTION_PLANS.PREMIUM.price}</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="plan-features">
              <ul>
                {SUBSCRIPTION_PLANS.PREMIUM.features.map((feature, index) => (
                  <li key={index}>✅ {feature}</li>
                ))}
              </ul>
            </div>
            <button 
              className="btn btn-premium"
              onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.PREMIUM)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>

        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What is AI playlist generation?</h3>
              <p>Our AI analyzes your music taste and creates personalized playlists based on your preferences, mood, and listening history.</p>
            </div>
            <div className="faq-item">
              <h3>Can I cancel anytime?</h3>
              <p>Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h3>How does the Music DNA Card work?</h3>
              <p>We generate a beautiful, shareable Music DNA Card that analyzes your musical genome - perfect for Instagram Stories and social media sharing!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
