'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FiShield, FiRefreshCw } from 'react-icons/fi';

interface LogEntry {
  id: string;
  userId: string | null;
  action: string;
  details: unknown;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  userName: string;
}

export default function AdminLogsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  const user = session?.user as Record<string, unknown> | undefined;

  useEffect(() => {
    if (session && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '50',
          ...(filter && { action: filter }),
        });
        const res = await fetch(`/api/admin/logs?${params}`);
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchLogs();
  }, [session, user?.role, router, page, filter]);

  const actions = [
    'LOGIN', 'REGISTER', 'FILE_UPLOAD', 'FILE_PROCESS',
    'SUBSCRIPTION_CREATE', 'ADMIN_BLOCK_USER', 'ADMIN_UNBLOCK_USER',
  ];

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
      LOGIN: 'info',
      REGISTER: 'success',
      FILE_PROCESS: 'default',
      SUBSCRIPTION_CREATE: 'success',
      ADMIN_BLOCK_USER: 'danger',
      ADMIN_UNBLOCK_USER: 'warning',
    };
    return <Badge variant={variants[action] || 'default'}>{action}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-indigo-400" size={24} />
          <h1 className="text-3xl font-bold text-white">System Logs</h1>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => { setFilter(''); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !filter ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => { setFilter(action); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filter === action
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {action}
            </button>
          ))}
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-white font-semibold">Audit Trail</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FiRefreshCw className="animate-spin text-indigo-400" size={24} />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No logs found</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-3 px-4 bg-gray-900/30 rounded-xl"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {getActionBadge(log.action)}
                      <div className="min-w-0">
                        <p className="text-white text-sm">{log.userName}</p>
                        <p className="text-gray-600 text-xs truncate">
                          {log.ipAddress && `IP: ${log.ipAddress}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-xs flex-shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-gray-500 text-sm">{page} / {totalPages}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
