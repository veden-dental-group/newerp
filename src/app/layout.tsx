import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
// import { Inter } from "next/font/google";
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import React, { PropsWithChildren } from 'react';

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NewERP',
  description: 'Veden Dental Group',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = 'en';
  return (
    <html lang={locale}>
      <AuthProvider>
        {/* <body className={inter.className}>{children}</body> */}
        <body>
          <main>{children}</main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
