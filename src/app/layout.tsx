import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const cairo = Cairo({ subsets: ['arabic', 'latin'] });

export const metadata: Metadata = {
  title: 'مختبر الملفات - منصة تحويل ومعالجة الملفات الشاملة',
  description:
    'حوّل، اضغط، ادمج، وعدّل ملفاتك بسهولة. أدوات PDF، معالجة الصور، تحويل المستندات، والمزيد. سريع، آمن، وموثوق.',
  keywords: [
    'محول ملفات',
    'أدوات PDF',
    'محول صور',
    'معالجة مستندات',
    'ضغط ملفات',
    'دمج PDF',
    'التعرف على النصوص',
  ],
  openGraph: {
    title: 'مختبر الملفات - منصة تحويل الملفات الشاملة',
    description: 'حوّل، اضغط، وعدّل ملفاتك بسهولة.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.className} bg-gray-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
