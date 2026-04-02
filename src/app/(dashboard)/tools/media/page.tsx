'use client';

import ToolProcessor from '@/components/tools/ToolProcessor';

export default function MediaToolsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white">أدوات الوسائط</h1>
      </div>

      <div className="grid gap-8">
        <ToolProcessor
          operation="VIDEO_CONVERT"
          title="تحويل فيديو"
          description="تحويل ملفات الفيديو بين الصيغ المختلفة."
          acceptedTypes=".mp4,.avi,.mov,.webm"
        />
      </div>
    </div>
  );
}
