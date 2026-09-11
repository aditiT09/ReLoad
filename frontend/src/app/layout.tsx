import './globals.css';
import type { Metadata } from 'next';
import ScreenSwitcher from '@/components/ScreenSwitcher';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'ReLoad Logistics Platform | Operational High-Velocity Freight',
  description: 'Enterprise Operational Logistics, Fleet Management, Dispatch & Real-Time Cold-Chain Delivery Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-body text-[#16212E] min-h-screen antialiased selection:bg-[#0F6E56]/20">
        <LanguageProvider>
          {children}
          <ScreenSwitcher />
        </LanguageProvider>
      </body>
    </html>
  );
}
