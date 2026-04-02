'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolProcessor from '@/components/tools/ToolProcessor';
import type { FileOperation } from '@/types';

const pdfTools = [
  {
    id: 'image-to-pdf',
    operation: 'IMAGE_TO_PDF' as FileOperation,
    title: 'صورة إلى PDF',
    description: 'تحويل صورة واحدة أو أكثر إلى مستند PDF واحد.',
    acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp',
    multiple: true,
    maxFiles: 20,
  },
  {
    id: 'text-to-pdf',
    operation: 'TEXT_TO_PDF' as FileOperation,
    title: 'نص إلى PDF',
    description: 'تحويل الملفات النصية إلى مستندات PDF.',
    acceptedTypes: '.txt',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'merge-pdf',
    operation: 'MERGE_PDF' as FileOperation,
    title: 'دمج PDF',
    description: 'دمج عدة ملفات PDF في مستند واحد.',
    acceptedTypes: '.pdf',
    multiple: true,
    maxFiles: 20,
  },
  {
    id: 'split-pdf',
    operation: 'SPLIT_PDF' as FileOperation,
    title: 'تقسيم PDF',
    description: 'تقسيم ملف PDF إلى صفحات أو نطاقات منفصلة.',
    acceptedTypes: '.pdf',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'compress-pdf',
    operation: 'COMPRESS_PDF' as FileOperation,
    title: 'ضغط PDF',
    description: 'تقليل حجم ملفات PDF الخاصة بك.',
    acceptedTypes: '.pdf',
    multiple: false,
    maxFiles: 1,
  },
];

function PdfToolsContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool') || 'merge-pdf';
  const [activeTool, setActiveTool] = useState(toolId);

  const currentTool = pdfTools.find((t) => t.id === activeTool) || pdfTools[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-800">
        {pdfTools.map((tool) => (
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

export default function PdfToolsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-500 py-12 text-center">جارٍ تحميل الأدوات...</div>}>
      <PdfToolsContent />
    </Suspense>
  );
}
