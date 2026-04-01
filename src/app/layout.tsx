import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'File Lab - All-in-One File Conversion & Processing Platform',
  description:
    'Convert, compress, merge, and transform your files with ease. PDF tools, image processing, document conversion, and more. Fast, secure, and reliable.',
  keywords: [
    'file converter',
    'PDF tools',
    'image converter',
    'document processing',
    'file compression',
    'merge PDF',
    'OCR',
  ],
  openGraph: {
    title: 'File Lab - All-in-One File Conversion Platform',
    description: 'Convert, compress, and transform your files with ease.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
