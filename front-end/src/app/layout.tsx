import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Navbar from "@/src/components/layout/Navbar";
import { ToastProvider } from "../providers/ToastProvider";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Restaurant Queueing System",
  description:
    "Manage customer waitlists, table assignments, and queue tracking for restaurants.",
  keywords: [
    "restaurant",
    "queue",
    "waitlist",
    "table management",
    "restaurant management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="font-sans bg-cream text-text m-0 p-0 box-border">
        <Navbar />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
