'use client';

import { useEffect, useState } from 'react';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatBytes, formatDate } from '@/lib/utils';
import { FiDownload, FiClock, FiFile, FiRefreshCw } from 'react-icons/fi';

interface FileRecord {
  id: string;
  operation: string;
  status: string;
  inputFileName: string;
  inputFileSize: number;
  outputFileName: string | null;
  outputFileSize: number | null;
  downloadUrl: string | null;
  processingTime: number | null;
  createdAt: string;
  expiresAt: string | null;
}

export default function HistoryPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/files/history?page=${page}&limit=20`);
        const data = await res.json();
        if (data.success) {
          setFiles(data.data);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'PROCESSING':
        return <Badge variant="info">Processing</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  const formatOperation = (op: string) => {
    return op.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Processing History</h1>
        <p className="text-gray-400">View your recent file processing activities</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiRefreshCw className="animate-spin text-indigo-400" size={32} />
        </div>
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <FiFile className="text-gray-600 mx-auto mb-4" size={48} />
            <h3 className="text-white font-semibold text-lg mb-2">No files yet</h3>
            <p className="text-gray-500">
              Start processing files to see your history here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file.id} hover>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiFile className="text-gray-400" size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">
                        {file.inputFileName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-500 text-xs">
                          {formatOperation(file.operation)}
                        </span>
                        <span className="text-gray-700">|</span>
                        <span className="text-gray-500 text-xs">
                          {formatBytes(file.inputFileSize)}
                          {file.outputFileSize && ` → ${formatBytes(file.outputFileSize)}`}
                        </span>
                        <span className="text-gray-700">|</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <FiClock size={12} />
                          {formatDate(file.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(file.status)}
                    {file.downloadUrl && file.status === 'COMPLETED' && (
                      <a
                        href={file.downloadUrl}
                        download
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <FiDownload size={18} />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
