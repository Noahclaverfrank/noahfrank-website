import type { Metadata } from 'next';
import AskOverlay from '@/components/AskOverlay';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://noahfrank.com';
const DESCRIPTION =
  "Noah Frank's site. Zurich. Studies at UZH, works at Alerion Consult, builds software on the side.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Noah Frank',
    template: '%s · Noah Frank',
  },
  description: DESCRIPTION,
  applicationName: 'Noah Frank',
  authors: [{ name: 'Noah Frank' }],
  creator: 'Noah Frank',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: SITE_URL,
    siteName: 'Noah Frank',
    title: 'Noah Frank',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noah Frank',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>
        {children}
        <AskOverlay />
      </body>
    </html>
  );
}
