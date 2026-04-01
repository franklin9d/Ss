'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';
import Badge from '@/components/ui/Badge';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user as Record<string, unknown> | undefined;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              File <span className="text-indigo-400">Lab</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">
              Tools
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-gray-800/50 rounded-full pl-1 pr-3 py-1 hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {(user?.name as string)?.[0]?.toUpperCase() || (user?.email as string)?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-300 max-w-[120px] truncate">
                      {(user?.name as string) || (user?.email as string)}
                    </span>
                    {user?.plan === 'PRO' && <Badge variant="pro">PRO</Badge>}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FiGrid size={16} />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setProfileOpen(false)}
                      >
                        <FiSettings size={16} />
                        Settings
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-400 hover:bg-gray-800"
                          onClick={() => setProfileOpen(false)}
                        >
                          <FiUser size={16} />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-800" />
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 w-full text-left"
                      >
                        <FiLogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 py-4 px-4 space-y-3">
          <Link href="/tools" className="block text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            Tools
          </Link>
          <Link href="/pricing" className="block text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="block text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                className="block text-red-400 hover:text-red-300 py-2 w-full text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="block text-indigo-400 hover:text-indigo-300 py-2" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
