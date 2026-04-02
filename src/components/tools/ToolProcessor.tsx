'use client';

import { useState, useCallback } from 'react';
import FileUploader from '@/components/ui/FileUploader';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatBytes } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FiDownload, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import type { FileOperation } from '@/types';

interface ToolProcessorProps {
  operation: FileOperation;
  title: string;
  description: string;
  acceptedTypes: string;
  multiple?: boolean;
  maxFiles?: number;
  options?: React.ReactNode;
  getOptions?: () => Record<string, unknown>;
}

interface ProcessResult {
  id: string;
  outputFileName: string;
  outputFileSize: number;
  downloadUrl: string;
  processingTime: number;
}

export default function ToolProcessor({
  operation,
  title,
  description,
  acceptedTypes,
  multiple = false,
  maxFiles = 1,
  options,
  getOptions,
}: ToolProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const maxSize = 100 * 1024 * 1024; // 100MB for everyone

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setResult(null);
    setError(null);
  }, []);

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('يرجى اختيار ملف واحد على الأقل');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('operation', operation);

      if (getOptions) {
        formData.append('options', JSON.stringify(getOptions()));
      }

      for (const file of files) {
        formData.append('files', file);
      }

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشلت المعالجة');
      }

      setResult(data.data);
      toast.success('تمت معالجة الملف بنجاح!');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'فشلت المعالجة';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* File Upload */}
      <Card className="mb-6">
        <CardContent>
          <FileUploader
            accept={acceptedTypes}
            multiple={multiple}
            maxFiles={maxFiles}
            maxSize={maxSize}
            onFilesSelected={handleFilesSelected}
          />
        </CardContent>
      </Card>

      {/* Options */}
      {options && (
        <Card className="mb-6">
          <CardContent>
            <h3 className="text-white font-medium mb-4">الخيارات</h3>
            {options}
          </CardContent>
        </Card>
      )}

      {/* Process Button */}
      <Button
        onClick={handleProcess}
        loading={loading}
        disabled={files.length === 0}
        className="w-full mb-6"
        size="lg"
      >
        {loading ? 'جارٍ المعالجة...' : `معالجة ${files.length > 0 ? `(${files.length} ملف${files.length > 1 ? 'ات' : ''})` : ''}`}
      </Button>

      {/* Error */}
      {error && (
        <Card className="mb-6 border-red-500/30">
          <CardContent>
            <div className="flex items-center gap-2 text-red-400">
              <FiAlertTriangle size={18} />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card glow>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <FiCheck className="text-emerald-400" size={18} />
              </div>
              <h3 className="text-white font-semibold">تمت المعالجة بنجاح</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">ملف الإخراج</span>
                <span className="text-white text-sm font-medium">{result.outputFileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">حجم الملف</span>
                <span className="text-white text-sm">{formatBytes(result.outputFileSize)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">وقت المعالجة</span>
                <Badge variant="success">{result.processingTime} مللي ثانية</Badge>
              </div>
            </div>

            <a
              href={result.downloadUrl}
              download
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              <FiDownload size={18} />
              تحميل النتيجة
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
