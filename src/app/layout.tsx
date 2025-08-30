'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/header";
import { ThemeProvider } from "./_components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={``}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {/* header+导航栏 也是黑色，需要下边框，固定在页面最上方，并且子元素具有 图标、导航栏、联系方式等等 */}
        <Header/>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
