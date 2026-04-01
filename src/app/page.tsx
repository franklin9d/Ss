'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  FiFile,
  FiImage,
  FiFilm,
  FiFileText,
  FiPackage,
  FiShield,
  FiZap,
  FiLock,
  FiArrowRight,
  FiCheck,
  FiStar,
} from 'react-icons/fi';

const tools = [
  {
    icon: FiFile,
    title: 'PDF Tools',
    description: 'Merge, split, compress, and convert PDF files',
    color: 'from-red-500 to-orange-500',
    href: '/tools/pdf',
  },
  {
    icon: FiImage,
    title: 'Image Tools',
    description: 'Convert, resize, and compress images',
    color: 'from-blue-500 to-cyan-500',
    href: '/tools/images',
  },
  {
    icon: FiFilm,
    title: 'Media Tools',
    description: 'Convert video formats and extract audio',
    color: 'from-purple-500 to-pink-500',
    href: '/tools/media',
  },
  {
    icon: FiFileText,
    title: 'Document Tools',
    description: 'Convert Word to PDF, Markdown to PDF',
    color: 'from-emerald-500 to-teal-500',
    href: '/tools/docs',
  },
  {
    icon: FiPackage,
    title: 'Utilities',
    description: 'ZIP tools, OCR, and more',
    color: 'from-yellow-500 to-orange-500',
    href: '/tools/utilities',
  },
];

const features = [
  {
    icon: FiZap,
    title: 'Lightning Fast',
    description: 'Process files in seconds with our optimized pipeline',
  },
  {
    icon: FiShield,
    title: 'Enterprise Security',
    description: 'Your files are encrypted and automatically deleted after processing',
  },
  {
    icon: FiLock,
    title: 'Privacy First',
    description: 'No data is stored permanently. Files expire in 24 hours',
  },
];

const stats = [
  { value: '10M+', label: 'Files Processed' },
  { value: '50K+', label: 'Happy Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '15+', label: 'File Tools' },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
              <FiStar className="text-indigo-400" size={14} />
              <span className="text-indigo-300 text-sm font-medium">
                Trusted by 50,000+ professionals
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              All-in-One{' '}
              <span className="gradient-text">File Lab</span>
              <br />
              for Modern Teams
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Convert, compress, merge, and transform your files with ease.
              PDF tools, image processing, document conversion, and more &mdash;
              all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={session ? '/dashboard' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                {session ? 'Go to Dashboard' : 'Start Free'}
                <FiArrowRight />
              </Link>
              <Link
                href="/tools"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 hover:text-white transition-all"
              >
                Explore Tools
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Tools for Every{' '}
              <span className="gradient-text">File Type</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to work with files, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <tool.icon className="text-white" size={24} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{tool.title}</h3>
                <p className="text-gray-500 text-sm">{tool.description}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <FiArrowRight size={14} />
                </div>
              </Link>
            ))}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <FiZap className="text-indigo-400 mb-3" size={32} />
              <h3 className="text-white font-semibold text-lg mb-2">
                15+ Tools Available
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                New tools added regularly
              </p>
              <Link
                href="/tools"
                className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                View All Tools <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for{' '}
              <span className="gradient-text">Security & Speed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8"
              >
                <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-indigo-400" size={28} />
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple{' '}
              <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg">Start free, upgrade when you need more</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-white font-semibold text-xl mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['5 conversions/day', '10MB max file size', 'Basic formats', 'Standard speed'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-400 text-sm">
                    <FiCheck className="text-gray-600" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center border-2 border-gray-700 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-gray-400 ml-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited conversions',
                  '100MB max file size',
                  'All file formats',
                  'Priority processing',
                  'No ads',
                  'API access',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <FiCheck className="text-indigo-400" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to transform your files?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of professionals who trust File Lab for their daily file processing needs.
              </p>
              <Link
                href={session ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition-all"
              >
                {session ? 'Go to Dashboard' : 'Start for Free'}
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
