'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { FiArrowRight, FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="text-center max-w-lg">
          <div className="mb-8">
            <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-3">
              الصفحة غير موجودة
            </h2>
            <p className="text-gray-400 leading-relaxed">
              الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
              دعنا نعيدك إلى المسار الصحيح.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              <FiHome size={18} />
              الصفحة الرئيسية
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 border-2 border-gray-700 text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-800 hover:text-white transition-all"
            >
              <FiArrowRight size={18} />
              العودة للخلف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
