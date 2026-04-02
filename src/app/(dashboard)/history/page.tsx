'use client';

import Card, { CardContent } from '@/components/ui/Card';
import { FiFile, FiClock } from 'react-icons/fi';

export default function HistoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">سجل المعالجة</h1>
        <p className="text-gray-400">عرض أنشطة معالجة الملفات الأخيرة</p>
      </div>

      <Card>
        <CardContent className="text-center py-16">
          <FiFile className="text-gray-600 mx-auto mb-4" size={48} />
          <h3 className="text-white font-semibold text-lg mb-2">لا توجد ملفات بعد</h3>
          <p className="text-gray-500">
            ابدأ بمعالجة الملفات لرؤية السجل هنا.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-600 text-sm">
            <FiClock size={14} />
            <span>يتم حذف الملفات تلقائياً بعد 24 ساعة</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
