'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  FiGrid,
  FiFolder,
  FiClock,
  FiSettings,
  FiFile,
  FiImage,
  FiFilm,
  FiFileText,
  FiPackage,
  FiStar,
} from 'react-icons/fi';
import Badge from '@/components/ui/Badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
  { name: 'All Tools', href: '/tools', icon: FiFolder },
  { name: 'History', href: '/history', icon: FiClock },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

const toolCategories = [
  { name: 'PDF Tools', href: '/tools/pdf', icon: FiFile },
  { name: 'Image Tools', href: '/tools/images', icon: FiImage },
  { name: 'Media Tools', href: '/tools/media', icon: FiFilm },
  { name: 'Doc Tools', href: '/tools/docs', icon: FiFileText },
  { name: 'Utilities', href: '/tools/utilities', icon: FiPackage },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-950 border-r border-gray-800/50 h-screen sticky top-0 pt-16">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {/* User Info */}
        <div className="mb-6 px-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {(user?.name as string)?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {(user?.name as string) || 'User'}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge variant={user?.plan === 'PRO' ? 'pro' : 'default'}>
                  {(user?.plan as string) || 'FREE'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                )}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Tool Categories */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
            Tools
          </h3>
          <div className="space-y-1">
            {toolCategories.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                    isActive
                      ? 'bg-gray-800/80 text-white'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                  )}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        {user?.plan !== 'PRO' && (
          <div className="mt-8 mx-2">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-4">
              <FiStar className="text-indigo-400 mb-2" size={20} />
              <h4 className="text-white text-sm font-semibold mb-1">Upgrade to Pro</h4>
              <p className="text-gray-400 text-xs mb-3">
                Get unlimited conversions and premium features.
              </p>
              <Link
                href="/pricing"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
