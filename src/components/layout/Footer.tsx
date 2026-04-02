'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <span className="text-white font-bold text-lg">
                مختبر <span className="text-indigo-400">الملفات</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              منصة شاملة لتحويل ومعالجة الملفات. سريعة، آمنة، وموثوقة. جميع الأدوات مجانية بالكامل.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">الأدوات</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/pdf" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  أدوات PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/images" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  أدوات الصور
                </Link>
              </li>
              <li>
                <Link href="/tools/docs" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  أدوات المستندات
                </Link>
              </li>
              <li>
                <Link href="/tools/utilities" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  أدوات مساعدة
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">الشركة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">الدعم</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  التوثيق
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  حالة الخدمة
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <p className="text-gray-600 text-sm text-center">
            &copy; {new Date().getFullYear()} مختبر الملفات. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
