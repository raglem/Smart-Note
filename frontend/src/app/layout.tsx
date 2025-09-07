import type { Metadata } from "next";
import { UserProvider } from "./context/UserContext";
import Navbar from "@/components/Navbar";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ToastProvider from "./context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartNote",
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <UserProvider>
        <body
          className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider />
          <Navbar />
          <main className="relative flex flex-grow min-h[calc(100vh-100px)]">
            {children}
          </main>
          <footer className="flex flex-row justify-center items-center py-2 border-t-1 border-t-primary h-[40px]">
            Made by&nbsp;
            <a href="https://www.linkedin.com/in/theoden-melgar/" className="text-primary hover:underline">
              Theoden Melgar
            </a>
          </footer>
        </body>
      </UserProvider>
    </html>
  );
}
