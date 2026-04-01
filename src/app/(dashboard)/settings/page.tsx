'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { FiUser, FiCreditCard, FiShield } from 'react-icons/fi';

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const [billingLoading, setBillingLoading] = useState(false);

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch('/api/payments/portal', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.data.url) {
        window.location.href = data.data.url;
      } else {
        toast.error('Failed to open billing portal');
      }
    } catch {
      toast.error('Failed to open billing portal');
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiUser className="text-indigo-400" size={20} />
              <h2 className="text-white font-semibold">Profile</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <p className="text-white">{(user?.name as string) || 'Not set'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <p className="text-white">{user?.email as string}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Plan</label>
              <Badge variant={user?.plan === 'PRO' ? 'pro' : 'default'}>
                {(user?.plan as string) || 'FREE'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-indigo-400" size={20} />
              <h2 className="text-white font-semibold">Subscription</h2>
            </div>
          </CardHeader>
          <CardContent>
            {user?.plan === 'PRO' ? (
              <div className="space-y-4">
                <p className="text-gray-400">
                  You&apos;re on the <span className="text-indigo-400 font-medium">Pro</span> plan.
                </p>
                <Button
                  variant="outline"
                  onClick={handleManageBilling}
                  loading={billingLoading}
                >
                  Manage Billing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400">
                  You&apos;re on the Free plan. Upgrade for unlimited access.
                </p>
                <Button
                  onClick={() => (window.location.href = '/pricing')}
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiShield className="text-indigo-400" size={20} />
              <h2 className="text-white font-semibold">Security</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-3">
                Your account is protected with industry-standard security measures.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Password hashed with bcrypt (12 rounds)
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  JWT tokens with 15-minute expiry
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Files encrypted and auto-deleted after 24h
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
