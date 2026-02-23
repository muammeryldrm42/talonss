import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const viewport: Viewport = {
  themeColor: '#060b18',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://talons.vercel.app'),
  title: {
    default: 'Talons — Professional Crypto Market Intelligence',
    template: '%s | Talons',
  },
  description:
    'Real-time cryptocurrency market intelligence. Live prices, interactive charts, portfolio simulation, and crypto news — all in one place.',
  keywords: ['crypto', 'cryptocurrency', 'bitcoin', 'market cap', 'portfolio', 'trading', 'DeFi'],
  authors: [{ name: 'Talons' }],
  creator: 'Talons',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Talons — Professional Crypto Market Intelligence',
    description: 'Live crypto prices, charts, portfolio tracking, and market news.',
    siteName: 'Talons',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talons — Crypto Market Intelligence',
    description: 'Live crypto prices, charts, portfolio tracking, and market news.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
