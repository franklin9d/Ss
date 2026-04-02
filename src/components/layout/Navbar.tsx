'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">م</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              مختبر <span className="text-indigo-400">الملفات</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tools" className="text-gray-400 hover:text-white transition-colors text-sm">
              الأدوات
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
              لوحة التحكم
            </Link>
            <Link
              href="/tools"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              ابدأ الآن
            </Link>
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
            الأدوات
          </Link>
          <Link href="/dashboard" className="block text-gray-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>
            لوحة التحكم
          </Link>
          <Link href="/tools" className="block text-indigo-400 hover:text-indigo-300 py-2" onClick={() => setMenuOpen(false)}>
            ابدأ الآن
          </Link>
        </div>
      )}
    </nav>
  );
}
