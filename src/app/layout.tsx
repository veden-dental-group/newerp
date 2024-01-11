import type { Metadata } from 'next';
import { OPTIONS } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import { Toaster } from '@/components/ui/toaster';
// import { Inter } from "next/font/google";
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import React, { PropsWithChildren } from 'react';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import ReactQueryProvider from '@/components/ReactQueryProvider';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NewERP',
  description: 'Veden Dental Group',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(OPTIONS);
  const locale = 'en';
  return (
    <html lang={locale}>
      <AuthProvider session={session}>
        <ReactQueryProvider>
          {/* <body className={inter.className}>{children}</body> */}
          <body>
            <main>{children}</main>
            <Toaster />
          </body>
        </ReactQueryProvider>
      </AuthProvider>
    </html>
  );
}
