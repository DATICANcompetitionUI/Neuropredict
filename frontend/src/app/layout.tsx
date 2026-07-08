import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StrokePredict AI — Intelligent Stroke Risk Assessment",
  description:
    "AI-powered stroke prediction platform using explainable machine learning. Get instant risk assessments with transparent, clinical-grade analysis.",
  keywords: [
    "stroke prediction",
    "AI medicine",
    "healthcare AI",
    "stroke risk assessment",
    "machine learning",
    "clinical decision support",
  ],
  authors: [{ name: "StrokePredict AI Team" }],
  openGraph: {
    title: "StrokePredict AI — Intelligent Stroke Risk Assessment",
    description:
      "AI-powered stroke risk prediction with explainable AI and real-time analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}