'use client';

import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import { FiShield, FiZap, FiCheck } from 'react-icons/fi';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الإعدادات</h1>
        <p className="text-gray-400">معلومات عن المنصة وإعداداتها</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Plan Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiZap className="text-indigo-400" size={20} />
              <h2 className="text-white font-semibold">الخطة الحالية</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-4">
              <p className="text-indigo-400 font-bold text-lg mb-2">مجاني بالكامل</p>
              <ul className="space-y-2">
                {[
                  'تحويلات غير محدودة',
                  'حجم ملف يصل إلى 100 ميجابايت',
                  'جميع الأدوات متاحة',
                  'بدون إعلانات',
                  'معالجة بأولوية عالية',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                    <FiCheck className="text-indigo-400" size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiShield className="text-indigo-400" size={20} />
              <h2 className="text-white font-semibold">الأمان</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-3">
                المنصة محمية بإجراءات أمان متقدمة.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  تشفير الملفات أثناء المعالجة
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  حذف تلقائي للملفات بعد 24 ساعة
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  فحص أمني للملفات المرفوعة
                </li>
                <li className="flex items-center gap-2 text-gray-300 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  لا يتم تخزين بيانات شخصية
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
