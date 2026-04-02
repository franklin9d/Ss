'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FiCheck, FiZap } from 'react-icons/fi';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              مجاني{' '}
              <span className="gradient-text">بالكامل</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              جميع الأدوات والميزات متاحة مجاناً بدون أي رسوم أو حدود.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative rounded-2xl p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <FiZap size={12} />
                  مجاني للجميع
                </span>
              </div>

              <h3 className="text-white font-semibold text-xl mb-1">الخطة المجانية</h3>
              <p className="text-gray-500 text-sm mb-6">جميع الميزات متاحة بدون رسوم</p>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-500 mr-1">/ للأبد</span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'تحويلات غير محدودة',
                  'حجم ملف يصل إلى 100 ميجابايت',
                  'جميع صيغ الملفات',
                  'معالجة بأولوية عالية',
                  'بدون إعلانات',
                  'جميع الأدوات متاحة',
                  'التعرف على النصوص (OCR)',
                  'أدوات الضغط والدمج',
                  'تحويل المستندات',
                  'أدوات الصور والوسائط',
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <FiCheck className="text-indigo-400 flex-shrink-0" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/tools"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
