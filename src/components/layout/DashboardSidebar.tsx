'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  FiGrid,
  FiFolder,
  FiClock,
  FiFile,
  FiImage,
  FiFilm,
  FiFileText,
  FiPackage,
} from 'react-icons/fi';

const navigation = [
  { name: 'لوحة التحكم', href: '/dashboard', icon: FiGrid },
  { name: 'جميع الأدوات', href: '/tools', icon: FiFolder },
  { name: 'السجل', href: '/history', icon: FiClock },
];

const toolCategories = [
  { name: 'أدوات PDF', href: '/tools/pdf', icon: FiFile },
  { name: 'أدوات الصور', href: '/tools/images', icon: FiImage },
  { name: 'أدوات الوسائط', href: '/tools/media', icon: FiFilm },
  { name: 'أدوات المستندات', href: '/tools/docs', icon: FiFileText },
  { name: 'أدوات مساعدة', href: '/tools/utilities', icon: FiPackage },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-gray-950 border-l border-gray-800/50 h-screen sticky top-0 pt-16">
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {/* User Info */}
        <div className="mb-6 px-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">م</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">مستخدم</p>
              <p className="text-indigo-400 text-xs font-medium">مجاني بالكامل</p>
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
          <h3 className="px-3 text-xs font-semibold text-gray-600 tracking-wider mb-3">
            الأدوات
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
      </div>
    </aside>
  );
}
