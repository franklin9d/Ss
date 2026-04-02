'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';
import { FiUploadCloud, FiX, FiFile } from 'react-icons/fi';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  className?: string;
}

export default function FileUploader({
  accept,
  multiple = false,
  maxSize = 100 * 1024 * 1024,
  maxFiles = 10,
  onFilesSelected,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (fileList: File[]): File[] => {
      const validFiles: File[] = [];
      setError(null);

      for (const file of fileList) {
        if (file.size > maxSize) {
          setError(`${file.name} يتجاوز الحد الأقصى ${formatBytes(maxSize)}`);
          continue;
        }
        if (validFiles.length >= maxFiles) {
          setError(`الحد الأقصى ${maxFiles} ملفات مسموح`);
          break;
        }
        validFiles.push(file);
      }

      return validFiles;
    },
    [maxSize, maxFiles]
  );

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const fileArray = Array.from(fileList);
      const validFiles = validateFiles(fileArray);
      setFiles(validFiles);
      onFilesSelected(validFiles);
    },
    [validateFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-gray-700 hover:border-gray-600 bg-gray-900/30',
          files.length > 0 && 'border-emerald-500/50 bg-emerald-500/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <FiUploadCloud
          className={cn(
            'mx-auto mb-4 transition-colors',
            isDragging ? 'text-indigo-400' : 'text-gray-500'
          )}
          size={48}
        />

        <p className="text-lg font-medium text-gray-300 mb-1">
          {isDragging ? 'أفلت الملفات هنا' : 'اسحب وأفلت الملفات هنا'}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          أو انقر للتصفح
        </p>
        <p className="text-xs text-gray-600">
          الحد الأقصى {formatBytes(maxSize)} لكل ملف
          {multiple && ` | حتى ${maxFiles} ملفات`}
        </p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FiFile className="text-indigo-400 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
