'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { FiCheck, FiX, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const user = session?.user as Record<string, unknown> | undefined;

  const handleUpgrade = async () => {
    if (!session) {
      router.push('/register');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType: billingPeriod }),
      });

      const data = await res.json();
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        toast.error(data.error || 'Failed to start checkout');
      }
    } catch {
      toast.error('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for occasional use',
      features: [
        { text: '5 conversions per day', included: true },
        { text: '10MB max file size', included: true },
        { text: 'Basic file formats', included: true },
        { text: 'Standard processing speed', included: true },
        { text: 'Community support', included: true },
        { text: 'Unlimited conversions', included: false },
        { text: 'Priority processing', included: false },
        { text: 'No ads', included: false },
        { text: 'API access', included: false },
        { text: 'Batch processing', included: false },
      ],
      cta: user ? 'Current Plan' : 'Get Started',
      href: user ? undefined : '/register',
      popular: false,
      disabled: !!user,
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For professionals and teams',
      features: [
        { text: 'Unlimited conversions', included: true },
        { text: '100MB max file size', included: true },
        { text: 'All file formats', included: true },
        { text: 'Priority processing', included: true },
        { text: 'Priority support', included: true },
        { text: 'No ads', included: true },
        { text: 'API access', included: true },
        { text: 'Batch processing', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced analytics', included: true },
      ],
      cta: user?.plan === 'PRO' ? 'Current Plan' : 'Upgrade to Pro',
      popular: true,
      disabled: user?.plan === 'PRO',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Start free and upgrade when you need more. No hidden fees, no surprises.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-gray-900/50 border border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <FiZap size={12} />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-white font-semibold text-xl mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    ${plan.price[billingPeriod]}
                  </span>
                  <span className="text-gray-500 ml-1">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                  {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-emerald-400 text-sm mt-1">
                      ${((plan.price.yearly) / 12).toFixed(2)}/mo billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {feature.included ? (
                        <FiCheck className="text-indigo-400 flex-shrink-0" size={16} />
                      ) : (
                        <FiX className="text-gray-700 flex-shrink-0" size={16} />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {plan.popular ? (
                  <Button
                    onClick={handleUpgrade}
                    loading={loading}
                    disabled={plan.disabled as boolean}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  plan.href ? (
                    <Button
                      variant="outline"
                      onClick={() => router.push(plan.href!)}
                      disabled={plan.disabled as boolean}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  )
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mt-20">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Can I cancel my subscription anytime?',
                  a: 'Yes, you can cancel your Pro subscription at any time. You will continue to have access until the end of your billing period.',
                },
                {
                  q: 'What happens to my files?',
                  a: 'All uploaded files are automatically deleted after 24 hours. We never store your files permanently.',
                },
                {
                  q: 'Is there a refund policy?',
                  a: 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied, contact us for a full refund.',
                },
                {
                  q: 'Do you offer team plans?',
                  a: 'Team plans are coming soon. Contact us for enterprise pricing and custom solutions.',
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
                >
                  <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
