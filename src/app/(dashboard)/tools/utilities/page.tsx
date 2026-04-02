'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolProcessor from '@/components/tools/ToolProcessor';
import type { FileOperation } from '@/types';

const utilityTools = [
  {
    id: 'zip-create',
    operation: 'ZIP_CREATE' as FileOperation,
    title: 'إنشاء ZIP',
    description: 'ضغط عدة ملفات في أرشيف ZIP واحد.',
    acceptedTypes: '*',
    multiple: true,
    maxFiles: 50,
  },
  {
    id: 'zip-extract',
    operation: 'ZIP_EXTRACT' as FileOperation,
    title: 'استخراج ZIP',
    description: 'استخراج جميع الملفات من أرشيف ZIP.',
    acceptedTypes: '.zip',
  },
  {
    id: 'ocr',
    operation: 'OCR' as FileOperation,
    title: 'التعرف على النصوص (OCR)',
    description: 'استخراج النصوص من الصور باستخدام تقنية التعرف الضوئي المتقدمة.',
    acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.tif',
  },
];

function UtilityToolsContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool') || 'zip-create';
  const [activeTool, setActiveTool] = useState(toolId);

  const currentTool = utilityTools.find((t) => t.id === activeTool) || utilityTools[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-800">
        {utilityTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTool === tool.id
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {tool.title}
          </button>
        ))}
      </div>

      <ToolProcessor
        key={currentTool.id}
        operation={currentTool.operation}
        title={currentTool.title}
        description={currentTool.description}
        acceptedTypes={currentTool.acceptedTypes}
        multiple={currentTool.multiple}
        maxFiles={currentTool.maxFiles}
      />
    </div>
  );
}

export default function UtilityToolsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-500 py-12 text-center">جارٍ تحميل الأدوات...</div>}>
      <UtilityToolsContent />
    </Suspense>
  );
}
