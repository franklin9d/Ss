'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  FiUsers,
  FiDollarSign,
  FiFile,
  FiTrendingUp,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  proUsers: number;
  totalFiles: number;
  totalRevenue: number;
  conversionRate: string;
  recentActivity: {
    id: string;
    action: string;
    userName: string;
    details: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user as Record<string, unknown> | undefined;

  useEffect(() => {
    if (session && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchStats();
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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FiShield className="text-indigo-400" size={24} />
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            </div>
            <p className="text-gray-400">System overview and management</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-all"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/logs"
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition-all"
            >
              View Logs
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <FiUsers className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-white text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pro Users</p>
                <p className="text-white text-2xl font-bold">{stats?.proUsers || 0}</p>
                <p className="text-gray-600 text-xs">{stats?.conversionRate || '0'}% conversion</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FiDollarSign className="text-emerald-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-white text-2xl font-bold">
                  ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <FiFile className="text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Files Processed</p>
                <p className="text-white text-2xl font-bold">{stats?.totalFiles || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h2 className="text-white font-semibold">Recent Activity</h2>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="info">{activity.action}</Badge>
                      <span className="text-white text-sm">{activity.userName}</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
