// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import WalletConnect from '@/components/WalletConnect';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'StellarWish | Fund Dreams on Stellar',
  description: 'A decentralized crowdfunding platform on the Stellar blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-background text-white min-h-screen selection:bg-primary/30`}>
        <div className="fixed inset-0 bg-cosmic-mesh pointer-events-none -z-10 animate-pulseGlow" />
        
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-16 glass-card px-6 md:px-12 flex justify-between items-center z-[100]">
          <Link href="/" className="text-2xl font-bold font-space flex items-center gap-2 group">
            <span className="text-stellar group-hover:glow-cyan transition-all">StellarWish</span>
            <span className="text-secondary animate-twinkle">✦</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/create" className="hover:text-primary transition-colors">Create</Link>
            </div>
            <WalletConnect />
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
          {children}
        </main>

        <footer className="border-t border-white/5 py-16 text-center">
          <div className="max-w-7xl mx-auto px-6 text-gray-500 text-sm">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/10" />
              <span className="font-space font-bold tracking-widest uppercase text-xs opacity-50">StellarWish</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/10" />
            </div>
            <p>© 2024 StellarWish. Powered by Soroban & Stellar.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
