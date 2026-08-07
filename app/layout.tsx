import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

function getBaseUrl(): URL {
  let raw = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'https://pcyc.ph';
  raw = raw.trim();
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = `https://${raw}`;
  }
  try {
    return new URL(raw);
  } catch {
    return new URL('https://pcyc.ph');
  }
}

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: {
    default: 'PCYC Space — Philippine Christadelphian Youth Circle',
    template: '%s | PCYC Space',
  },
  description:
    'The official home for the Philippine Christadelphian Youth Circle. Discover upcoming events, study circles, youth fellowship camps, and official PCYC merchandise.',
  keywords: [
    'PCYC',
    'Philippine Christadelphian Youth Circle',
    'Christadelphian Philippines',
    'Youth Fellowship',
    'Bible Study Camp',
    'PCYC Space',
  ],
  authors: [{ name: 'Philippine Christadelphian Youth Circle' }],
  icons: {
    icon: '/images/logo/pcyc-logo.jpg',
    apple: '/images/logo/pcyc-logo.jpg',
  },
  openGraph: {
    title: 'PCYC Space — Philippine Christadelphian Youth Circle',
    description:
      'Community, fellowship, and updates for the Christadelphian youth in the Philippines.',
    siteName: 'PCYC Space',
    images: [
      {
        url: '/images/logo/pcyc-logo.jpg',
        width: 800,
        height: 800,
        alt: 'PCYC Logo',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2c3324',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#fefcf1] text-[#2c3324] antialiased selection:bg-[#e0a861]/30 selection:text-[#2c3324]">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
