import Stripe from 'stripe';

// Lazy Stripe client – only created at runtime, never at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Keep backward compat: `stripe` getter triggers lazy init
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getStripe() as any)[prop];
  },
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
