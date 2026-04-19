import type { Metadata } from 'next';
import TerminalIntro from '@/components/TerminalIntro';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noah Frank',
  description: 'Strategy & transformation at the intersection of operations and ambition.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <TerminalIntro />
        {children}
      </body>
    </html>
  );
}
