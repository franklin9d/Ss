import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  typescript: true,
});

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month' as const,
    features: [
      '5 conversions per day',
      '10MB max file size',
      'Basic file formats',
      'Standard processing speed',
      'Community support',
    ],
    limits: {
      dailyConversions: 5,
      maxFileSize: '10MB',
      priority: 'standard',
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month' as const,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited conversions',
      '100MB max file size',
      'All file formats',
      'Priority processing',
      'No ads',
      'Priority support',
      'Batch processing',
      'API access',
    ],
    limits: {
      dailyConversions: 'unlimited' as const,
      maxFileSize: '100MB',
      priority: 'high',
    },
    popular: true,
  },
  PRO_YEARLY: {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: 99.99,
    interval: 'year' as const,
    features: [
      'Everything in Pro',
      '2 months free',
      'Unlimited conversions',
      '100MB max file size',
    ],
    limits: {
      dailyConversions: 'unlimited' as const,
      maxFileSize: '100MB',
      priority: 'high',
    },
  },
};
