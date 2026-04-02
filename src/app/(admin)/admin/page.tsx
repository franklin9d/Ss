'use client';

import Navbar from '@/components/layout/Navbar';
import { FiShield } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-indigo-400" size={24} />
          <h1 className="text-3xl font-bold text-white">لوحة الإدارة</h1>
        </div>
        <p className="text-gray-400 mb-8">هذه الصفحة متاحة للمسؤولين فقط.</p>
        <Link
          href="/tools"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          العودة للأدوات
        </Link>
      </div>
    </div>
  );
}
