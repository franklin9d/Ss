'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FL</span>
              </div>
              <span className="text-white font-bold text-lg">
                File <span className="text-indigo-400">Lab</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              All-in-one file conversion and processing platform. Fast, secure, and reliable.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/pdf" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/images" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/docs" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Document Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/utilities" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Utilities
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <p className="text-gray-600 text-sm text-center">
            &copy; {new Date().getFullYear()} File Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
