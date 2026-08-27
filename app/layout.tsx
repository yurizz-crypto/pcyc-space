import type { Metadata, Viewport } from 'next';
import { Outfit, EB_Garamond } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/ui/toast';


const sansFont = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const themeScript = `
  (function() {
    try {
      var key = 'pcyc-theme-preference';
      var saved = localStorage.getItem(key);
      var supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && supportDark) || (saved === 'system' && supportDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo/pcyc-transparent-logo.png', type: 'image/png' },
    ],
    apple: '/images/logo/pcyc-logo.jpg',
  },
  keywords: [
    'PCYC',
    'Philippine Christadelphian Youth Circle',
    'Christadelphian Philippines',
    'Youth Fellowship',
    'Bible Study Camp',
    'Christadelphian Ecclesias',
  ],
  authors: [{ name: 'PCYC Space Committee' }],
  creator: 'Philippine Christadelphian Youth Circle',
  publisher: 'PCYC Space',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://pcyc.ph',
    siteName: 'PCYC Space',
    title: 'PCYC Space — Philippine Christadelphian Youth Circle',
    description:
      'The official home for the Philippine Christadelphian Youth Circle. Discover upcoming events, study circles, youth fellowship camps, and official PCYC merchandise.',
    images: [
      {
        url: '/images/og/pcyc-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PCYC Space — Fellowship and Study Across the Philippines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PCYC Space — Philippine Christadelphian Youth Circle',
    description:
      'The official home for the Philippine Christadelphian Youth Circle.',
    images: ['/images/og/pcyc-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#2c3324',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Root Application Layout
 * 
 * Defines the top-level HTML document structure for the Next.js App Router.
 * Configures the primary theme providers (ThemeProvider), global UI overlays (ToastProvider), 
 * and universal navigation components (Navbar & Footer).
 * Automatically injects an inline script in `<head>` to prevent Flash of Unstyled Text (FOUT) 
 * and Flash of Inaccurate Theme (FOIT) on initial load by checking `localStorage` synchronously.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The specific page or nested layout to render.
 * @returns {JSX.Element} The foundational `<html>` and `<body>` structure.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fefcf1] dark:bg-[#131710] text-[#2c3324] dark:text-[#fefcf1] antialiased selection:bg-[#e0a861]/30 selection:text-[#2c3324] transition-colors duration-200">
        <ThemeProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
