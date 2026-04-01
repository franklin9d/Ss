'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { FiShield, FiDollarSign, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

interface RevenueData {
  totalRevenue: number;
  proUsers: number;
  totalUsers: number;
  conversionRate: string;
}

export default function AdminRevenuePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user as Record<string, unknown> | undefined;

  useEffect(() => {
    if (session && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch revenue data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchData();
  }, [session, user?.role, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <FiRefreshCw className="animate-spin text-indigo-400" size={32} />
        </div>
      </div>
    );
  }

  const mrr = (data?.proUsers || 0) * 9.99;
  const arr = mrr * 12;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-indigo-400" size={24} />
          <h1 className="text-3xl font-bold text-white">Revenue Analytics</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FiDollarSign className="text-emerald-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-white text-2xl font-bold">
                  ${data?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">MRR</p>
                <p className="text-white text-2xl font-bold">${mrr.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">ARR</p>
                <p className="text-white text-2xl font-bold">${arr.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-white text-2xl font-bold">{data?.conversionRate || '0'}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-white font-semibold">Subscription Breakdown</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-600 rounded-full" />
                    <span className="text-gray-300">Free Users</span>
                  </div>
                  <span className="text-white font-medium">
                    {(data?.totalUsers || 0) - (data?.proUsers || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                    <span className="text-gray-300">Pro Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{data?.proUsers || 0}</span>
                    <Badge variant="pro">PRO</Badge>
                  </div>
                </div>
              </div>

              {/* Simple bar visualization */}
              <div className="mt-6">
                <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
                    style={{
                      width: `${data?.totalUsers ? ((data.proUsers / data.totalUsers) * 100) : 0}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Free: {((1 - (data?.proUsers || 0) / Math.max(data?.totalUsers || 1, 1)) * 100).toFixed(0)}%</span>
                  <span>Pro: {data?.conversionRate || '0'}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-white font-semibold">Revenue Metrics</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Average Revenue Per User (ARPU)</span>
                  <span className="text-white font-medium">
                    ${data?.totalUsers ? ((data.totalRevenue || 0) / data.totalUsers).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Pro Plan Price</span>
                  <span className="text-white font-medium">$9.99/mo</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
                  <span className="text-gray-400 text-sm">Yearly Plan Price</span>
                  <span className="text-white font-medium">$99.99/yr</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400 text-sm">Lifetime Value (est.)</span>
                  <span className="text-white font-medium">
                    ${(mrr > 0 ? (mrr * 12 / Math.max(data?.proUsers || 1, 1)).toFixed(2) : '0.00')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
