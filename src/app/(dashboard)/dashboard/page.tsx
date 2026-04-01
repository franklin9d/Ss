'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
  FiFile,
  FiImage,
  FiFileText,
  FiPackage,
  FiTrendingUp,
  FiClock,
  FiHardDrive,
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  usage: {
    today: number;
    limit: number;
    bytesUsed: number;
  };
}

const quickTools = [
  { name: 'Merge PDF', icon: FiFile, href: '/tools/pdf', operation: 'MERGE_PDF', color: 'from-red-500 to-orange-500' },
  { name: 'Compress Image', icon: FiImage, href: '/tools/images', operation: 'IMAGE_COMPRESS', color: 'from-blue-500 to-cyan-500' },
  { name: 'Word to PDF', icon: FiFileText, href: '/tools/docs', operation: 'WORD_TO_PDF', color: 'from-emerald-500 to-teal-500' },
  { name: 'Create ZIP', icon: FiPackage, href: '/tools/utilities', operation: 'ZIP_CREATE', color: 'from-yellow-500 to-orange-500' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);

  const user = session?.user as Record<string, unknown> | undefined;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const usagePercentage = userData
    ? userData.usage.limit === Infinity
      ? 0
      : (userData.usage.today / userData.usage.limit) * 100
    : 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {(user?.name as string)?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-400">
          Here&apos;s what&apos;s happening with your file processing today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Today&apos;s Usage</p>
              <p className="text-white text-2xl font-bold">
                {userData?.usage.today || 0}
                <span className="text-gray-500 text-sm font-normal">
                  /{userData?.usage.limit === Infinity ? '∞' : userData?.usage.limit || 5}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <FiHardDrive className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Data Processed</p>
              <p className="text-white text-2xl font-bold">
                {formatBytes(userData?.usage.bytesUsed || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <FiZap className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Plan</p>
              <Badge variant={user?.plan === 'PRO' ? 'pro' : 'default'}>
                {(user?.plan as string) || 'FREE'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <FiClock className="text-yellow-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Avg. Speed</p>
              <p className="text-white text-2xl font-bold">
                {user?.plan === 'PRO' ? '<1s' : '~2s'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Bar */}
      {user?.plan !== 'PRO' && (
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-medium">Daily Usage</p>
              <p className="text-gray-400 text-sm">
                {userData?.usage.today || 0} / {userData?.usage.limit || 5} conversions
              </p>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {usagePercentage >= 80 && (
              <p className="text-yellow-400 text-sm mt-2">
                Running low on conversions.{' '}
                <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Upgrade to Pro
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Tools */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Quick Tools</h2>
          <Link href="/tools" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card hover className="h-full">
                <CardContent className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <tool.icon className="text-white" size={20} />
                  </div>
                  <span className="text-white font-medium text-sm">{tool.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade Banner */}
      {user?.plan !== 'PRO' && (
        <Card glow>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                Unlock Unlimited Power
              </h3>
              <p className="text-gray-400 text-sm">
                Upgrade to Pro for unlimited conversions, larger files, and priority processing.
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Upgrade to Pro - $9.99/mo
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
