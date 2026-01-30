import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import StudentPortalBanner from "@/components/StudentPortalBanner";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>My Next.js App</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/app_icon.png" />
      </Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <StudentPortalBanner />

        {/* Page Content */}
        <div>{children}</div>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
