import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://vector.prodhosh.me"),
  title: {
    default: "Vector OS | The Ultimate Student Task Manager",
    template: "%s | Vector OS"
  },
  description: "A modern, kanban-driven task management operating system built specifically for students. Organize assignments, track deadlines, and sync your calendar in one premium dashboard.",
  keywords: ["student task manager", "kanban board", "student planner", "deadline tracking", "college organizer", "vector os", "productivity"],
  authors: [{ name: "PRODHOSH", url: "https://prodhosh.me" }],
  creator: "PRODHOSH",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vector.prodhosh.me",
    title: "Vector OS | The Ultimate Student Task Manager",
    description: "A modern, kanban-driven task management operating system built specifically for students. Stop losing track and start shipping work.",
    siteName: "Vector OS",
    images: [
      {
        url: "/vector-og-image.png",
        width: 1200,
        height: 630,
        alt: "Vector OS - The ultimate student task manager",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Vector OS | The Ultimate Student Task Manager",
    description: "A modern, kanban-driven task management operating system built specifically for students.",
    images: ["/vector-og-image.png"],
    creator: "@prodhosh"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
