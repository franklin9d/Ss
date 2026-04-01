'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolProcessor from '@/components/tools/ToolProcessor';
import type { FileOperation } from '@/types';

const docTools = [
  {
    id: 'word-to-pdf',
    operation: 'WORD_TO_PDF' as FileOperation,
    title: 'Word to PDF',
    description: 'Convert Microsoft Word documents (.doc, .docx) to PDF.',
    acceptedTypes: '.doc,.docx',
  },
  {
    id: 'markdown-to-pdf',
    operation: 'MARKDOWN_TO_PDF' as FileOperation,
    title: 'Markdown to PDF',
    description: 'Convert Markdown files to well-formatted PDF documents.',
    acceptedTypes: '.md,.txt',
  },
];

function DocToolsContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool') || 'word-to-pdf';
  const [activeTool, setActiveTool] = useState(toolId);

  const currentTool = docTools.find((t) => t.id === activeTool) || docTools[0];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-800">
        {docTools.map((tool) => (
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
      />
    </div>
  );
}

export default function DocToolsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-500 py-12 text-center">Loading tools...</div>}>
      <DocToolsContent />
    </Suspense>
  );
}
