import type { Metadata } from 'next';
import AskOverlay from '@/components/AskOverlay';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noah Frank',
  description: 'Strategy & transformation at the intersection of operations and ambition.',
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
