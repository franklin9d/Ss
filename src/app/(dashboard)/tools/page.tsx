'use client';

import Link from 'next/link';
import { useState } from 'react';
import Card, { CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import {
  FiSearch,
  FiFile,
  FiImage,
  FiFilm,
  FiFileText,
  FiPackage,
  FiArrowLeft,
  FiLayers,
  FiScissors,
  FiMinimize2,
  FiRefreshCw,
  FiMaximize2,
  FiMusic,
  FiType,
  FiArchive,
  FiEye,
} from 'react-icons/fi';
import type { FileOperation } from '@/types';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  operation: FileOperation;
  category: string;
  acceptedTypes: string;
  color: string;
}

const allTools: Tool[] = [
  // PDF Tools
  { id: 'image-to-pdf', name: 'صورة إلى PDF', description: 'تحويل الصور إلى مستندات PDF', icon: FiFile, operation: 'IMAGE_TO_PDF', category: 'pdf', acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp', color: 'from-red-500 to-orange-500' },
  { id: 'text-to-pdf', name: 'نص إلى PDF', description: 'تحويل الملفات النصية إلى PDF', icon: FiType, operation: 'TEXT_TO_PDF', category: 'pdf', acceptedTypes: '.txt', color: 'from-red-500 to-orange-500' },
  { id: 'merge-pdf', name: 'دمج PDF', description: 'دمج عدة ملفات PDF في ملف واحد', icon: FiLayers, operation: 'MERGE_PDF', category: 'pdf', acceptedTypes: '.pdf', color: 'from-red-500 to-orange-500' },
  { id: 'split-pdf', name: 'تقسيم PDF', description: 'تقسيم PDF إلى صفحات منفصلة', icon: FiScissors, operation: 'SPLIT_PDF', category: 'pdf', acceptedTypes: '.pdf', color: 'from-red-500 to-orange-500' },
  { id: 'compress-pdf', name: 'ضغط PDF', description: 'تقليل حجم ملف PDF', icon: FiMinimize2, operation: 'COMPRESS_PDF', category: 'pdf', acceptedTypes: '.pdf', color: 'from-red-500 to-orange-500' },
  // Image Tools
  { id: 'image-convert', name: 'تحويل صورة', description: 'التحويل بين صيغ الصور', icon: FiRefreshCw, operation: 'IMAGE_CONVERT', category: 'images', acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff', color: 'from-blue-500 to-cyan-500' },
  { id: 'image-resize', name: 'تغيير حجم صورة', description: 'تغيير أبعاد الصور', icon: FiMaximize2, operation: 'IMAGE_RESIZE', category: 'images', acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp', color: 'from-blue-500 to-cyan-500' },
  { id: 'image-compress', name: 'ضغط صورة', description: 'ضغط الصور مع الحفاظ على الجودة', icon: FiMinimize2, operation: 'IMAGE_COMPRESS', category: 'images', acceptedTypes: '.jpg,.jpeg,.png,.webp', color: 'from-blue-500 to-cyan-500' },
  // Media Tools
  { id: 'video-convert', name: 'تحويل فيديو', description: 'تحويل صيغ الفيديو', icon: FiFilm, operation: 'VIDEO_CONVERT', category: 'media', acceptedTypes: '.mp4,.avi,.mov,.webm', color: 'from-purple-500 to-pink-500' },
  { id: 'audio-extract', name: 'استخراج صوت', description: 'استخراج الصوت من ملفات الفيديو', icon: FiMusic, operation: 'AUDIO_EXTRACT', category: 'media', acceptedTypes: '.mp4,.avi,.mov,.webm', color: 'from-purple-500 to-pink-500' },
  // Document Tools
  { id: 'word-to-pdf', name: 'Word إلى PDF', description: 'تحويل مستندات Word إلى PDF', icon: FiFileText, operation: 'WORD_TO_PDF', category: 'docs', acceptedTypes: '.doc,.docx', color: 'from-emerald-500 to-teal-500' },
  { id: 'markdown-to-pdf', name: 'Markdown إلى PDF', description: 'تحويل Markdown إلى PDF', icon: FiFileText, operation: 'MARKDOWN_TO_PDF', category: 'docs', acceptedTypes: '.md,.txt', color: 'from-emerald-500 to-teal-500' },
  // Utilities
  { id: 'zip-create', name: 'إنشاء ZIP', description: 'إنشاء أرشيف ZIP من الملفات', icon: FiArchive, operation: 'ZIP_CREATE', category: 'utilities', acceptedTypes: '*', color: 'from-yellow-500 to-orange-500' },
  { id: 'zip-extract', name: 'استخراج ZIP', description: 'استخراج الملفات من أرشيف ZIP', icon: FiPackage, operation: 'ZIP_EXTRACT', category: 'utilities', acceptedTypes: '.zip', color: 'from-yellow-500 to-orange-500' },
  { id: 'ocr', name: 'التعرف على النصوص', description: 'استخراج النصوص من الصور', icon: FiEye, operation: 'OCR', category: 'utilities', acceptedTypes: '.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff', color: 'from-yellow-500 to-orange-500' },
];

const categories = [
  { id: 'all', name: 'جميع الأدوات', icon: FiLayers },
  { id: 'pdf', name: 'PDF', icon: FiFile },
  { id: 'images', name: 'الصور', icon: FiImage },
  { id: 'media', name: 'الوسائط', icon: FiFilm },
  { id: 'docs', name: 'المستندات', icon: FiFileText },
  { id: 'utilities', name: 'أدوات مساعدة', icon: FiPackage },
];

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">جميع الأدوات</h1>
        <p className="text-gray-400">اختر أداة للبدء في معالجة ملفاتك</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="ابحث عن أداة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<FiSearch size={18} />}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <cat.icon size={16} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <Link key={tool.id} href={`/tools/${tool.category}?tool=${tool.id}`}>
            <Card hover className="h-full">
              <CardContent className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center`}>
                    <tool.icon className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
                <p className="text-gray-500 text-sm flex-1">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-400 text-sm font-medium">
                  استخدم الأداة <FiArrowLeft size={14} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">لم يتم العثور على أدوات تطابق بحثك.</p>
        </div>
      )}
    </div>
  );
}
