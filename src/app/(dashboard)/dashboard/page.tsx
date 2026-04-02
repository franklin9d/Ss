'use client';

import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/Card';
import {
  FiFile,
  FiImage,
  FiFileText,
  FiPackage,
  FiZap,
  FiArrowLeft,
} from 'react-icons/fi';

const quickTools = [
  { name: 'دمج PDF', icon: FiFile, href: '/tools/pdf?tool=merge-pdf', color: 'from-red-500 to-orange-500' },
  { name: 'ضغط صورة', icon: FiImage, href: '/tools/images?tool=image-compress', color: 'from-blue-500 to-cyan-500' },
  { name: 'Word إلى PDF', icon: FiFileText, href: '/tools/docs?tool=word-to-pdf', color: 'from-emerald-500 to-teal-500' },
  { name: 'إنشاء ZIP', icon: FiPackage, href: '/tools/utilities?tool=zip-create', color: 'from-yellow-500 to-orange-500' },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          مرحباً بك في مختبر الملفات
        </h1>
        <p className="text-gray-400">
          جميع الأدوات متاحة مجاناً بدون حدود. اختر أداة للبدء.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <FiZap className="text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">الخطة</p>
              <p className="text-indigo-400 text-lg font-bold">مجاني بالكامل</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <FiFile className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">التحويلات</p>
              <p className="text-white text-lg font-bold">غير محدودة</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <FiImage className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">حجم الملف الأقصى</p>
              <p className="text-white text-lg font-bold">100 ميجابايت</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tools */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">أدوات سريعة</h2>
          <Link href="/tools" className="text-indigo-400 text-sm hover:text-indigo-300 flex items-center gap-1">
            عرض الكل <FiArrowLeft size={14} />
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

      {/* Info Banner */}
      <Card glow>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              جميع الميزات مجانية
            </h3>
            <p className="text-gray-400 text-sm">
              استمتع بتحويلات غير محدودة، ملفات حتى 100 ميجابايت، وجميع الأدوات بدون أي رسوم.
            </p>
          </div>
          <Link
            href="/tools"
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            استكشف الأدوات
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
