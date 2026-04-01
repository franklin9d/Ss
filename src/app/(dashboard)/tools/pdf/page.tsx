'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolProcessor from '@/components/tools/ToolProcessor';
import type { FileOperation } from '@/types';

const pdfTools = [
  {
    id: 'image-to-pdf',
    operation: 'IMAGE_TO_PDF' as FileOperation,
    title: 'Image to PDF',
    description: 'Convert one or more images into a single PDF document.',
    acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp',
    multiple: true,
    maxFiles: 20,
  },
  {
    id: 'text-to-pdf',
    operation: 'TEXT_TO_PDF' as FileOperation,
    title: 'Text to PDF',
    description: 'Convert plain text files into PDF documents.',
    acceptedTypes: '.txt',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'merge-pdf',
    operation: 'MERGE_PDF' as FileOperation,
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document.',
    acceptedTypes: '.pdf',
    multiple: true,
    maxFiles: 20,
  },
  {
    id: 'split-pdf',
    operation: 'SPLIT_PDF' as FileOperation,
    title: 'Split PDF',
    description: 'Split a PDF into separate pages or page ranges.',
    acceptedTypes: '.pdf',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'compress-pdf',
    operation: 'COMPRESS_PDF' as FileOperation,
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF documents.',
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
    <Suspense fallback={<div className="animate-pulse text-gray-500 py-12 text-center">Loading tools...</div>}>
      <PdfToolsContent />
    </Suspense>
  );
}
