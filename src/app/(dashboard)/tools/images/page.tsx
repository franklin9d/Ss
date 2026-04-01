'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolProcessor from '@/components/tools/ToolProcessor';
import type { FileOperation } from '@/types';

const imageTools = [
  {
    id: 'image-convert',
    operation: 'IMAGE_CONVERT' as FileOperation,
    title: 'Convert Image',
    description: 'Convert images between formats (JPEG, PNG, WebP, GIF, TIFF, AVIF).',
    acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.tif',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'image-resize',
    operation: 'IMAGE_RESIZE' as FileOperation,
    title: 'Resize Image',
    description: 'Resize images to exact dimensions while maintaining quality.',
    acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp',
    multiple: false,
    maxFiles: 1,
  },
  {
    id: 'image-compress',
    operation: 'IMAGE_COMPRESS' as FileOperation,
    title: 'Compress Image',
    description: 'Reduce image file size while preserving visual quality.',
    acceptedTypes: '.jpg,.jpeg,.png,.webp',
    multiple: false,
    maxFiles: 1,
  },
];

function ImageToolsContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool') || 'image-convert';
  const [activeTool, setActiveTool] = useState(toolId);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(85);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const currentTool = imageTools.find((t) => t.id === activeTool) || imageTools[0];

  const getOptions = () => {
    switch (activeTool) {
      case 'image-convert':
        return { format, quality };
      case 'image-resize':
        return {
          width: width ? parseInt(width) : undefined,
          height: height ? parseInt(height) : undefined,
          format: 'png',
        };
      case 'image-compress':
        return { quality };
      default:
        return {};
    }
  };

  const renderOptions = () => {
    switch (activeTool) {
      case 'image-convert':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
                <option value="gif">GIF</option>
                <option value="tiff">TIFF</option>
                <option value="avif">AVIF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Quality ({quality}%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>
        );
      case 'image-resize':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Auto"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Auto"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        );
      case 'image-compress':
        return (
          <div>
            <label className="block text-sm text-gray-300 mb-2">Quality ({quality}%)</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Lower quality = smaller file size</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-800">
        {imageTools.map((tool) => (
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
        options={renderOptions()}
        getOptions={getOptions}
      />
    </div>
  );
}

export default function ImageToolsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-500 py-12 text-center">Loading tools...</div>}>
      <ImageToolsContent />
    </Suspense>
  );
}
