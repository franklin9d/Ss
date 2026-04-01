'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiSearch, FiShield, FiSlash, FiCheck, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
  isBlocked: boolean;
  createdAt: string;
  _count: { files: number };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = session?.user as Record<string, unknown> | undefined;

  useEffect(() => {
    if (session && user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
          ...(search && { search }),
        });
        const res = await fetch(`/api/admin/users?${params}`);
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchUsers();
  }, [session, user?.role, router, page, search]);

  const handleToggleBlock = async (userId: string, isBlocked: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          action: isBlocked ? 'unblock' : 'block',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isBlocked: !isBlocked } : u
          )
        );
        toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      }
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-indigo-400" size={24} />
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<FiSearch size={18} />}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">All Users</h2>
              <span className="text-gray-500 text-sm">{users.length} users</span>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <FiRefreshCw className="animate-spin text-indigo-400" size={24} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Plan</th>
                      <th className="pb-3 font-medium">Files</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Joined</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {users.map((u) => (
                      <tr key={u.id} className="text-sm">
                        <td className="py-3">
                          <div>
                            <p className="text-white font-medium">{u.name || 'No name'}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={u.plan === 'PRO' ? 'pro' : 'default'}>
                            {u.plan}
                          </Badge>
                        </td>
                        <td className="py-3 text-gray-400">{u._count.files}</td>
                        <td className="py-3">
                          {u.isBlocked ? (
                            <Badge variant="danger">Blocked</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant={u.isBlocked ? 'ghost' : 'danger'}
                            size="sm"
                            onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                          >
                            {u.isBlocked ? (
                              <><FiCheck size={14} className="mr-1" /> Unblock</>
                            ) : (
                              <><FiSlash size={14} className="mr-1" /> Block</>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <span className="text-gray-500 text-sm">
                  {page} / {totalPages}
                </span>
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
